import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * Whop webhook handler.
 *
 * Verifies Standard Webhooks signatures and processes payment/membership events
 * to update user subscription tier and status.
 *
 * Register this endpoint URL in the Whop Dashboard > Developer > Webhooks.
 * Select events: payment.succeeded, membership.activated, membership.deactivated.
 */
Deno.serve(async (req) => {
  try {
    const webhookSecret = Deno.env.get("WHOP_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.error('WHOP_WEBHOOK_SECRET not set');
      return Response.json({ error: 'Server not configured' }, { status: 500 });
    }

    const webhookId = req.headers.get('webhook-id');
    const webhookTimestamp = req.headers.get('webhook-timestamp');
    const webhookSignature = req.headers.get('webhook-signature');

    if (!webhookId || !webhookTimestamp || !webhookSignature) {
      return Response.json({ error: 'Missing webhook headers' }, { status: 400 });
    }

    const rawBody = await req.text();

    // Verify Standard Webhooks signature (HMAC-SHA256)
    const signedPayload = `${webhookId}.${webhookTimestamp}.${rawBody}`;
    const keyBytes = new TextEncoder().encode(webhookSecret);
    const cryptoKey = await crypto.subtle.importKey(
      'raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const sigBuffer = await crypto.subtle.sign(
      'HMAC', cryptoKey, new TextEncoder().encode(signedPayload)
    );
    const expectedSig = btoa(String.fromCharCode(...new Uint8Array(sigBuffer)));

    // Signatures are space-delimited, each prefixed with "v1,"
    const signatures = webhookSignature.split(' ')
      .filter((s: string) => s.startsWith('v1,'))
      .map((s: string) => s.slice(3));

    const isValid = signatures.some((sig: string) => sig === expectedSig);
    if (!isValid) {
      console.error('Webhook signature verification failed');
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const event = JSON.parse(rawBody);

    // Map plan name from checkout metadata to subscription tier
    function getTierFromMetadata(metadata: Record<string, unknown> | undefined): string {
      const plan = metadata?.plan;
      if (plan === 'Pro' || plan === 'Pro+' || plan === 'Agency') return plan as string;
      return 'Pro';
    }

    // Find user by Whop membership ID or email
    async function findUserByMembershipId(membershipId: string | undefined) {
      if (!membershipId) return null;
      const users = await base44.asServiceRole.entities.User.filter({ whop_membership_id: membershipId });
      return users && users.length > 0 ? users[0] : null;
    }

    async function findUserByEmail(email: string | undefined) {
      if (!email) return null;
      const users = await base44.asServiceRole.entities.User.filter({ email });
      return users && users.length > 0 ? users[0] : null;
    }

    switch (event.type) {
      case 'payment.succeeded': {
        const payment = event.data;
        const tier = getTierFromMetadata(payment?.metadata);
        const membershipId = payment?.membership_id || payment?.member?.id;
        const email = payment?.email || payment?.member?.email;
        console.log(`Payment succeeded: ${payment?.id}, tier: ${tier}`);

        const user = await findUserByMembershipId(membershipId) || await findUserByEmail(email);
        if (user) {
          await base44.asServiceRole.entities.User.update(user.id, {
            subscription_tier: tier,
            subscription_status: 'active',
            ...(membershipId ? { whop_membership_id: membershipId } : {}),
          });
          console.log(`Updated user ${user.id} to ${tier} tier`);
        } else {
          console.error(`No user found for payment ${payment?.id} (membership: ${membershipId}, email: ${email})`);
        }
        break;
      }

      case 'membership.activated': {
        const membership = event.data;
        const tier = getTierFromMetadata(membership?.metadata);
        const membershipId = membership?.id;
        const email = membership?.user?.email || membership?.email;
        console.log(`Membership activated: ${membershipId}, tier: ${tier}`);

        const user = await findUserByMembershipId(membershipId) || await findUserByEmail(email);
        if (user) {
          await base44.asServiceRole.entities.User.update(user.id, {
            subscription_tier: tier,
            subscription_status: 'active',
            ...(membershipId ? { whop_membership_id: membershipId } : {}),
          });
        }
        break;
      }

      case 'membership.deactivated': {
        const membership = event.data;
        const membershipId = membership?.id;
        const email = membership?.user?.email || membership?.email;
        console.log(`Membership deactivated: ${membershipId}`);

        const user = await findUserByMembershipId(membershipId) || await findUserByEmail(email);
        if (user) {
          await base44.asServiceRole.entities.User.update(user.id, {
            subscription_tier: 'Free',
            subscription_status: 'cancelled',
          });
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