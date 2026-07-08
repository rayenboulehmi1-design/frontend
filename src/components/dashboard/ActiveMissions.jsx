import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Radar, ArrowRight, Clock, Plus, Target, Activity } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import { useEntitlement } from "@/hooks/useEntitlement";
import UsageMeter from "@/components/entitlement/UsageMeter";
import LockedFeature from "@/components/entitlement/LockedFeature";

export default function ActiveMissions() {
  const demoLink = useDemoLink();
  const { tier, checkAccess } = useEntitlement();
  const access = checkAccess("missions");

  // Read missions from localStorage (temporary — will migrate to Replit backend)
  const missions = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("scouty_missions") || "[]");
    } catch {
      return [];
    }
  }, []);

  const activeMissions = missions.filter((m) => m.active !== false);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <Radar className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Active AI Missions</h3>
            <p className="text-xs text-slate-500">Long-running intelligence objectives continuously scanning for matching opportunities</p>
          </div>
        </div>
        <Link to={demoLink("/missions")} className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:gap-2 transition-all shrink-0">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Active Missions List */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Active Missions</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">{activeMissions.length}</span>
          </div>

          {activeMissions.length > 0 ? (
            <div className="space-y-2">
              {activeMissions.slice(0, 3).map((mission) => (
                <div key={mission.id} className="rounded-xl border border-slate-100 bg-white/60 p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">{mission.name}</p>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold shrink-0">
                      <Activity className="w-2.5 h-2.5" /> Active
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    {mission.category && <span>{mission.category}</span>}
                    {mission.location && <span>· {mission.location}</span>}
                    {mission.minConfidence && <span>· ≥{mission.minConfidence}%</span>}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1.5">
                    <Clock className="w-3 h-3" />
                    Created {new Date(mission.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center rounded-xl border border-slate-100 bg-white/60">
              <Radar className="w-8 h-8 text-slate-200 mb-2" />
              <p className="text-sm font-semibold text-slate-600 mb-1">No active missions yet</p>
              <p className="text-xs text-slate-400 max-w-xs mb-3">
                Create an AI Mission to continuously monitor markets, categories, and keywords for new opportunities
              </p>
              <Link to={demoLink("/missions")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
                <Plus className="w-3 h-3" /> Create AI Mission
              </Link>
            </div>
          )}
        </div>

        {/* Usage + Latest Matches */}
        <div className="space-y-3">
          {access !== "FULL" && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Plan Limits</span>
              </div>
              <UsageMeter label="Missions" used={activeMissions.length} limit={access === "LOCKED" ? 0 : null} icon={Radar} />
              {access === "LOCKED" && (
                <Link to={demoLink("/account-overview")} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:gap-2 transition-all">
                  Upgrade to unlock missions <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Latest Matches</span>
            </div>
            <div className="flex flex-col items-center justify-center py-4 text-center rounded-xl border border-slate-100 bg-white/60">
              <Clock className="w-6 h-6 text-slate-200 mb-1.5" />
              <p className="text-xs text-slate-400">Mission matches will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}