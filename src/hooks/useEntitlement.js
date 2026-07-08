import { useState, useEffect, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { getPlan, getFeatureAccess, hasAccess, getMinimumPlanForFeature } from "@/lib/plans";
import { useDemoMode } from "@/lib/demoMode";
import { DEMO_USER } from "@/lib/demoData";

/**
 * Centralized entitlement hook.
 * 
 * Determines the current user's plan, feature access levels, trial state,
 * and usage information from the authenticated user object.
 * 
 * In demo mode, returns the demo user with Pro+ tier.
 * 
 * Backend requirements for full entitlement enforcement:
 * - User entity must carry subscription_tier, subscription_status, trial_start, trial_expiry
 * - Usage counts (alerts used, missions used, etc.) must come from server-side tracking
 * - Whop webhook must map plan metadata to subscription tiers
 */
export function useEntitlement() {
  const isDemo = useDemoMode();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemo) {
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }
    base44.auth.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [isDemo]);

  const tier = user?.subscription_tier || 'Free';
  const plan = getPlan(tier);

  const checkAccess = useCallback((featureKey) => {
    return getFeatureAccess(tier, featureKey);
  }, [tier]);

  const canAccess = useCallback((featureKey) => {
    return hasAccess(tier, featureKey);
  }, [tier]);

  const getUpgradePlan = useCallback((featureKey) => {
    return getMinimumPlanForFeature(featureKey);
  }, []);

  // Trial state — frontend preview only.
  // Secure enforcement requires server-side trial_start and trial_expiry on the User entity.
  const trialState = useMemo(() => {
    if (!user) return { isActive: false, remainingMinutes: 0, secondsLeft: 0 };
    return { isActive: false, remainingMinutes: 0, secondsLeft: 0 };
  }, [user]);

  return {
    user,
    tier,
    plan,
    loading,
    trial: trialState,
    checkAccess,
    canAccess,
    getUpgradePlan,
    isAdmin: user?.role === 'admin',
  };
}