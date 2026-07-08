import React from "react";
import { STATUS_CONFIG } from "@/lib/missionUtils";

export default function MissionStatusBadge({ status, size = "md" }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.running;
  const sizes = {
    sm: { pad: "px-2 py-0.5", text: "text-[10px]", dot: "w-1.5 h-1.5" },
    md: { pad: "px-2.5 py-1", text: "text-xs", dot: "w-2 h-2" },
  };
  const s = sizes[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${s.pad} ${config.bg} ${config.color} border ${config.border} ${s.text} font-bold`}>
      <span className={`rounded-full ${s.dot} ${config.dot} ${status === "running" ? "animate-pulse" : ""}`} />
      {config.label}
    </span>
  );
}