import React from "react";
import { Gauge } from "lucide-react";
import EnginePlaceholder from "@/components/opportunity/EnginePlaceholder";

const POTENTIAL_FACTORS = [
  "Opportunity Relevance",
  "Company Fit",
  "Geographic Fit",
  "Industry Fit",
  "Decision-Maker Authority",
  "Timing",
  "Evidence Strength",
  "Data Freshness",
];

export default function LeadRelevanceScore({ score, factors }) {
  if (score == null) {
    return (
      <div>
        <EnginePlaceholder message="Lead Relevance Score is calculated by the Leads Intelligence Engine — not by the frontend or the AI Assistant. It will appear here once the engine evaluates this lead." />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {POTENTIAL_FACTORS.map((f) => (
            <span key={f} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-50 text-slate-400 border border-slate-100">
              {f}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const tier = score >= 75 ? "emerald" : score >= 50 ? "amber" : "rose";
  const colors = {
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
    rose: "text-rose-600 bg-rose-50",
  };

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-2xl ${colors[tier]} flex items-center justify-center shrink-0`}>
          <Gauge className="w-7 h-7" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{score}<span className="text-sm text-slate-400 dark:text-slate-500">/100</span></p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Lead Relevance Score</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Calculated by Leads Intelligence Engine</p>
        </div>
      </div>
      {factors && factors.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-50 space-y-2">
          {factors.map((f, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{f.label || POTENTIAL_FACTORS[i] || `Factor ${i + 1}`}</span>
              <span className="font-medium text-slate-700">{f.value}/100</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}