import React from "react";
import { Link } from "react-router-dom";
import { Building2, User, Calendar, Radar, ChevronRight } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import StageBadge from "./StageBadge";
import PriorityBadge from "./PriorityBadge";
import CRMIntelligenceStatus from "./CRMIntelligenceStatus";

export default function CRMCard({ record }) {
  const demoLink = useDemoLink();
  const nextActionOverdue =
    record.nextActionDate && new Date(record.nextActionDate) < new Date(new Date().toDateString());

  return (
    <Link
      to={demoLink(`/crm/${record.id}`)}
      className="block rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 flex-1">{record.title}</p>
        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 shrink-0 mt-0.5" />
      </div>

      <div className="space-y-1 mb-2.5">
        {record.companyName && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <Building2 className="w-3 h-3 text-slate-400 shrink-0" /> {record.companyName}
          </div>
        )}
        {record.personName && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <User className="w-3 h-3 text-slate-400 shrink-0" /> {record.personName}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
        <StageBadge stage={record.stage} size="xs" />
        <PriorityBadge priority={record.priority} />
        {record.missionId && (
          <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400">
            <Radar className="w-3 h-3" /> Mission
          </span>
        )}
      </div>

      {record.nextAction && (
        <div className={`flex items-center gap-1.5 text-[11px] ${nextActionOverdue ? "text-rose-500 dark:text-rose-400" : "text-slate-400 dark:text-slate-500"}`}>
          <Calendar className="w-3 h-3 shrink-0" />
          <span className="truncate">{record.nextAction}</span>
          {record.nextActionDate && (
            <span className="shrink-0 ml-auto text-[10px]">{new Date(record.nextActionDate).toLocaleDateString()}</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-50 dark:border-slate-800/50">
        <CRMIntelligenceStatus status={record.intelligenceStatus} size="xs" />
        <span className="text-[10px] text-slate-300 dark:text-slate-600">
          {record.lastActivityAt ? new Date(record.lastActivityAt).toLocaleDateString() : ""}
        </span>
      </div>
    </Link>
  );
}