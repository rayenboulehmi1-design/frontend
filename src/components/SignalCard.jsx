import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Bookmark, Building2, TrendingUp } from "lucide-react";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";
import ConfidenceBadge from "@/components/dashboard/ConfidenceBadge";

const categoryStyles = {
  "Real Estate": { icon: Building2, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", badge: "bg-primary/10 text-primary" },
  Investment: { icon: TrendingUp, color: "text-accent-foreground", bg: "bg-accent/10", border: "border-accent/30", badge: "bg-accent/15 text-accent-foreground" },
  Business: { icon: Building2, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-100", badge: "bg-teal-50 text-teal-700" },
};

function SaveButton({ signal, saved, onToggle }) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(signal); }}
      className="p-1.5 rounded-lg transition-colors"
      aria-label={saved ? "Remove from saved" : "Save opportunity"}
    >
      <Bookmark className={`w-4 h-4 ${saved ? "fill-primary text-primary" : "text-muted-foreground/70 hover:text-foreground"}`} />
    </button>
  );
}

export default function SignalCard({ signal, compact = false }) {
  const style = categoryStyles[signal.category] || categoryStyles["Real Estate"];
  const Icon = style.icon;
  const { isSaved, toggleSave } = useSavedOpportunities();
  const saved = isSaved(signal.id);

  if (compact) {
    return (
      <Link to={`/opportunities/${signal.id}`} className="block group">
        <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all">
          <div className={`shrink-0 w-9 h-9 rounded-lg ${style.bg} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${style.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold uppercase tracking-wide ${style.color}`}>{signal.category}</span>
              <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {signal.time_ago}
              </span>
            </div>
            <p className="text-sm font-medium text-foreground leading-snug truncate group-hover:text-primary transition-colors">
              {signal.title}
            </p>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
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
    <div className={`rounded-2xl border ${style.border} bg-card p-5 hover:shadow-lg transition-all flex flex-col`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${style.badge}`}>
            {signal.category}
          </span>
          <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {signal.time_ago}
          </span>
        </div>
        <SaveButton signal={signal} saved={saved} onToggle={toggleSave} />
      </div>
      <Link to={`/opportunities/${signal.id}`} className="group flex-1">
        <h3 className="font-semibold text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">
          {signal.title}
        </h3>
        {signal.summary && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{signal.summary}</p>}
      </Link>
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{signal.location}</span>
          {signal.entity_name && (
            <>
              <span className="text-muted-foreground/30">•</span>
              <span className="truncate">{signal.entity_name}</span>
            </>
          )}
        </div>
        {signal.confidence != null && <ConfidenceBadge score={signal.confidence} size="sm" />}
      </div>
    </div>
  );
}