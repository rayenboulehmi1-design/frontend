import React from "react";

const STATUS_CONFIG = {
  READY_FOR_LEADS: {
    label: "Ready for Leads",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900",
  },
  NEEDS_REVIEW: {
    label: "Needs Review",
    cls: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
  },
  LOW_SIGNAL: {
    label: "Low Signal",
    cls: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  },
  REJECTED: {
    label: "Rejected",
    cls: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-900",
  },
  READY_FOR_ENRICHMENT: {
    label: "Ready for Enrichment",
    cls: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900",
  },
  READY_FOR_OUTREACH: {
    label: "Ready for Outreach",
    cls: "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-900",
  },
};

export default function ProspectStatusBadge({ status, size = 'md' }) {
  if (!status) return null;
  const config = STATUS_CONFIG[status] || {
    label: status.replace(/_/g, ' '),
    cls: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  };
  const sizeCls = size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wide border ${config.cls} ${sizeCls}`}
    >
      {config.label}
    </span>
  );
}

export { STATUS_CONFIG as PROSPECT_STATUS_CONFIG };