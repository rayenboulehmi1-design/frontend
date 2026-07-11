import React, { useState, useEffect } from "react";
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
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handler = () => setRefreshKey((k) => k + 1);
    window.addEventListener("crm-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("crm-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  if (access === "LOCKED") {
    return (
      <LockedFeature featureKey="opportunityCRM" title="Opportunity CRM" description="Track opportunities from discovery to close with a full intelligence-native CRM pipeline.">
        <div className="h-8" />
      </LockedFeature>
    );
  }

  void refreshKey;
  const records = getRecords();
  const activeRecords = records.filter((r) => r.stage !== "Won" && r.stage !== "Lost").length;
  const wonRecords = records.filter((r) => r.stage === "Won").length;
  const overdueTasks = records.filter((r) => r.nextActionDate && new Date(r.nextActionDate) < new Date(new Date().toDateString()) && r.stage !== "Won" && r.stage !== "Lost").length;
  const newIntel = records.filter((r) => r.intelligenceStatus === "new_intelligence" || r.intelligenceStatus === "review_required").length;

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Opportunity CRM</p>
        </div>
        <Link to={demoLink("/crm")} className="text-blue-600 dark:text-blue-400 hover:text-blue-700">
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-6">
          <GitBranch className="w-8 h-8 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
          <p className="text-xs text-slate-400 dark:text-slate-500">No CRM records yet. Add opportunities to your CRM to start tracking.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{activeRecords}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Active Records</p>
          </div>
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-3">
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{wonRecords}</p>
            <p className="text-[10px] text-emerald-500 dark:text-emerald-500">Won</p>
          </div>
          <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 p-3">
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{overdueTasks}</p>
            <p className="text-[10px] text-amber-500 dark:text-amber-500">Action Overdue</p>
          </div>
          <div className="rounded-xl bg-violet-50 dark:bg-violet-950/30 p-3">
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{newIntel}</p>
            <p className="text-[10px] text-violet-500 dark:text-violet-500">Intel Updates</p>
          </div>
        </div>
      )}

      <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-3 flex items-center gap-1">
        <AlertCircle className="w-2.5 h-2.5" /> Frontend phase — local browser storage
      </p>
    </div>
  );
}