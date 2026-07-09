import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GitBranch, ArrowLeft, Lock, ArrowRight, LayoutGrid, List, Database, Activity } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import { useEntitlement } from "@/hooks/useEntitlement";
import LockedFeature from "@/components/entitlement/LockedFeature";
import { PLANS } from "@/lib/plans";
import { getRecords } from "@/lib/crmStore";
import { CRM_STAGES } from "@/lib/crmConfig";
import CRMPipeline from "@/components/crm/CRMPipeline";
import CRMList from "@/components/crm/CRMList";
import CRMFilters from "@/components/crm/CRMFilters";

export default function CRM() {
  const demoLink = useDemoLink();
  const { tier, checkAccess } = useEntitlement();
  const access = checkAccess("opportunityCRM");
  const upgradePlan = access === "LOCKED" ? (tier === "Pro" || tier === "Free" ? "Pro+" : "Agency") : null;

  const [view, setView] = useState("pipeline");
  const [filters, setFilters] = useState({ search: "", stage: "", priority: "", intelligenceStatus: "" });
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

  const records = useMemo(() => {
    void refreshKey;
    return getRecords();
  }, [refreshKey]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!r.title?.toLowerCase().includes(q) && !r.companyName?.toLowerCase().includes(q) && !r.personName?.toLowerCase().includes(q)) return false;
      }
      if (filters.stage && r.stage !== filters.stage) return false;
      if (filters.priority && r.priority !== filters.priority) return false;
      if (filters.intelligenceStatus && r.intelligenceStatus !== filters.intelligenceStatus) return false;
      return true;
    });
  }, [records, filters, refreshKey]);

  const stageCounts = useMemo(() => {
    const counts = {};
    CRM_STAGES.forEach((s) => { counts[s] = records.filter((r) => r.stage === s).length; });
    return counts;
  }, [records, refreshKey]);

  return (
    <div className="p-5 sm:p-8 max-w-6xl mx-auto">
      <Link to={demoLink("/dashboard")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <GitBranch className="w-5 h-5 text-blue-600" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Opportunity CRM</h1>
            <p className="text-xs text-slate-400 mt-0.5">Intelligence-native pipeline — from discovery to outcome</p>
          </div>
        </div>
        {access !== "LOCKED" && records.length > 0 && (
          <div className="inline-flex items-center rounded-xl border border-slate-200 p-0.5 bg-white">
            <button onClick={() => setView("pipeline")} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === "pipeline" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"}`}>
              <LayoutGrid className="w-3.5 h-3.5" /> Pipeline
            </button>
            <button onClick={() => setView("list")} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === "list" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"}`}>
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>
        )}
      </div>

      {access === "LOCKED" ? (
        <>
          <LockedFeature featureKey="opportunityCRM" title="Opportunity CRM" description={`A lightweight CRM for tracking outreach, notes, tasks, and status changes for your opportunities. ${upgradePlan ? `Available with ${upgradePlan}.` : ""}`}>
            <div className="h-8" />
          </LockedFeature>
          {upgradePlan && (
            <div className="mt-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-violet-50 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">Unlock with {upgradePlan}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    The {upgradePlan} plan (${PLANS[upgradePlan].price}/mo) includes {PLANS[upgradePlan].features.opportunityCRM.access === "LIMITED" ? "limited" : "full"} Opportunity CRM access.
                  </p>
                </div>
                <Link to={demoLink("/account-overview")} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shrink-0">
                  Upgrade <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Stage summary bar */}
          {records.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 bg-white p-4 mb-4">
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {CRM_STAGES.map((stage, i) => (
                  <React.Fragment key={stage}>
                    <div className="flex flex-col items-center shrink-0">
                      <span className="text-sm font-bold text-slate-900">{stageCounts[stage]}</span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{stage}</span>
                    </div>
                    {i < CRM_STAGES.length - 1 && <ArrowRight className="w-3 h-3 text-slate-200 shrink-0 mx-1" />}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          )}

          {records.length > 0 && <CRMFilters filters={filters} onChange={setFilters} />}

          {view === "pipeline" ? (
            <CRMPipeline records={filteredRecords} />
          ) : (
            <CRMList records={filteredRecords} />
          )}

          {/* Backend status banner */}
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-700">Frontend phase — local browser storage active</p>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Records are stored in your browser for the Base44 frontend phase. The Replit production backend will provide secure persistence,
                cross-device sync, team authorization, workspace separation, and audit logging.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}