import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@16.12.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const { priceId, plan, successUrl, cancelUrl } = body;

    // Plan-based price ID lookup.
    // MANUAL STRIPE CONFIGURATION REQUIRED:
    // Create Stripe products/prices for Pro ($79), Pro+ ($199), Agency ($399)
    // Then set the price IDs in the PLAN_PRICE_IDS map below.
    //
    // The existing ScoutyGo Pro product (prod_UqLU62F3qPJTqN) was at $49/mo.
    // It needs to be replaced with the new $79/mo price.
    const PLAN_PRICE_IDS = {
      'Pro': null,      // TODO: Set to new Stripe price ID for Pro $79/mo
      'Pro+': null,     // TODO: Set to new Stripe price ID for Pro+ $199/mo
      'Agency': null,   // TODO: Set to new Stripe price ID for Agency $399/mo
    };

    // Resolve the price ID: use explicit priceId, or look up by plan name
    const resolvedPriceId = priceId || (plan && PLAN_PRICE_IDS[plan]);

    if (!resolvedPriceId) {
      const available = Object.entries(PLAN_PRICE_IDS).filter(([_, id]) => id).map(([p]) => p);
      return Response.json({
        error: 'No price ID configured for this plan. Stripe products need to be created manually.',
        errorType: 'PRICE_NOT_CONFIGURED',
        requiredPlans: ['Pro', 'Pro+', 'Agency'],
        configuredPlans: available,
      }, { status: 400 });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY not set');
      return Response.json({ error: 'Payment server not configured' }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey);

    // Try to get the user for customer email
    let customerEmail = null;
    try {
      const user = await base44.auth.me();
      customerEmail = user?.email || null;
    } catch {
      // Public app or not logged in — proceed without customer email
    }

    const origin = successUrl ? new URL(successUrl).origin : (req.headers.get('origin') || req.headers.get('referer')?.replace(/\/$/, '') || 'https://silky-scout-path-go.base44.app');

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: resolvedPriceId, quantity: 1 }],
      success_url: successUrl || `${origin}/account-overview?status=success`,
      cancel_url: cancelUrl || `${origin}/account-overview?status=cancelled`,
      customer_email: customerEmail || undefined,
      metadata: {
        base44_app_id: Deno.env.get("BASE44_APP_ID") || '',
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});