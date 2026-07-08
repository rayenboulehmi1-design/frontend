import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Radar,
  Pause,
  Play,
  Archive,
  Copy,
  Trash2,
  Pencil,
  Loader2,
  Bell,
  History,
  Sparkles,
} from "lucide-react";
import { useMissions } from "@/hooks/useMissions";
import { useDemoMode, useDemoLink } from "@/lib/demoMode";
import { fetchSignalsWithMeta } from "@/lib/scoutyClient";
import { DEMO_SIGNALS } from "@/lib/demoData";
import { getMatchingSignals, NOTIFICATION_CONFIG, formatRelativeTime } from "@/lib/missionUtils";
import MissionStatusBadge from "@/components/missions/MissionStatusBadge";
import MissionPriorityBadge from "@/components/missions/MissionPriorityBadge";
import MissionPerformance from "@/components/missions/MissionPerformance";
import MissionTimeline from "@/components/missions/MissionTimeline";
import MissionFiltersDisplay from "@/components/missions/MissionFiltersDisplay";
import MissionMatchingOpportunities from "@/components/missions/MissionMatchingOpportunities";
import MissionFutureModules from "@/components/missions/MissionFutureModules";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MissionDetail() {
  const { id } = useParams();
  const demoLink = useDemoLink();
  const isDemo = useDemoMode();
  const { getMission, pauseMission, resumeMission, archiveMission, duplicateMission, deleteMission } = useMissions();

  const [signals, setSignals] = useState([]);
  const [loadingSignals, setLoadingSignals] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const mission = getMission(id);

  useEffect(() => {
    if (isDemo) {
      setSignals(DEMO_SIGNALS);
      setLoadingSignals(false);
      return;
    }
    fetchSignalsWithMeta(200)
      .then((data) => setSignals(data.signals || []))
      .catch(() => setSignals([]))
      .finally(() => setLoadingSignals(false));
  }, [isDemo]);

  const matchingSignals = useMemo(() => {
    if (!mission || loadingSignals) return [];
    return getMatchingSignals(mission, signals);
  }, [mission, signals, loadingSignals]);

  if (!mission) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center py-20">
        <Radar className="w-12 h-12 text-slate-200 mx-auto mb-3" />
        <p className="text-slate-400 mb-4">This AI Mission could not be found.</p>
        <Link to={demoLink("/missions")} className="inline-flex items-center gap-2 text-blue-600 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to AI Missions
        </Link>
      </div>
    );
  }

  const notifConfig = NOTIFICATION_CONFIG[mission.notification_preference] || NOTIFICATION_CONFIG.immediate;
  const NotifIcon = notifConfig.icon;

  return (
    <div className="p-5 md:p-8 lg:p-10 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <Link to={demoLink("/missions")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to AI Missions
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MissionStatusBadge status={mission.status} />
          <MissionPriorityBadge priority={mission.priority_level} />
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Radar className="w-3 h-3" /> Created {formatRelativeTime(mission.created_date)}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{mission.name}</h1>
        <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">{mission.objective}</p>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {mission.status === "running" && (
            <Button variant="outline" size="sm" onClick={() => pauseMission(mission.id)}>
              <Pause className="w-3.5 h-3.5 mr-1" /> Pause
            </Button>
          )}
          {mission.status === "paused" && (
            <Button variant="outline" size="sm" onClick={() => resumeMission(mission.id)}>
              <Play className="w-3.5 h-3.5 mr-1" /> Resume
            </Button>
          )}
          {mission.status !== "archived" && (
            <Button variant="outline" size="sm" onClick={() => archiveMission(mission.id)}>
              <Archive className="w-3.5 h-3.5 mr-1" /> Archive
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => duplicateMission(mission.id)}>
            <Copy className="w-3.5 h-3.5 mr-1" /> Duplicate
          </Button>
          <Button variant="outline" size="sm" onClick={() => setDeleteOpen(true)} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
          </Button>
        </div>
      </motion.div>

      {/* Performance */}
      <div className="mb-6">
        <MissionPerformance mission={mission} matchingSignals={matchingSignals} />
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column — Matching Opportunities + Activity Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            {loadingSignals ? (
              <div className="flex items-center gap-2 py-8 justify-center">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-sm text-slate-400">Loading matching opportunities...</span>
              </div>
            ) : (
              <MissionMatchingOpportunities mission={mission} signals={signals} />
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900">Activity Timeline</h3>
            </div>
            <MissionTimeline activities={mission.activity} />
          </div>
        </div>

        {/* Right column — Filters, Notifications, Future Modules */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <MissionFiltersDisplay mission={mission} />
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                <NotifIcon className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{notifConfig.label}</p>
                <p className="text-xs text-slate-400">{notifConfig.description}</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-300 mt-2">
              Future channels: Email, Push, Slack, Microsoft Teams
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900">Intelligence Pipeline</h3>
            </div>
            <MissionFutureModules mission={mission} />
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this AI Mission?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{mission.name}" and all its activity history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteMission(mission.id);
                window.location.href = demoLink("/missions");
              }}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Delete Mission
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}