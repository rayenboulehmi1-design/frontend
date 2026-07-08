import React from "react";

const STATUS_CONFIG = {
  discovered: { label: "Discovered", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-100", dot: "bg-slate-400" },
  enrichment_pending: { label: "Enrichment Pending", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-100", dot: "bg-amber-400" },
  enriched: { label: "Enriched", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-100", dot: "bg-blue-400" },
  verification_pending: { label: "Verification Pending", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-100", dot: "bg-orange-400" },
  verified: { label: "Verified", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100", dot: "bg-emerald-500" },
  stale: { label: "Stale", color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-100", dot: "bg-rose-400" },
  unavailable: { label: "Unavailable", color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-100", dot: "bg-slate-300" },
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