import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Bookmark, Building2, TrendingUp } from "lucide-react";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";
import { useDemoLink } from "@/lib/demoMode";
import ConfidenceBadge from "@/components/dashboard/ConfidenceBadge";

const categoryStyles = {
  "Real Estate": { icon: Building2, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", badge: "bg-blue-50 text-blue-700" },
  Investment: { icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", badge: "bg-emerald-50 text-emerald-700" },
  Business: { icon: Building2, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100", badge: "bg-violet-50 text-violet-700" },
};

function SaveButton({ signal, saved, onToggle }) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(signal); }}
      className="p-1.5 rounded-lg transition-colors"
      aria-label={saved ? "Remove from saved" : "Save opportunity"}
    >
      <Bookmark className={`w-4 h-4 ${saved ? "fill-blue-600 text-blue-600" : "text-slate-400 hover:text-slate-600"}`} />
    </button>
  );
}

export default function SignalCard({ signal, compact = false }) {
  const style = categoryStyles[signal.category] || categoryStyles["Real Estate"];
  const Icon = style.icon;
  const { isSaved, toggleSave } = useSavedOpportunities();
  const saved = isSaved(signal.id);
  const demoLink = useDemoLink();

  if (compact) {
    return (
      <Link to={demoLink(`/opportunities/${signal.id}`)} className="block group">
        <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-md transition-all">
          <div className={`shrink-0 w-9 h-9 rounded-lg ${style.bg} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${style.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold uppercase tracking-wide ${style.color}`}>{signal.category}</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {signal.time_ago}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-900 leading-snug truncate group-hover:text-blue-600 transition-colors">
              {signal.title}
            </p>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-500">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{signal.location}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {signal.confidence != null && <ConfidenceBadge score={signal.confidence} size="sm" />}
            <SaveButton signal={signal} saved={saved} onToggle={toggleSave} />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className={`rounded-2xl border ${style.border} bg-white p-5 hover:shadow-lg transition-all flex flex-col`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${style.badge}`}>
            {signal.category}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {signal.time_ago}
          </span>
        </div>
        <SaveButton signal={signal} saved={saved} onToggle={toggleSave} />
      </div>
      <Link to={demoLink(`/opportunities/${signal.id}`)} className="group flex-1">
        <h3 className="font-semibold text-slate-900 leading-snug mb-3 group-hover:text-blue-600 transition-colors">
          {signal.title}
        </h3>
        {signal.summary && <p className="text-sm text-slate-500 mb-4 line-clamp-2">{signal.summary}</p>}
      </Link>
      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-sm text-slate-500 min-w-0">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{signal.location}</span>
          {signal.entity_name && (
            <>
              <span className="text-slate-300">•</span>
              <span className="truncate">{signal.entity_name}</span>
            </>
          )}
        </div>
        {signal.confidence != null && <ConfidenceBadge score={signal.confidence} size="sm" />}
      </div>
    </div>
  );
}