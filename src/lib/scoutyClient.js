import { base44 } from "@/api/base44Client";

export async function fetchSignals(limit = 200) {
  const res = await base44.functions.invoke("scoutygoSignals", { limit });
  return res.data.signals;
}

export async function fetchSignalsWithMeta(limit = 200) {
  const res = await base44.functions.invoke("scoutygoSignals", { limit });
  return res.data;
}