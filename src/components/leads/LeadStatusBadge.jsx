import React from "react";

const STATUS_CONFIG = {
  discovered: { label: "Discovered", color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-800/50", border: "border-slate-100 dark:border-slate-700", dot: "bg-slate-400 dark:bg-slate-500" },
  enrichment_pending: { label: "Enrichment Pending", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/50", border: "border-amber-100 dark:border-amber-900", dot: "bg-amber-400" },
  enriched: { label: "Enriched", color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/50", border: "border-blue-100 dark:border-blue-900", dot: "bg-blue-400" },
  verification_pending: { label: "Verification Pending", color: "text-orange-700 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/50", border: "border-orange-100 dark:border-orange-900", dot: "bg-orange-400" },
  verified: { label: "Verified", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/50", border: "border-emerald-100 dark:border-emerald-900", dot: "bg-emerald-500" },
  stale: { label: "Stale", color: "text-rose-700 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/50", border: "border-rose-100 dark:border-rose-900", dot: "bg-rose-400" },
  unavailable: { label: "Unavailable", color: "text-slate-400 dark:text-slate-500", bg: "bg-slate-50 dark:bg-slate-800/50", border: "border-slate-100 dark:border-slate-700", dot: "bg-slate-300 dark:bg-slate-600" },
};

export default function LeadStatusBadge({ status, size = "sm" }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.discovered;
  const sizeClasses = size === "xs" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${config.bg} ${config.color} ${config.border} ${sizeClasses} font-medium whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}