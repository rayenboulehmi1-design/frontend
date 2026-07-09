import React from "react";
import { CRM_STAGES, STAGE_META } from "@/lib/crmConfig";
import CRMCard from "./CRMCard";
import CRMEmptyState from "./CRMEmptyState";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";

export default function CRMPipeline({ records }) {
  const demoLink = useDemoLink();

  if (records.length === 0) {
    return (
      <CRMEmptyState
        variant="empty"
        action={
          <Link to={demoLink("/dashboard")} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Find Opportunities
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1">
      {CRM_STAGES.map((stage) => {
        const meta = STAGE_META[stage];
        const stageRecords = records.filter((r) => r.stage === stage);
        return (
          <div key={stage} className="shrink-0 w-64 sm:w-72 flex flex-col">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                <span className="text-xs font-bold text-slate-700">{stage}</span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full">{stageRecords.length}</span>
            </div>
            <div className="space-y-2 flex-1 min-h-[60px]">
              {stageRecords.map((record) => (
                <CRMCard key={record.id} record={record} />
              ))}
              {stageRecords.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-100 bg-slate-50/30 p-4 text-center">
                  <span className="text-[10px] text-slate-300">No records</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}