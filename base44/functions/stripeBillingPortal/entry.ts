import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@16.12.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY not set');
      return Response.json({ error: 'Payment server not configured' }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey);

    let customerId = null;
    try {
      const user = await base44.auth.me();
      if (!user) return Response.json({ error: 'Authentication required' }, { status: 401 });

      if (user.stripe_customer_id) {
        customerId = user.stripe_customer_id;
      } else if (user.email) {
        const customers = await stripe.customers.list({ email: user.email, limit: 1 });
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        }
      }
    } catch (err) {
      console.error('Auth error:', err.message);
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!customerId) {
      return Response.json({ error: 'No billing account found. Please subscribe first.' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const origin = req.headers.get('origin') || 'https://silky-scout-path-go.base44.app';
    const returnUrl = body.returnUrl || `${origin}/account-overview`;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Billing portal error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});