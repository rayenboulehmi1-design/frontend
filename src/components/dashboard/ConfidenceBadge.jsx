import React from "react";

export default function ConfidenceBadge({ score, size = "md" }) {
  if (score == null) return <span className="text-xs text-muted-foreground/40">—</span>;

  const tier = score >= 75 ? "emerald" : score >= 50 ? "amber" : "rose";
  const sizes = {
    sm: { ring: "w-9 h-9", text: "text-[10px]", stroke: 3 },
    md: { ring: "w-12 h-12", text: "text-xs", stroke: 4 },
    lg: { ring: "w-20 h-20", text: "text-lg", stroke: 5 },
  };
  const s = sizes[size];
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colors = {
    emerald: { stroke: "#2D6A4F", text: "text-primary", bg: "bg-primary/10" },
    amber: { stroke: "#FFB703", text: "text-accent-foreground", bg: "bg-accent/10" },
    rose: { stroke: "#f43f5e", text: "text-rose-600", bg: "bg-rose-50" },
  };
  const c = colors[tier];

  return (
    <div className={`relative ${s.ring} flex items-center justify-center ${c.bg} rounded-full shrink-0`}>
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={radius} fill="none" stroke="currentColor" strokeWidth={s.stroke} className="text-muted" />
        <circle cx="18" cy="18" r={radius} fill="none" stroke={c.stroke} strokeWidth={s.stroke} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className={`relative font-bold ${c.text} ${s.text}`}>{score}</span>
    </div>
  );
}