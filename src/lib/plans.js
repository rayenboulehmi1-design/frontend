/**
 * Centralized plan configuration for ScoutyGo.
 * 
 * Access states:
 *   FULL     — feature is fully available
 *   LIMITED  — feature available but with usage caps
 *   PREVIEW  — read-only preview, upgrade for full access
 *   LOCKED   — feature not available on this plan
 *   COMING_SOON — feature not yet implemented
 * 
 * Usage limits are null until backend entitlements are configured.
 * Replace nulls with real values from the Replit backend entitlement system.
 */

export const PLANS = {
  Free: {
    id: 'free',
    name: 'Free',
    price: 0,
    providerPlanId: null,
    tagline: 'Explore the platform',
    teamSeats: 0,
    features: {
      opportunityIntelligence: { access: 'PREVIEW', limit: null },
      opportunityDetails: { access: 'PREVIEW', limit: null },
      confidenceScores: { access: 'PREVIEW', limit: null },
      evidenceAndSources: { access: 'LOCKED', limit: null },
      search: { access: 'LIMITED', limit: null },
      filters: { access: 'LIMITED', limit: null },
      savedOpportunities: { access: 'LIMITED', limit: 5 },
      alerts: { access: 'LIMITED', limit: 1 },
      missions: { access: 'LIMITED', limit: 0 },
      aiAnalysis: { access: 'LOCKED', limit: null },
      geographicIntelligence: { access: 'PREVIEW', limit: null },
      categoryIntelligence: { access: 'PREVIEW', limit: null },
      historicalIntelligence: { access: 'LOCKED', limit: null },
      dataExport: { access: 'LOCKED', limit: null },
      watchlist: { access: 'LOCKED', limit: null },
      leadsProvider: { access: 'LOCKED', limit: null },
      decisionMakerDiscovery: { access: 'LOCKED', limit: null },
      contactEnrichment: { access: 'LOCKED', limit: null },
      aiOutreachAssistance: { access: 'LOCKED', limit: null },
      opportunityCRM: { access: 'LOCKED', limit: null },
      crmIntegrations: { access: 'LOCKED', limit: null },
      apiAccess: { access: 'LOCKED', limit: null },
      clientWorkspaces: { access: 'LOCKED', limit: null },
      whiteLabelReports: { access: 'LOCKED', limit: null },
      teamMembers: { access: 'LOCKED', limit: 0 },
      prioritySupport: false,
    },
  },
  Pro: {
    id: 'pro',
    name: 'Pro',
    price: 79,
    providerPlanId: null,
    tagline: 'For individual professionals discovering opportunities',
    teamSeats: 0,
    features: {
      opportunityIntelligence: { access: 'LIMITED', limit: null },
      opportunityDetails: { access: 'LIMITED', limit: null },
      confidenceScores: { access: 'LIMITED', limit: null },
      evidenceAndSources: { access: 'LIMITED', limit: null },
      search: { access: 'LIMITED', limit: null },
      filters: { access: 'LIMITED', limit: null },
      savedOpportunities: { access: 'LIMITED', limit: null },
      alerts: { access: 'LIMITED', limit: null },
      missions: { access: 'LIMITED', limit: null },
      aiAnalysis: { access: 'LIMITED', limit: null },
      geographicIntelligence: { access: 'PREVIEW', limit: null },
      categoryIntelligence: { access: 'PREVIEW', limit: null },
      historicalIntelligence: { access: 'LIMITED', limit: null },
      dataExport: { access: 'LIMITED', limit: null },
      watchlist: { access: 'LIMITED', limit: null },
      leadsProvider: { access: 'LOCKED', limit: null },
      decisionMakerDiscovery: { access: 'LOCKED', limit: null },
      contactEnrichment: { access: 'LOCKED', limit: null },
      aiOutreachAssistance: { access: 'LOCKED', limit: null },
      opportunityCRM: { access: 'LOCKED', limit: null },
      crmIntegrations: { access: 'LOCKED', limit: null },
      apiAccess: { access: 'LOCKED', limit: null },
      clientWorkspaces: { access: 'LOCKED', limit: null },
      whiteLabelReports: { access: 'LOCKED', limit: null },
      teamMembers: { access: 'LOCKED', limit: 0 },
      prioritySupport: false,
    },
  },
  'Pro+': {
    id: 'pro_plus',
    name: 'Pro+',
    price: 199,
    providerPlanId: null,
    tagline: 'Advanced intelligence for serious dealmakers',
    teamSeats: 0,
    features: {
      opportunityIntelligence: { access: 'FULL', limit: null },
      opportunityDetails: { access: 'FULL', limit: null },
      confidenceScores: { access: 'FULL', limit: null },
      evidenceAndSources: { access: 'FULL', limit: null },
      search: { access: 'FULL', limit: null },
      filters: { access: 'FULL', limit: null },
      savedOpportunities: { access: 'LIMITED', limit: null },
      alerts: { access: 'LIMITED', limit: null },
      missions: { access: 'LIMITED', limit: null },
      aiAnalysis: { access: 'LIMITED', limit: null },
      geographicIntelligence: { access: 'FULL', limit: null },
      categoryIntelligence: { access: 'FULL', limit: null },
      historicalIntelligence: { access: 'FULL', limit: null },
      dataExport: { access: 'LIMITED', limit: null },
      watchlist: { access: 'FULL', limit: null },
      leadsProvider: { access: 'LIMITED', limit: null },
      decisionMakerDiscovery: { access: 'LIMITED', limit: null },
      contactEnrichment: { access: 'LIMITED', limit: null },
      aiOutreachAssistance: { access: 'LIMITED', limit: null },
      opportunityCRM: { access: 'LIMITED', limit: null },
      crmIntegrations: { access: 'LIMITED', limit: null },
      apiAccess: { access: 'LIMITED', limit: null },
      clientWorkspaces: { access: 'LOCKED', limit: null },
      whiteLabelReports: { access: 'LOCKED', limit: null },
      teamMembers: { access: 'LOCKED', limit: 0 },
      prioritySupport: true,
    },
  },
  Agency: {
    id: 'agency',
    name: 'Agency',
    price: 399,
    providerPlanId: null,
    tagline: 'The fullest intelligence workspace for agencies and small teams',
    teamSeats: 3,
    features: {
      opportunityIntelligence: { access: 'FULL', limit: null },
      opportunityDetails: { access: 'FULL', limit: null },
      confidenceScores: { access: 'FULL', limit: null },
      evidenceAndSources: { access: 'FULL', limit: null },
      search: { access: 'FULL', limit: null },
      filters: { access: 'FULL', limit: null },
      savedOpportunities: { access: 'FULL', limit: null },
      alerts: { access: 'FULL', limit: null },
      missions: { access: 'FULL', limit: null },
      aiAnalysis: { access: 'FULL', limit: null },
      geographicIntelligence: { access: 'FULL', limit: null },
      categoryIntelligence: { access: 'FULL', limit: null },
      historicalIntelligence: { access: 'FULL', limit: null },
      dataExport: { access: 'FULL', limit: null },
      watchlist: { access: 'FULL', limit: null },
      leadsProvider: { access: 'FULL', limit: null },
      decisionMakerDiscovery: { access: 'FULL', limit: null },
      contactEnrichment: { access: 'FULL', limit: null },
      aiOutreachAssistance: { access: 'FULL', limit: null },
      opportunityCRM: { access: 'FULL', limit: null },
      crmIntegrations: { access: 'FULL', limit: null },
      apiAccess: { access: 'FULL', limit: null },
      clientWorkspaces: { access: 'FULL', limit: null },
      whiteLabelReports: { access: 'FULL', limit: null },
      teamMembers: { access: 'FULL', limit: 3 },
      prioritySupport: true,
    },
  },
};

export const PLAN_ORDER = ['Free', 'Pro', 'Pro+', 'Agency'];

export const PLAN_TIERS = ['Free', 'Pro', 'Pro+', 'Agency'];

/**
 * Get the plan configuration for a given tier name.
 */
export function getPlan(tier) {
  return PLANS[tier] || PLANS.Free;
}

/**
 * Check if a feature is accessible on a given plan.
 * Returns one of: 'FULL', 'LIMITED', 'PREVIEW', 'LOCKED', 'COMING_SOON'
 */
export function getFeatureAccess(tier, featureKey) {
  const plan = getPlan(tier);
  const feature = plan.features[featureKey];
  if (!feature) return 'LOCKED';
  return feature.access;
}

/**
 * Check if a feature is fully available (not locked, not preview-only).
 */
export function hasAccess(tier, featureKey) {
  const access = getFeatureAccess(tier, featureKey);
  return access === 'FULL' || access === 'LIMITED';
}

/**
 * Get the minimum plan that unlocks a feature.
 */
export function getMinimumPlanForFeature(featureKey) {
  for (const tier of ['Pro', 'Pro+', 'Agency']) {
    const access = getFeatureAccess(tier, featureKey);
    if (access === 'FULL' || access === 'LIMITED') return tier;
  }
  return null;
}

/**
 * Trial configuration.
 * Backend requirements for secure trial:
 * - trial_start stored server-side on User entity (Replit backend)
 * - trial_expiry = trial_start + 30 minutes (server-calculated)
 * - One trial per email (enforced server-side)
 * - One trial per device fingerprint (enforced server-side where possible)
 * - Trial state returned via authenticated API call, not browser localStorage
 */
export const TRIAL_CONFIG = {
  durationMinutes: 30,
  restrictedDuringTrial: [
    'dataExport',
    'apiAccess',
    'contactEnrichment',
    'leadsProvider',
  ],
};