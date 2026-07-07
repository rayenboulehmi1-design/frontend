import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@16.12.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const { priceId, successUrl, cancelUrl } = body;

    if (!priceId) {
      return Response.json({ error: 'Missing priceId' }, { status: 400 });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY not set');
      return Response.json({ error: 'Payment server not configured' }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey);

    // Try to get the user for customer email — works for authenticated apps
    let customerEmail = null;
    try {
      const user = await base44.auth.me();
      customerEmail = user?.email || null;
    } catch {
      // Public app or not logged in — proceed without customer email
    }

    // Determine the app origin for redirect URLs
    const origin = successUrl ? new URL(successUrl).origin : (req.headers.get('origin') || req.headers.get('referer')?.replace(/\/$/, '') || 'https://silky-scout-path-go.base44.app');

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
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