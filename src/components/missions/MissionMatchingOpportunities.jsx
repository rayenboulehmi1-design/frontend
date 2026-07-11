import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Target, ArrowRight, Search } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import { getMatchingSignals } from "@/lib/missionUtils";
import ConfidenceBadge from "@/components/dashboard/ConfidenceBadge";
import { getTypeStyle } from "@/lib/dealUtils";
import DealCard from "@/components/dashboard/DealCard";

export default function MissionMatchingOpportunities({ mission, signals }) {
  const demoLink = useDemoLink();
  const [view, setView] = useState("list");

  const matches = useMemo(() => getMatchingSignals(mission, signals), [mission, signals]);
  const topMatches = useMemo(() => [...matches].sort((a, b) => (b.confidence || 0) - (a.confidence || 0)).slice(0, 6), [matches]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Matching Opportunities</h3>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">{matches.length}</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase border bg-blue-50 text-blue-600 border-blue-100">Engine</span>
        </div>
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800">
          <button
            onClick={() => setView("list")}
            aria-label="List view" aria-pressed={view === "list"}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${view === "list" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
          >
            List
          </button>
          <button
            onClick={() => setView("cards")}
            aria-label="Cards view" aria-pressed={view === "cards"}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${view === "cards" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500 dark:text-slate-400"}`}
          >
            Cards
          </button>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <Search className="w-8 h-8 text-slate-200 dark:text-slate-700 mb-2" />
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-1">No matching opportunities yet</p>
          <p className="text-xs text-slate-300 dark:text-slate-600 max-w-sm">
            The Intelligence Engine is continuously scanning for opportunities that match this mission's objective and filters.
          </p>
        </div>
      ) : view === "cards" ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {topMatches.slice(0, 4).map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {topMatches.map((signal) => {
            const typeStyle = getTypeStyle(signal.type || signal.category);
            return (
              <Link
                key={signal.id}
                to={demoLink(`/opportunities/${signal.id}`)}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all group"
              >
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${typeStyle.badge} shrink-0`}>
                  {signal.type || signal.category}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 transition-colors">
                    {signal.company || signal.entity_name || signal.title}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{signal.country || signal.location} · {signal.time_ago}</p>
                </div>
                {signal.confidence != null && <ConfidenceBadge score={signal.confidence} size="sm" />}
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 transition-colors shrink-0" />
              </Link>
            );
          })}
          {matches.length > 6 && (
            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">+ {matches.length - 6} more matches</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}