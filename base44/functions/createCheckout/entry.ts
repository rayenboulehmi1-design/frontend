import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * Whop checkout session creation.
 *
 * Creates a Whop checkout configuration with an inline plan and product,
 * returns the hosted checkout URL (purchase_url) for redirect.
 *
 * Whop API reference:
 *   POST https://api.whop.com/api/v1/checkout_configurations
 *   company_id goes inside plan, billing_period is in days (30=monthly)
 *   Response includes purchase_url for hosted checkout redirect
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const { plan, successUrl, cancelUrl } = body;

    // Plan configuration: price and display name
    const PLAN_CONFIG: Record<string, { price: number; title: string; description: string }> = {
      'Pro': { price: 79, title: 'ScoutyGo Pro', description: 'Pro intelligence plan — $79/month' },
      'Pro+': { price: 199, title: 'ScoutyGo Pro+', description: 'Advanced intelligence plan — $199/month' },
      'Agency': { price: 399, title: 'ScoutyGo Agency', description: 'Agency intelligence plan — $399/month' },
    };

    const config = plan && PLAN_CONFIG[plan];
    if (!config) {
      return Response.json({
        error: 'Unknown plan.',
        errorType: 'PLAN_NOT_CONFIGURED',
      }, { status: 400 });
    }

    const apiKey = Deno.env.get("WHOP_API_KEY");
    const companyId = Deno.env.get("WHOP_COMPANY_ID");

    if (!apiKey) {
      console.error('WHOP_API_KEY not set');
      return Response.json({ error: 'Payment server not configured' }, { status: 500 });
    }

    if (!companyId) {
      console.error('WHOP_COMPANY_ID not set');
      return Response.json({
        error: 'Whop company ID not configured.',
        errorType: 'PLAN_NOT_CONFIGURED',
      }, { status: 400 });
    }

    const origin = successUrl ? new URL(successUrl).origin : (req.headers.get('origin') || req.headers.get('referer')?.replace(/\/$/, '') || 'https://whop.com');
    const finalSuccessUrl = successUrl || `${origin}/account-overview?status=success`;

    // Create a Whop checkout configuration with inline plan + product
    const checkoutBody = {
      mode: 'payment',
      redirect_url: finalSuccessUrl,
      metadata: {
        base44_app_id: Deno.env.get("BASE44_APP_ID") || '',
        plan: plan,
      },
      plan: {
        company_id: companyId,
        initial_price: config.price,
        renewal_price: config.price,
        billing_period: 30, // 30 days = monthly
        currency: 'usd',
        product: {
          title: config.title,
          description: config.description,
          external_identifier: `scoutygo-${plan.toLowerCase().replace('+', 'plus')}`,
        },
      },
    };

    const whopRes = await fetch('https://api.whop.com/api/v1/checkout_configurations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutBody),
      signal: AbortSignal.timeout(15000),
    });

    if (!whopRes.ok) {
      const errText = await whopRes.text();
      console.error(`Whop API returned ${whopRes.status}:`, errText);
      return Response.json({
        error: `Whop API returned ${whopRes.status}`,
        errorType: 'UPSTREAM_ERROR',
      }, { status: 502 });
    }

    const checkout = await whopRes.json();

    // Whop returns purchase_url for hosted checkout
    const checkoutUrl = checkout.purchase_url || checkout.checkout_url || checkout.hosted_url;

    if (!checkoutUrl) {
      console.error('Whop checkout response missing purchase_url:', JSON.stringify(checkout));
      return Response.json({ error: 'Could not create checkout session.' }, { status: 500 });
    }

    return Response.json({
      url: checkoutUrl,
      successUrl: finalSuccessUrl,
      cancelUrl: cancelUrl || `${origin}/account-overview?status=cancelled`,
    });
  } catch (error) {
    console.error('Checkout error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});