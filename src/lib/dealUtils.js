export const TYPE_STYLES = {
  "Real Estate": { badge: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900", dot: "bg-blue-500" },
  "Expansion": { badge: "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-900", dot: "bg-violet-500" },
  "Franchise": { badge: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900", dot: "bg-amber-500" },
  "Industrial": { badge: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700", dot: "bg-slate-500" },
  "Hospitality": { badge: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900", dot: "bg-rose-500" },
  "Mixed-Use": { badge: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-900", dot: "bg-indigo-500" },
  "Public Sector & Procurement": { badge: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900", dot: "bg-emerald-500" },
  "Investment": { badge: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900", dot: "bg-emerald-500" },
  "Business": { badge: "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-900", dot: "bg-violet-500" },
};

export const SIGNAL_TAG_STYLES = {
  "Hiring Expansion": "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
  "Trade Show Presence": "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
  "New Market Entry": "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  "Infrastructure Project": "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
  "Funding Activity": "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  "Regulatory Filing": "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  "Lease Acquisition": "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
  "Executive Movement": "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
  "Supply Chain Signal": "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400",
  "Partnership Announced": "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  "License Application": "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
  "Market Reconnaissance": "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
};

export const PERSONA_PRESETS = {
  Investor: { type: "Real Estate", transactionType: "SALE" },
  Broker: { type: "Real Estate", assetType: "BROKER_OPPORTUNITY" },
  Developer: { type: "Real Estate", assetType: "DEVELOPMENT_SITE" },
  Contractor: { type: "Real Estate", assetType: "CONSTRUCTION_SERVICES", developmentStage: "CONTRACTOR_TENDER" },
  Architect: { type: "Real Estate", assetType: "CONSULTANT_APPOINTMENT", developmentStage: "CONSULTANT_APPOINTED" },
  "Fit-out": { type: "Real Estate", assetType: "FIT_OUT_INTERIOR" },
  Supplier: { type: "Real Estate", transactionType: "TENDER" },
};

export function getTypeStyle(type) {
  return TYPE_STYLES[type] || TYPE_STYLES["Business"];
}

export function getSignalTagStyle(tag) {
  return SIGNAL_TAG_STYLES[tag] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
}

export function whyItMatters(signal) {
  const map = {
    "Real Estate": "Track development pipelines, planning approvals, and contractor activity for early positioning in this market.",
    "Investment": "Monitor capital flows and funding activity to identify strategic investment or partnership windows.",
    "Business": "Identify corporate expansion signals and partnership opportunities before they reach broader market awareness.",
  };
  return map[signal.category] || "Surface emerging market activity and position ahead of broader market awareness.";
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function avgConfidence(signals) {
  const scored = signals.filter((s) => s.confidence != null);
  if (scored.length === 0) return 0;
  return Math.round(scored.reduce((sum, s) => sum + s.confidence, 0) / scored.length);
}

export function uniqueCountries(signals) {
  const set = new Set();
  signals.forEach((s) => {
    if (s.country) set.add(s.country);
    else if (s.location) {
      const parts = s.location.split(",");
      const country = parts[parts.length - 1].trim();
      if (country && country !== "Global") set.add(country);
    }
  });
  return Array.from(set);
}

export function categoryCounts(signals) {
  const counts = { "Real Estate": 0, "Investment": 0, "Business": 0 };
  signals.forEach((s) => { if (s.category && counts[s.category] !== undefined) counts[s.category]++; });
  return counts;
}