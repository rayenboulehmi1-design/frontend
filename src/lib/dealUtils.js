export const TYPE_STYLES = {
  "Real Estate": { badge: "bg-primary/10 text-primary border-primary/20", dot: "bg-primary" },
  "Expansion": { badge: "bg-teal-50 text-teal-700 border-teal-100", dot: "bg-teal-500" },
  "Franchise": { badge: "bg-accent/15 text-accent-foreground border-accent/30", dot: "bg-accent" },
  "Industrial": { badge: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground" },
  "Hospitality": { badge: "bg-rose-50 text-rose-700 border-rose-100", dot: "bg-rose-500" },
  "Mixed-Use": { badge: "bg-indigo-50 text-indigo-700 border-indigo-100", dot: "bg-indigo-500" },
  "Public Sector & Procurement": { badge: "bg-primary/10 text-primary border-primary/20", dot: "bg-primary" },
  "Investment": { badge: "bg-accent/15 text-accent-foreground border-accent/30", dot: "bg-accent" },
  "Business": { badge: "bg-teal-50 text-teal-700 border-teal-100", dot: "bg-teal-500" },
};

export const SIGNAL_TAG_STYLES = {
  "Hiring Expansion": "bg-primary/10 text-primary",
  "Trade Show Presence": "bg-teal-50 text-teal-600",
  "New Market Entry": "bg-accent/15 text-accent-foreground",
  "Infrastructure Project": "bg-accent/15 text-accent-foreground",
  "Funding Activity": "bg-accent/15 text-accent-foreground",
  "Regulatory Filing": "bg-muted text-muted-foreground",
  "Lease Acquisition": "bg-primary/10 text-primary",
  "Executive Movement": "bg-rose-50 text-rose-600",
  "Supply Chain Signal": "bg-indigo-50 text-indigo-600",
  "Partnership Announced": "bg-accent/15 text-accent-foreground",
  "License Application": "bg-accent/15 text-accent-foreground",
  "Market Reconnaissance": "bg-teal-50 text-teal-600",
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
  return SIGNAL_TAG_STYLES[tag] || "bg-muted text-muted-foreground";
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