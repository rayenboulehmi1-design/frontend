import React from "react";
import { INTELLIGENCE_STATUSES } from "@/lib/crmConfig";

export default function CRMIntelligenceStatus({ status = "monitoring", size = "sm" }) {
  const config = INTELLIGENCE_STATUSES[status] || INTELLIGENCE_STATUSES.monitoring;
  const sizeCls = size === "xs" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${config.bg} ${config.color} ${config.border} ${sizeCls} font-medium whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}