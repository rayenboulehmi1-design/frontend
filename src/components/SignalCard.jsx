import React from "react";
import { Link } from "react-router-dom";
import { MapPin, TrendingUp, Building2, Clock, ArrowUpRight } from "lucide-react";

const categoryStyles = {
  "Real Estate": {
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  Investment: {
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  Business: {
    icon: TrendingUp,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
};

export default function SignalCard({ signal, compact = false }) {
  const style = categoryStyles[signal.category] || categoryStyles["Real Estate"];
  const Icon = style.icon;

  if (compact) {
    return (
      <Link
        to={`/intelligence-feed`}
        className="block group"
      >
        <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-md transition-all">
          <div className={`shrink-0 w-9 h-9 rounded-lg ${style.bg} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${style.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold uppercase tracking-wide ${style.color}`}>
                {signal.category}
              </span>
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
              {signal.entity_name && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="truncate">{signal.entity_name}</span>
                </>
              )}
            </div>
          </div>
          {signal.confidence && (
            <span className="shrink-0 text-xs font-semibold text-slate-400">
              {signal.confidence}%<span className="text-slate-300 ml-0.5">Conf</span>
            </span>
          )}
        </div>
      </Link>
    );
  }

  return (
    <div className={`rounded-2xl border ${style.border} bg-white p-5 hover:shadow-lg transition-all`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase tracking-wide ${style.color}`}>
            {signal.category}
          </span>
          <span className="text-xs text-slate-400">{signal.time_ago}</span>
        </div>
        {signal.confidence && (
          <span className="text-xs font-semibold text-slate-400">
            {signal.confidence}% Conf
          </span>
        )}
      </div>
      <h3 className="font-semibold text-slate-900 leading-snug mb-3">{signal.title}</h3>
      {signal.summary && <p className="text-sm text-slate-500 mb-4">{signal.summary}</p>}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="w-3.5 h-3.5" />
          <span>{signal.location}</span>
          {signal.entity_name && (
            <>
              <span className="text-slate-300">•</span>
              <span>{signal.entity_name}</span>
            </>
          )}
        </div>
        <Link
          to="/intelligence-feed"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:gap-2 transition-all"
        >
          View Details <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}