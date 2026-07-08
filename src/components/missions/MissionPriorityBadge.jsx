import React from "react";
import { PRIORITY_CONFIG } from "@/lib/missionUtils";

export default function MissionPriorityBadge({ priority, size = "md" }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  const sizes = {
    sm: { pad: "px-2 py-0.5", text: "text-[10px]" },
    md: { pad: "px-2.5 py-1", text: "text-xs" },
  };
  const s = sizes[size];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full ${s.pad} ${config.bg} ${config.color} border ${config.border} ${s.text} font-medium`}>
      {config.label}
    </span>
  );
}