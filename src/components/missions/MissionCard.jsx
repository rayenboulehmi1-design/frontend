import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Radar, MapPin, Tag, Clock, Target, Pause, Play, ArrowRight } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import { useMissions } from "@/hooks/useMissions";
import MissionStatusBadge from "./MissionStatusBadge";
import MissionPriorityBadge from "./MissionPriorityBadge";
import { formatRelativeTime } from "@/lib/missionUtils";

export default function MissionCard({ mission }) {
  const demoLink = useDemoLink();
  const { pauseMission, resumeMission } = useMissions();

  const filterChips = [
    ...(mission.countries || []).slice(0, 2).map((c) => ({ icon: MapPin, label: c })),
    ...(mission.categories || []).slice(0, 1).map((c) => ({ icon: Tag, label: c })),
    ...(mission.keywords || []).slice(0, 2).map((k) => ({ icon: Target, label: k })),
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-900 transition-all flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MissionStatusBadge status={mission.status} size="sm" />
          <MissionPriorityBadge priority={mission.priority_level} size="sm" />
        </div>
        <div className="flex items-center gap-1">
          {mission.status === "running" && (
            <button
              onClick={() => pauseMission(mission.id)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors"
              aria-label="Pause mission"
            >
              <Pause className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            </button>
          )}
          {mission.status === "paused" && (
            <button
              onClick={() => resumeMission(mission.id)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
              aria-label="Resume mission"
            >
              <Play className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            </button>
          )}
        </div>
      </div>

      <Link to={demoLink(`/missions/${mission.id}`)} className="group flex-1">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center shrink-0">
            <Radar className="w-4 h-4 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-blue-600 transition-colors">
              {mission.name}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-2">{mission.objective}</p>
          </div>
        </div>
      </Link>

      {filterChips.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {filterChips.map((chip, i) => {
            const Icon = chip.icon;
            return (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-medium">
                <Icon className="w-2.5 h-2.5" /> {chip.label}
              </span>
            );
          })}
          {(mission.countries?.length > 2 || mission.keywords?.length > 2) && (
            <span className="px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px]">
              +{(mission.countries?.length || 0) + (mission.keywords?.length || 0) - 4} more
            </span>
          )}
        </div>
      )}

      <div className="mt-auto pt-3 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <Target className="w-3 h-3" /> {mission.matches_found || 0} matches
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {formatRelativeTime(mission.last_scan)}
          </span>
        </div>
        <Link
          to={demoLink(`/missions/${mission.id}`)}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all"
        >
          View <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
}