import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * Whop subscription management.
 *
 * Redirects the user to Whop's member dashboard where they can manage
 * their subscriptions, update payment methods, change plans, or cancel.
 *
 * Future: When the Replit backend becomes the source of truth for subscription
 * status, this will redirect to a Replit-hosted subscription management portal.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Authenticate the user — subscription management requires a logged-in user
    let user = null;
    try {
      user = await base44.auth.me();
    } catch {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Redirect to Whop's member dashboard where users manage their subscriptions
    const manageUrl = 'https://whop.com/dashboard';

    return Response.json({ url: manageUrl });
  } catch (error) {
    console.error('Subscription management error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});