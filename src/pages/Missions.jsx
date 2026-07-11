import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, Plus, Loader2 } from "lucide-react";
import { useMissions } from "@/hooks/useMissions";
import { useEntitlement } from "@/hooks/useEntitlement";
import CreateMissionWizard from "@/components/missions/CreateMissionWizard";
import MissionCard from "@/components/missions/MissionCard";
import LockedFeature from "@/components/entitlement/LockedFeature";
import UsageMeter from "@/components/entitlement/UsageMeter";
import { STATUS_CONFIG } from "@/lib/missionUtils";

const TABS = [
  { key: "all", label: "All" },
  { key: "running", label: "Running" },
  { key: "paused", label: "Paused" },
  { key: "archived", label: "Archived" },
];

export default function Missions() {
  const { missions, archivedMissions, allMissions } = useMissions();
  const { tier, checkAccess, plan } = useEntitlement();
  const missionsAccess = checkAccess("missions");
  const missionsLimit = plan?.features?.missions?.limit;
  const [wizardOpen, setWizardOpen] = useState(false);
  const [tab, setTab] = useState("all");

  const isLocked = missionsAccess === "LOCKED";
  const canCreate = !isLocked && (missionsLimit == null || missions.length < missionsLimit);

  const filteredMissions = (() => {
    if (tab === "archived") return archivedMissions;
    if (tab === "all") return missions;
    return missions.filter((m) => m.status === tab);
  })();

  return (
    <div className="p-5 md:p-8 lg:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Radar className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">AI Missions</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Autonomous intelligence objectives continuously monitored by ScoutyGo</p>
          </div>
        </div>
        {!isLocked && (
          <button
            onClick={() => setWizardOpen(true)}
            disabled={!canCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" /> Create AI Mission
          </button>
        )}
      </div>

      {/* Locked state for Free tier */}
      {isLocked ? (
        <LockedFeature
          featureKey="missions"
          title="AI Missions"
          description="AI Missions are autonomous intelligence objectives that continuously scan for matching opportunities. Available on Pro and higher plans."
        >
          <div className="h-12" />
        </LockedFeature>
      ) : (
        <>
          {/* Usage meter */}
          {missionsLimit != null && (
            <div className="mb-5 max-w-sm">
              <UsageMeter label="Active Missions" used={missions.length} limit={missionsLimit} icon={Radar} />
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 mb-5 w-fit">
            {TABS.map((t) => {
              const count = t.key === "archived" ? archivedMissions.length : t.key === "all" ? missions.length : missions.filter((m) => m.status === t.key).length;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    tab === t.key ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {t.label}
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab === t.key ? "bg-blue-50 text-blue-600" : "bg-slate-200 text-slate-500"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mission grid */}
          {filteredMissions.length > 0 ? (
            <motion.div layout className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filteredMissions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <Radar className="w-12 h-12 text-slate-200 dark:text-slate-700 mb-3" />
              <p className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {tab === "archived" ? "No archived missions" : `No ${tab !== "all" ? tab : ""} missions yet`}
              </p>
              <p className="text-sm text-slate-400 max-w-md mb-5">
                {tab === "archived"
                  ? "Archived missions will appear here when you archive them."
                  : "Create an AI Mission to tell ScoutyGo what business objective you have — it will continuously search for matching opportunities."}
              </p>
              {tab !== "archived" && (
                <button
                  onClick={() => setWizardOpen(true)}
                  disabled={!canCreate}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> Create Your First AI Mission
                </button>
              )}
            </div>
          )}
        </>
      )}

      <CreateMissionWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
}