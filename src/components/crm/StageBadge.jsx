import React from "react";
import { STAGE_META } from "@/lib/crmConfig";

export default function StageBadge({ stage, size = "sm" }) {
  const meta = STAGE_META[stage] || STAGE_META.Discovered;
  const sizeCls = size === "xs" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${meta.bg} ${meta.text} ${meta.border} ${sizeCls} font-medium whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {stage}
    </span>
  );
}