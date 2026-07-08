import { base44 } from "@/api/base44Client";

/**
 * Fetches signals with full metadata including error states.
 * Returns { signals, stats, status, error, lastUpdated }
 * status: 'loading' | 'success' | 'error' | 'empty'
 */
export async function fetchSignalsWithMeta(limit = 200) {
  const res = await base44.functions.invoke("scoutygoSignals", { limit });
  const data = res.data;
  const signals = data.signals || [];
  const stats = data.stats || null;

  let status;
  if (data.error) {
    status = 'error';
  } else if (signals.length === 0) {
    status = 'empty';
  } else {
    status = 'success';
  }

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