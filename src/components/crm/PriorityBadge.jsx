import React from "react";
import { PRIORITY_META } from "@/lib/crmConfig";

export default function PriorityBadge({ priority = "medium" }) {
  const meta = PRIORITY_META[priority] || PRIORITY_META.medium;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${meta.cls}`}>
      {meta.label}
    </span>
  );
}