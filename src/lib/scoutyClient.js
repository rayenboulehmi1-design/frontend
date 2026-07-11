import { base44 } from "@/api/base44Client";

/**
 * ScoutyGo centralized API client.
 *
 * All data comes from the Replit Intelligence Engine via the `scoutygoApi`
 * backend function (generic proxy) and the existing `scoutygoSignals` function.
 *
 * Features:
 * - Retry with exponential backoff (max 2 retries)
 * - Timeout handling (backend enforces 15s)
 * - Consistent { data, status, error } response shape
 * - status: 'loading' | 'success' | 'error' | 'empty' | 'notfound'
 * - Typed methods for each resource
 * - Future-proof: passes through whatever fields Replit returns
 */

const MAX_RETRIES = 2;
const RETRY_BASE_DELAY = 800;

function buildResult(data, fallbackStatus = 'success') {
  if (!data) return { data: null, status: 'empty', error: null };
  if (data.error) {
    const status = data.upstreamStatus === 404 ? 'notfound' : 'error';
    return { data: null, status, error: data.error };
  }
  return { data, status: fallbackStatus, error: null };
}

async function apiGet(path, params = {}) {
  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await base44.functions.invoke("scoutygoApi", { path, params });
      const data = res.data;

      if (data && data.error) {
        // Don't retry 404s or auth errors
        if (data.upstreamStatus === 404 || data.errorType === 'AUTH_REQUIRED') {
          return buildResult(data);
        }
        throw new Error(data.error);
      }

      return buildResult(data);
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
 * Tries /opportunities/:id first, falls back to list lookup.
 */
export async function getOpportunityDetail(id) {
  // Try direct endpoint — Replit returns { opportunity: {...} }
  const direct = await apiGet(`/opportunities/${id}`);
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

// ─── Company ───

export async function getCompanyDetail(opportunityId) {
  return apiGet(`/opportunities/${opportunityId}/company`);
}

// ─── Decision Makers / People ───

export async function getDecisionMakers(opportunityId) {
  return apiGet(`/opportunities/${opportunityId}/people`);
}

// ─── Evidence ───

export async function getEvidence(opportunityId) {
  return apiGet(`/opportunities/${opportunityId}/evidence`);
}

// ─── Executive AI Brief ───

export async function getExecutiveBrief(opportunityId) {
  return apiGet(`/opportunities/${opportunityId}/brief`);
}

// ─── Stats ───

export async function getStats() {
  return apiGet('/stats');
}

// ─── Search ───

export async function search(query, limit = 20) {
  return apiGet('/search', { q: query, limit });
}