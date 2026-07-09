import React from "react";
import { Link } from "react-router-dom";
import { GitBranch, ArrowRight, AlertCircle } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import { useEntitlement } from "@/hooks/useEntitlement";
import { getRecords } from "@/lib/crmStore";
import LockedFeature from "@/components/entitlement/LockedFeature";

export default function CRMModule() {
  const demoLink = useDemoLink();
  const { checkAccess } = useEntitlement();
  const access = checkAccess("opportunityCRM");

  if (access === "LOCKED") {
    return (
      <LockedFeature featureKey="opportunityCRM" title="Opportunity CRM" description="Track opportunities from discovery to close with a full intelligence-native CRM pipeline.">
        <div className="h-8" />
      </LockedFeature>
    );
  }

  const records = getRecords();
  const activeRecords = records.filter((r) => r.stage !== "Won" && r.stage !== "Lost").length;
  const wonRecords = records.filter((r) => r.stage === "Won").length;
  const overdueTasks = records.filter((r) => r.nextActionDate && new Date(r.nextActionDate) < new Date(new Date().toDateString()) && r.stage !== "Won" && r.stage !== "Lost").length;
  const newIntel = records.filter((r) => r.intelligenceStatus === "new_intelligence" || r.intelligenceStatus === "review_required").length;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-sm font-bold text-slate-900">Opportunity CRM</p>
        </div>
        <Link to={demoLink("/crm")} className="text-blue-600 hover:text-blue-700">
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-6">
          <GitBranch className="w-8 h-8 text-slate-200 mx-auto mb-2" />
          <p className="text-xs text-slate-400">No CRM records yet. Add opportunities to your CRM to start tracking.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-lg font-bold text-slate-900">{activeRecords}</p>
            <p className="text-[10px] text-slate-400">Active Records</p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3">
            <p className="text-lg font-bold text-emerald-600">{wonRecords}</p>
            <p className="text-[10px] text-emerald-500">Won</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-3">
            <p className="text-lg font-bold text-amber-600">{overdueTasks}</p>
            <p className="text-[10px] text-amber-500">Action Overdue</p>
          </div>
          <div className="rounded-xl bg-violet-50 p-3">
            <p className="text-lg font-bold text-violet-600">{newIntel}</p>
            <p className="text-[10px] text-violet-500">Intel Updates</p>
          </div>
        </div>
      )}

      <p className="text-[10px] text-slate-300 mt-3 flex items-center gap-1">
        <AlertCircle className="w-2.5 h-2.5" /> Frontend phase — local browser storage
      </p>
    </div>
  );
}