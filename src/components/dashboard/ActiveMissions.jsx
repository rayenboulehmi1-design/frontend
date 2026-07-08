import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Radar, ArrowRight, Clock, Plus, Target, Activity, Zap } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import { useEntitlement } from "@/hooks/useEntitlement";
import { useMissions } from "@/hooks/useMissions";
import { getMatchingSignals, formatRelativeTime, ACTIVITY_CONFIG } from "@/lib/missionUtils";
import UsageMeter from "@/components/entitlement/UsageMeter";
import LockedFeature from "@/components/entitlement/LockedFeature";
import CreateMissionWizard from "@/components/missions/CreateMissionWizard";
import MissionStatusBadge from "@/components/missions/MissionStatusBadge";

export default function ActiveMissions({ signals = [] }) {
  const demoLink = useDemoLink();
  const { tier, checkAccess, plan } = useEntitlement();
  const access = checkAccess("missions");
  const missionsLimit = plan?.features?.missions?.limit;
  const { missions } = useMissions();
  const [wizardOpen, setWizardOpen] = useState(false);

  const runningMissions = missions.filter((m) => m.status === "running");
  const isLocked = access === "LOCKED";
  const canCreate = !isLocked && (missionsLimit == null || missions.length < missionsLimit);

  // Latest matches across all running missions
  const latestMatches = useMemo(() => {
    if (!signals.length || runningMissions.length === 0) return [];
    const allMatches = new Map();
    runningMissions.forEach((mission) => {
      getMatchingSignals(mission, signals).forEach((sig) => {
        if (!allMatches.has(sig.id)) allMatches.set(sig.id, sig);
      });
    });
    return Array.from(allMatches.values())
      .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
      .slice(0, 3);
  }, [signals, runningMissions]);

  // Recent activity across all missions
  const recentActivity = useMemo(() => {
    const all = [];
    missions.forEach((m) => {
      (m.activity || []).forEach((a) => all.push({ ...a, missionName: m.name, missionId: m.id }));
    });
    return all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 3);
  }, [missions]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-white p-6">
      {wizardOpen && <CreateMissionWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />}

      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <Radar className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Active AI Missions</h3>
            <p className="text-xs text-slate-500">Autonomous intelligence objectives continuously scanning for matching opportunities</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isLocked && canCreate && (
            <button
              onClick={() => setWizardOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shrink-0"
            >
              <Plus className="w-3 h-3" /> Create
            </button>
          )}
          <Link to={demoLink("/missions")} className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:gap-2 transition-all shrink-0">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {isLocked ? (
        <LockedFeature featureKey="missions" title="AI Missions" description="AI Missions continuously monitor markets for opportunities matching your business objectives. Available on Pro and higher plans.">
          <div className="h-8" />
        </LockedFeature>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Active Missions List */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Active Missions</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">{missions.length}</span>
            </div>

            {missions.length > 0 ? (
              <div className="space-y-2">
                {missions.slice(0, 3).map((mission) => (
                  <Link key={mission.id} to={demoLink(`/missions/${mission.id}`)} className="block rounded-xl border border-slate-100 bg-white/60 p-3 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">{mission.name}</p>
                      <MissionStatusBadge status={mission.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{mission.objective}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Target className="w-2.5 h-2.5" /> {mission.matches_found || 0} matches
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {formatRelativeTime(mission.last_scan)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center rounded-xl border border-slate-100 bg-white/60">
                <Radar className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-sm font-semibold text-slate-600 mb-1">No active missions yet</p>
                <p className="text-xs text-slate-400 max-w-xs mb-3">
                  Create an AI Mission to continuously monitor markets for matching opportunities
                </p>
                <button
                  onClick={() => setWizardOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Create AI Mission
                </button>
              </div>
            )}
          </div>

          {/* Latest Matches + Usage */}
          <div className="space-y-3">
            {missionsLimit != null && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Mission Usage</span>
                </div>
                <UsageMeter label="Mission slots" used={missions.length} limit={missionsLimit} icon={Radar} />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Latest Matches</span>
              </div>
              {latestMatches.length > 0 ? (
                <div className="space-y-1.5">
                  {latestMatches.map((sig) => (
                    <Link key={sig.id} to={demoLink(`/opportunities/${sig.id}`)} className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 bg-white/60 hover:border-blue-200 transition-colors group">
                      <span className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {sig.company || sig.entity_name || sig.title}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{sig.country || sig.location} · {sig.time_ago}</p>
                      </span>
                      {sig.confidence != null && (
                        <span className="px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold shrink-0">
                          {sig.confidence}%
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center rounded-xl border border-slate-100 bg-white/60">
                  <Clock className="w-6 h-6 text-slate-200 mb-1.5" />
                  <p className="text-xs text-slate-400">
                    {runningMissions.length > 0 ? "No matches yet — engine is scanning" : "Create a mission to see matches"}
                  </p>
                </div>
              )}
            </div>
            {recentActivity.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Recent Updates</span>
                </div>
                <div className="space-y-1.5">
                  {recentActivity.map((act) => {
                    const config = ACTIVITY_CONFIG[act.type] || ACTIVITY_CONFIG.updated;
                    const Icon = config.icon;
                    return (
                      <Link key={act.id} to={demoLink(`/missions/${act.missionId}`)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/60 transition-colors">
                        <Icon className={`w-3 h-3 ${config.color} shrink-0`} />
                        <span className="text-xs text-slate-600 truncate flex-1">{act.missionName}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{formatRelativeTime(act.timestamp)}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}