import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@16.12.0';

Deno.serve(async (req) => {
  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeKey || !webhookSecret) {
      console.error('Missing Stripe configuration');
      return Response.json({ error: 'Server not configured' }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey);
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return Response.json({ error: 'Missing signature' }, { status: 400 });
    }

    const body = await req.text();

    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // Map Stripe price IDs to plan tiers.
    // When new Stripe products are created, add their price IDs here.
    // This allows the webhook to automatically set the correct tier.
    const PRICE_TO_TIER = {
      // Old price — will be replaced:
      // 'price_1TqensROHfyHuQABkBuMWoWw': 'Pro',  // $49/mo legacy
      // New prices to be added after manual Stripe configuration:
      // '<pro_price_id>': 'Pro',       // $79/mo
      // '<pro_plus_price_id>': 'Pro+', // $199/mo
      // '<agency_price_id>': 'Agency', // $399/mo
    };

    function getTierFromSubscription(subscription) {
      if (!subscription?.items?.data?.length) return 'Pro';
      const priceId = subscription.items.data[0]?.price?.id;
      return PRICE_TO_TIER[priceId] || 'Pro';
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const appId = session.metadata?.base44_app_id || Deno.env.get("BASE44_APP_ID");
        console.log(`Checkout completed for app ${appId}, session ${session.id}`);

        if (session.customer_email) {
          try {
            const users = await base44.asServiceRole.entities.User.filter({ email: session.customer_email });
            if (users && users.length > 0) {
              // Determine tier from the subscription if available
              let tier = 'Pro'; // default
              if (session.subscription) {
                try {
                  const sub = await stripe.subscriptions.retrieve(session.subscription);
                  tier = getTierFromSubscription(sub);
                } catch {}
              }
              await base44.asServiceRole.entities.User.update(users[0].id, {
                subscription_tier: tier,
                subscription_status: 'active',
                stripe_customer_id: session.customer,
              });
              console.log(`Updated user ${users[0].id} to ${tier} tier`);
            }
          } catch (err) {
            console.error('Failed to update user:', err.message);
          }
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;
        console.log(`Invoice paid: ${invoice.id}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const status = subscription.status;
        const tier = getTierFromSubscription(subscription);
        console.log(`Subscription updated: ${subscription.id}, status: ${status}, tier: ${tier}`);

        if (subscription.customer) {
          try {
            const users = await base44.asServiceRole.entities.User.filter({ stripe_customer_id: subscription.customer });
            if (users && users.length > 0) {
              const newTier = status === 'active' || status === 'trialing' ? tier : 'Free';
              await base44.asServiceRole.entities.User.update(users[0].id, {
                subscription_tier: newTier,
                subscription_status: status,
              });
            }
          } catch (err) {
            console.error('Failed to update user on subscription update:', err.message);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log(`Subscription deleted: ${subscription.id}`);

        if (subscription.customer) {
          try {
            const users = await base44.asServiceRole.entities.User.filter({ stripe_customer_id: subscription.customer });
            if (users && users.length > 0) {
              await base44.asServiceRole.entities.User.update(users[0].id, {
                subscription_tier: 'Free',
                subscription_status: 'canceled',
              });
            }
          } catch (err) {
            console.error('Failed to update user on cancellation:', err.message);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});