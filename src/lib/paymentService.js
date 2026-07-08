import { base44 } from "@/api/base44Client";

/**
 * Centralized payment service abstraction.
 *
 * The application calls this generic interface for all payment operations.
 * The current provider is Whop. To switch providers in the future, only this
 * file needs to change — all calling components use startCheckout() and
 * openSubscriptionManagement() without knowing the underlying provider.
 *
 * Future: When the Replit backend becomes the source of truth for subscription
 * status, this service will proxy calls to Replit instead of calling Whop directly.
 */

/**
 * Start a checkout session for a given plan.
 * Redirects the user to the payment provider's hosted checkout page.
 *
 * @param {string} planName - The plan tier to subscribe to (e.g. "Pro", "Pro+", "Agency")
 * @param {object} options - Optional { successUrl, cancelUrl }
 * @returns {Promise<{url: string}>} The checkout URL to redirect to
 */
export async function startCheckout(planName, options = {}) {
  if (window.self !== window.top) {
    throw new Error("Checkout works only from a published app. Please open the app in a new tab to subscribe.");
  }

  const res = await base44.functions.invoke("createCheckout", {
    plan: planName,
    successUrl: options.successUrl,
    cancelUrl: options.cancelUrl,
  });

  if (res.data?.url) {
    return { url: res.data.url };
  }

  if (res.data?.errorType === "PLAN_NOT_CONFIGURED") {
    throw new Error("This plan is not yet available for purchase. Whop pricing configuration is in progress.");
  }

  throw new Error(res.data?.error || "Could not start checkout. Please try again.");
}

/**
 * Open the subscription management portal.
 * Redirects the user to the payment provider's subscription management page
 * where they can update payment methods, change plans, or cancel.
 *
 * @param {object} options - Optional { returnUrl }
 * @returns {Promise<{url: string}>} The portal URL to redirect to
 */
export async function openSubscriptionManagement(options = {}) {
  if (window.self !== window.top) {
    throw new Error("Subscription management works only from a published app. Please open the app in a new tab.");
  }

  const res = await base44.functions.invoke("manageSubscription", {
    returnUrl: options.returnUrl,
  });

  if (res.data?.url) {
    return { url: res.data.url };
  }

  throw new Error(res.data?.error || "Could not open subscription management.");
}