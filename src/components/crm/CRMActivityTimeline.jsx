import React from "react";
import {
  PlusCircle, GitCommit, StickyNote, CheckSquare, CheckCircle,
  CalendarPlus, CalendarCheck, RefreshCw, Radar, ShieldCheck,
  Sparkles, Send, Clock, Trophy, XCircle,
} from "lucide-react";
import { ACTIVITY_TYPES } from "@/lib/crmConfig";
import EnginePlaceholder from "@/components/opportunity/EnginePlaceholder";

const ICON_MAP = {
  "CRM Record Created": PlusCircle,
  "Stage Changed": GitCommit,
  "Note Added": StickyNote,
  "Task Created": CheckSquare,
  "Task Completed": CheckCircle,
  "Meeting Scheduled": CalendarPlus,
  "Meeting Completed": CalendarCheck,
  "Opportunity Updated": RefreshCw,
  "Intelligence Update Detected": Radar,
  "Lead Verified": ShieldCheck,
  "Outreach Draft Generated": Sparkles,
  "Outreach Started": Send,
  "Follow-up Scheduled": Clock,
  "Record Won": Trophy,
  "Record Lost": XCircle,
};

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function CRMActivityTimeline({ activities }) {
  if (!activities || activities.length === 0) {
    return <EnginePlaceholder message="Activity timeline will populate automatically as you and the Intelligence Engine interact with this record." />;
  }

  return (
    <div className="space-y-0">
      {activities.map((act, i) => {
        const Icon = ICON_MAP[act.type] || PlusCircle;
        const isLast = i === activities.length - 1;
        return (
          <div key={act.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </div>
              {!isLast && <div className="w-px flex-1 bg-slate-100 dark:bg-slate-700 my-0.5" />}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{act.type}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed mt-0.5">{act.description}</p>
              <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-0.5">{timeAgo(act.createdAt)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}