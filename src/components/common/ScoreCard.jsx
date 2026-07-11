import React from "react";
import ConfidenceBadge from "@/components/dashboard/ConfidenceBadge";

/**
 * Reusable score card for displaying engine-computed scores.
 * Renders only if the score exists — never fabricates values.
 */
export default function ScoreCard({ label, score, icon: Icon, description, size = 'md' }) {
  if (score == null) {
    return (
      <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <div className="flex items-center gap-2 mb-2">
          {Icon && <Icon className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />}
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-bold text-slate-300 dark:text-slate-700">—</span>
        </div>
        {description && <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-0.5">{description}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <ConfidenceBadge score={score} size={size} />
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{Math.round(score)}%</p>
          {description && <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
    </div>
  );
}