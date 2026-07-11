import { base44 } from "@/api/base44Client";

/**
 * ScoutyGo centralized API client.
 *
 * All data comes from the Replit Intelligence Engine via the `scoutygoApi`
 * backend function (generic proxy) and the existing `scoutygoSignals` function.
 *
 * Error states (status field):
 *   'loading'       — request in flight
 *   'success'       — data received
 *   'empty'         — request succeeded but no data returned
 *   'notfound'      — specific resource not found (e.g. opportunity ID doesn't exist)
 *   'unsupported'   — endpoint/capability not implemented on Replit (404 on capability route)
 *   'auth_required' — user not authenticated (401)
 *   'error'         — server error, timeout, or retry exhaustion
 *
 * Replit API Route Map (verified 2026-07-11):
 *   ✅ GET /opportunities           — { opportunities: [...], pagination: {...} }
 *   ✅ GET /opportunities/:id       — { opportunity: {...} }
 *   ✅ GET /stats                   — { platform: {...}, byCategory: {...}, generatedAt }
 *   ❌ GET /search                  — 404 (no dedicated search endpoint)
 *   ❌ GET /opportunities?q=...     — param ignored (returns unfiltered list)
 *   ❌ GET /missions                — 404
 *   ❌ GET /persons                 — 404
 *   ❌ GET /prospects               — 404
 *   ❌ GET /discovery-missions      — 404
 *   ❌ GET /companies               — 404
 *   ❌ GET /notifications           — 404
 *   ❌ GET /users/me                — 404
 *   ❌ GET /users/me/entitlements   — 404
 *   ❌ GET /opportunities/:id/company          — 404
 *   ❌ GET /opportunities/:id/people           — 404
 *   ❌ GET /opportunities/:id/evidence         — 404
 *   ❌ GET /opportunities/:id/brief            — 404
 *   ❌ GET /opportunities/:id/buying-committee — 404
 *   ❌ GET /opportunities/:id/decision-makers  — 404
 *   ❌ GET /opportunities/:id/sources          — 404
 *
 * Embedded data in opportunity detail payload:
 *   - `companies` — array of { name, role, roleConfidence, evidenceSnippet, entityConfidence, sourceRawSignalId }
 *   - `signals` — array of strings (commercial signal tags)
 *   - `nextBestAction` — string (engine-suggested action)
 *   - `sourceUrl`, `sourceType` — provenance data
 *   - `confidenceScore`, `matchScore`, `actionabilityScore` — engine scores
 */

const MAX_RETRIES = 2;
const RETRY_BASE_DELAY = 800;

/**
 * Build a standardized result object from raw API response data.
 * @param {object} data - Raw response from scoutygoApi function
 * @param {string} fallbackStatus - Status if no error
 * @param {object} options - { on404: 'notfound' | 'unsupported' }
 */
function buildResult(data, fallbackStatus = 'success', options = {}) {
  if (!data) return { data: null, status: 'empty', error: null };
  if (data.error) {
    if (data.errorType === 'AUTH_REQUIRED') {
      return { data: null, status: 'auth_required', error: data.error };
    }
    if (data.upstreamStatus === 404) {
      return { data: null, status: options.on404 || 'unsupported', error: data.error };
    }
    return { data: null, status: 'error', error: data.error };
  }
  return { data, status: fallbackStatus, error: null };
}

/**
 * Generic GET request to the Replit API via the scoutygoApi proxy.
 * @param {string} path - API path (must start with /)
 * @param {object} params - Query parameters
 * @param {object} options - { on404: 'notfound' | 'unsupported' }
 */
async function apiGet(path, params = {}, options = {}) {
  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await base44.functions.invoke("scoutygoApi", { path, params });
      const data = res.data;

      if (data && data.error) {
        // Don't retry 404s or auth errors — they won't succeed on retry
        if (data.upstreamStatus === 404 || data.errorType === 'AUTH_REQUIRED') {
          return buildResult(data, 'error', options);
        }
        throw new Error(data.error);
      }

      return buildResult(data, 'success', options);
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_BASE_DELAY * (attempt + 1)));
      }
    }
  }

  return { data: null, status: 'error', error: lastError?.message || 'Request failed after retries' };
}

// ─── Opportunities / Signals ───

export async function fetchSignalsWithMeta(limit = 200) {
  const res = await base44.functions.invoke("scoutygoSignals", { limit });
  const data = res.data;
  const signals = data.signals || [];
  const stats = data.stats || null;

  let status;
  if (data.error) status = 'error';
  else if (signals.length === 0) status = 'empty';
  else status = 'success';

  return {
    signals,
    stats,
    pagination: data.pagination || null,
    status,
    error: data.error || null,
    lastUpdated: new Date().toISOString(),
  };
}

export async function fetchSignals(limit = 200) {
  const data = await fetchSignalsWithMeta(limit);
  return data.signals;
}

export async function fetchSignalById(id, limit = 200) {
  const data = await fetchSignalsWithMeta(limit);
  const signals = data.signals || [];
  return signals.find((s) => String(s.id) === String(id)) || null;
}

/**
 * Fetch a single opportunity detail from Replit.
 * Uses GET /opportunities/:id, falls back to list-based lookup.
 * A 404 on this endpoint means the opportunity doesn't exist (notfound),
 * not that the capability is unsupported.
 */
export async function getOpportunityDetail(id) {
  const direct = await apiGet(`/opportunities/${id}`, {}, { on404: 'notfound' });
  if (direct.status === 'success' && direct.data) {
    const opp = direct.data.opportunity || direct.data;
    return { data: opp, status: 'success', error: null };
  }

  // Fall back to list-based lookup
  const listResult = await apiGet('/opportunities', { limit: 200 });
  if (listResult.status === 'success' && listResult.data) {
    const opps = listResult.data.opportunities || [];
    const opp = opps.find((o) => String(o.id) === String(id));
    if (opp) return { data: opp, status: 'success', error: null };
    return { data: null, status: 'notfound', error: 'Opportunity not found' };
  }

  return { data: null, status: direct.status === 'notfound' ? 'notfound' : 'error', error: direct.error || listResult.error };
}

// ─── Company Intelligence (composed from opportunity detail) ───

/**
 * Normalize company intelligence from the opportunity detail payload.
 *
 * The Replit opportunity object embeds a `companies` array with role,
 * confidence, and evidence snippets. This is the real company intelligence
 * available today — no separate /company endpoint exists.
 *
 * Capabilities NOT available in the current Replit deployment:
 * - Executive AI brief (no /opportunities/:id/brief endpoint)
 * - Decision makers / people (no /opportunities/:id/people endpoint)
 * - Evidence timeline (no /opportunities/:id/evidence endpoint)
 * - Buyer intent score (not in opportunity payload)
 * - Quality gate (not in opportunity payload)
 * - Prospect status (not in opportunity payload)
 * - Top reasons (not in opportunity payload)
 * - Missing evidence (not in opportunity payload)
 */
export function composeCompanyIntelligence(opp) {
  if (!opp) return null;

  return {
    // ─── Available from opportunity detail ───
    companyName: opp.company || opp.title || 'Company',
    summary: opp.summary || opp.description,
    description: opp.description,
    country: opp.country,
    city: opp.city,
    industry: opp.category,
    subcategory: opp.subcategory,
    opportunityType: opp.opportunityType,
    stage: opp.stage,
    lifecycleState: opp.lifecycleState,
    status: opp.status,
    confidenceScore: opp.confidenceScore,
    matchScore: opp.matchScore,
    actionabilityScore: opp.actionabilityScore,
    estimatedValue: opp.estimatedValue,
    estimatedTimeline: opp.estimatedTimeline,
    urgency: opp.urgency,
    verificationStatus: opp.verificationStatus,
    sourceUrl: opp.sourceUrl,
    sourceType: opp.sourceType,
    nextBestAction: opp.nextBestAction,
    signals: Array.isArray(opp.signals) ? opp.signals : [],
    tags: Array.isArray(opp.tags) ? opp.tags : [],
    detectedAt: opp.detectedAt,
    createdAt: opp.createdAt,
    updatedAt: opp.updatedAt,
    companies: Array.isArray(opp.companies) ? opp.companies.map(c => ({
      name: c.name,
      role: c.role,
      roleConfidence: c.roleConfidence,
      entityConfidence: c.entityConfidence,
      evidenceSnippet: c.evidenceSnippet,
      sourceRawSignalId: c.sourceRawSignalId,
    })) : [],

    // ─── NOT available in current Replit deployment ───
    // These are intentionally absent — the page must show 'unsupported' states.
  };
}

// ─── Stats ───

export async function getStats() {
  return apiGet('/stats');
}

// ─── Search ───

/**
 * Global search.
 *
 * NOT IMPLEMENTED — the Replit backend does not expose a /search endpoint,
 * and the /opportunities listing does not support query filtering (the `q`
 * parameter is ignored, returning the full unfiltered list).
 *
 * Do NOT simulate global search with client-side filtering of incomplete
 * datasets. This method returns 'unsupported' until a backend search
 * endpoint is deployed.
 *
 * Backend dependency: GET /search?q=<query>&limit=<n>
 */
export async function search(_query, _limit = 20) {
  return { data: null, status: 'unsupported', error: 'Search endpoint not available on the Intelligence Engine' };
}