import React from "react";
import { Target, Zap, Star, Bookmark, TrendingUp, Gauge, Clock, Calendar } from "lucide-react";
import { formatRelativeTime } from "@/lib/missionUtils";

function MetricCard({ icon: Icon, label, value, sublabel, pending }) {
  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
      </div>
      {pending ? (
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-bold text-slate-300 dark:text-slate-600">—</span>
          <span className="text-[10px] text-slate-300 dark:text-slate-600 font-medium uppercase">Pending backend</span>
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
          {sublabel && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sublabel}</p>}
        </>
      )}
    </div>
  );
}

export default function MissionPerformance({ mission, matchingSignals }) {
  const matches = matchingSignals || [];
  const today = new Date().toDateString();
  const newToday = matches.filter((s) => s.created_date && new Date(s.created_date).toDateString() === today).length;
  const highConfidence = matches.filter((s) => s.confidence != null && s.confidence >= 75).length;
  const scored = matches.filter((s) => s.confidence != null);
  const avgConf = scored.length > 0 ? Math.round(scored.reduce((sum, s) => sum + s.confidence, 0) / scored.length) : 0;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Gauge className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Mission Performance</h3>
        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase border bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900">Engine</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <MetricCard icon={Target} label="Matches Found" value={mission.matches_found || matches.length} />
        <MetricCard icon={Zap} label="New Today" value={newToday} />
        <MetricCard icon={Star} label="High Confidence" value={highConfidence} sublabel="≥ 75% confidence" />
        <MetricCard icon={Bookmark} label="Saved" value={mission.saved_opportunities || 0} />
        <MetricCard icon={TrendingUp} label="Avg Confidence" value={`${avgConf}%`} />
        <MetricCard icon={Gauge} label="Avg Opportunity Score" value={null} pending />
        <MetricCard icon={Clock} label="Last Scan" value={formatRelativeTime(mission.last_scan)} />
        <MetricCard icon={Calendar} label="Last Match" value={mission.last_match ? formatRelativeTime(mission.last_match) : "—"} />
        <MetricCard icon={Calendar} label="Created" value={mission.created_date ? new Date(mission.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"} />
      </div>
    </div>
  );
}