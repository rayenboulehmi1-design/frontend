import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { ACTIVITY_CONFIG, formatRelativeTime } from "@/lib/missionUtils";
import { useDemoLink } from "@/lib/demoMode";

export default function MissionTimeline({ activities }) {
  const demoLink = useDemoLink();
  const sorted = [...(activities || [])].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center rounded-xl border border-slate-100 bg-slate-50/50">
        <Clock className="w-8 h-8 text-slate-200 mb-2" />
        <p className="text-sm text-slate-400">No activity yet</p>
        <p className="text-xs text-slate-300">Activity will appear here as the mission runs</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {sorted.map((activity, i) => {
        const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.updated;
        const Icon = config.icon;
        const isLast = i === sorted.length - 1;
        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex gap-3"
          >
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center`}>
                <Icon className={`w-3.5 h-3.5 ${config.color}`} />
              </div>
              {!isLast && <div className="w-px flex-1 bg-slate-100 my-1" />}
            </div>
            <div className="flex-1 pb-3 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-700">{config.label}</p>
                <span className="text-xs text-slate-400 shrink-0">{formatRelativeTime(activity.timestamp)}</span>
              </div>
              {activity.description && <p className="text-xs text-slate-400 mt-0.5">{activity.description}</p>}
              {activity.opportunity_id && (
                <Link
                  to={demoLink(`/opportunities/${activity.opportunity_id}`)}
                  className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                >
                  View opportunity
                </Link>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}