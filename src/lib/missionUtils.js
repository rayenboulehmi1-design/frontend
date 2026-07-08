import {
  Rocket,
  Target,
  Bookmark,
  Bell,
  Pencil,
  Pause,
  Play,
  Archive,
  RefreshCw,
  Zap,
  Clock,
  CalendarDays,
  BellOff,
} from "lucide-react";

export const STATUS_CONFIG = {
  running: { label: "Running", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", dot: "bg-emerald-500" },
  paused: { label: "Paused", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", dot: "bg-amber-400" },
  completed: { label: "Completed", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", dot: "bg-blue-500" },
  archived: { label: "Archived", color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-100", dot: "bg-slate-300" },
};

export const PRIORITY_CONFIG = {
  high: { label: "High Priority", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", dot: "bg-rose-500" },
  medium: { label: "Medium Priority", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", dot: "bg-amber-500" },
  low: { label: "Low Priority", color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-100", dot: "bg-slate-400" },
};

export const NOTIFICATION_CONFIG = {
  immediate: { label: "Immediate", icon: Zap, description: "Notify as soon as a match is found" },
  daily: { label: "Daily Summary", icon: Clock, description: "Receive a daily digest of new matches" },
  weekly: { label: "Weekly Summary", icon: CalendarDays, description: "Receive a weekly digest of new matches" },
  disabled: { label: "Disabled", icon: BellOff, description: "No notifications — check manually" },
};

export const ACTIVITY_CONFIG = {
  created: { label: "Mission Created", icon: Rocket, color: "text-blue-600", bg: "bg-blue-50" },
  matched: { label: "New Opportunity Matched", icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
  saved: { label: "Opportunity Saved", icon: Bookmark, color: "text-violet-600", bg: "bg-violet-50" },
  alert: { label: "Alert Triggered", icon: Bell, color: "text-amber-600", bg: "bg-amber-50" },
  updated: { label: "Mission Updated", icon: Pencil, color: "text-slate-600", bg: "bg-slate-50" },
  paused: { label: "Mission Paused", icon: Pause, color: "text-amber-600", bg: "bg-amber-50" },
  resumed: { label: "Mission Resumed", icon: Play, color: "text-emerald-600", bg: "bg-emerald-50" },
  archived: { label: "Mission Archived", icon: Archive, color: "text-slate-500", bg: "bg-slate-50" },
  scan: { label: "Scan Completed", icon: RefreshCw, color: "text-slate-500", bg: "bg-slate-50" },
};

/**
 * Frontend-only matching simulation.
 * The Replit Intelligence Engine will replace this with sophisticated matching.
 */
export function getMatchingSignals(mission, signals) {
  if (!signals || !signals.length) return [];
  return signals.filter((s) => {
    if (mission.countries?.length > 0) {
      const country = (s.country || "").toLowerCase();
      if (!mission.countries.some((c) => country.includes(c.toLowerCase()))) return false;
    }
    if (mission.categories?.length > 0) {
      if (!mission.categories.includes(s.category)) return false;
    }
    if (mission.keywords?.length > 0) {
      const text = `${s.title || ""} ${s.company || ""} ${s.entity_name || ""} ${s.summary || ""}`.toLowerCase();
      if (!mission.keywords.some((k) => text.includes(k.toLowerCase()))) return false;
    }
    if (mission.excluded_keywords?.length > 0) {
      const text = `${s.title || ""} ${s.company || ""} ${s.entity_name || ""}`.toLowerCase();
      if (mission.excluded_keywords.some((k) => text.includes(k.toLowerCase()))) return false;
    }
    if (mission.min_confidence > 0 && s.confidence != null) {
      if (s.confidence < mission.min_confidence) return false;
    }
    if (mission.company_names?.length > 0) {
      const company = (s.company || s.entity_name || "").toLowerCase();
      if (!mission.company_names.some((c) => company.includes(c.toLowerCase()))) return false;
    }
    if (mission.industry) {
      const text = `${s.title || ""} ${s.summary || ""} ${s.category || ""}`.toLowerCase();
      if (!text.includes(mission.industry.toLowerCase())) return false;
    }
    if (mission.opportunity_types?.length > 0) {
      const type = (s.type || s.category || "").toLowerCase();
      if (!mission.opportunity_types.some((t) => type.includes(t.toLowerCase()))) return false;
    }
    return true;
  });
}

export function formatRelativeTime(timestamp) {
  if (!timestamp) return "never";
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}