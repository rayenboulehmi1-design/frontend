import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * Whop checkout session creation.
 *
 * Creates a Whop checkout configuration with an inline renewal plan and
 * returns the hosted checkout URL for redirect.
 *
 * MANUAL WHOP CONFIGURATION REQUIRED:
 * 1. Create a Whop company account — find your company_id in Dashboard > Settings
 * 2. Set WHOP_COMPANY_ID below (or as an environment variable)
 * 3. Optionally create Whop products for each plan and set the access_pass_id values
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const { plan, successUrl, cancelUrl } = body;

    // Whop company ID — find in Whop Dashboard > Settings
    const WHOP_COMPANY_ID = null; // TODO: Set to your Whop company ID (e.g. "biz_xxxxx")

    // Plan configuration: price and optional pre-created Whop product (access_pass_id)
    const PLAN_CONFIG: Record<string, { price: number; accessPassId: string | null }> = {
      'Pro': { price: 79, accessPassId: null },
      'Pro+': { price: 199, accessPassId: null },
      'Agency': { price: 399, accessPassId: null },
    };

    const config = plan && PLAN_CONFIG[plan];
    if (!config) {
      return Response.json({
        error: 'Unknown plan.',
        errorType: 'PLAN_NOT_CONFIGURED',
      }, { status: 400 });
    }

    const apiKey = Deno.env.get("WHOP_API_KEY");
    const companyId = WHOP_COMPANY_ID || Deno.env.get("WHOP_COMPANY_ID");

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

    // Try to get the user for customer email
    let customerEmail: string | null = null;
    try {
      const user = await base44.auth.me();
      customerEmail = user?.email || null;
    } catch {
      // Public app or not logged in — proceed without customer email
    }

    const origin = successUrl ? new URL(successUrl).origin : (req.headers.get('origin') || req.headers.get('referer')?.replace(/\/$/, '') || 'https://silky-scout-path-go.base44.app');
    const finalSuccessUrl = successUrl || `${origin}/account-overview?status=success`;
    const finalCancelUrl = cancelUrl || `${origin}/account-overview?status=cancelled`;

    // Create a Whop checkout configuration with an inline renewal (subscription) plan
    const checkoutBody: Record<string, unknown> = {
      company_id: companyId,
      plan: {
        initial_price: config.price,
        renewal_price: config.price,
        plan_type: 'renewal',
        billing_period: 'monthly',
        ...(config.accessPassId ? { access_pass_id: config.accessPassId } : {}),
      },
      metadata: {
        base44_app_id: Deno.env.get("BASE44_APP_ID") || '',
        plan: plan,
      },
    };

    if (customerEmail) {
      checkoutBody.email = customerEmail;
    }

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

    // Build the checkout URL — Whop hosted checkout redirect
    const checkoutId = checkout.id || checkout.plan?.id;
    const checkoutUrl = checkout.checkout_url || checkout.hosted_url ||
      (checkoutId ? `https://whop.com/checkout/${checkoutId}` : null);

    if (!checkoutUrl) {
      console.error('Whop checkout response missing URL/ID:', JSON.stringify(checkout));
      return Response.json({ error: 'Could not create checkout session.' }, { status: 500 });
    }

    return Response.json({
      url: checkoutUrl,
      successUrl: finalSuccessUrl,
      cancelUrl: finalCancelUrl,
    });
  } catch (error) {
    console.error('Checkout error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});