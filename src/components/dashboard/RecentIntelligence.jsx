import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import ConfidenceBadge from "@/components/dashboard/ConfidenceBadge";
import { getTypeStyle } from "@/lib/dealUtils";

export default function RecentIntelligence({ signals }) {
  const demoLink = useDemoLink();
  const recent = (signals || []).slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Recent Intelligence</h3>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase border bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900">Engine</span>
        </div>
        <Link to={demoLink("/intelligence-feed")} className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:gap-2 transition-all">
          View Full Intelligence Feed <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      {recent.length > 0 ? (
        <div className="space-y-2">
          {recent.map((signal) => {
            const typeStyle = getTypeStyle(signal.type || signal.category);
            return (
              <Link key={signal.id} to={demoLink(`/opportunities/${signal.id}`)} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${typeStyle.badge} shrink-0`}>
                  {signal.type || signal.category}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {signal.company || signal.entity_name || signal.title}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{signal.country || signal.location} · {signal.time_ago}</p>
                </div>
                {signal.confidence != null && <ConfidenceBadge score={signal.confidence} size="sm" />}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Clock className="w-8 h-8 text-slate-200 mb-2" />
          <p className="text-sm text-slate-400">No recent intelligence</p>
        </div>
      )}
    </motion.div>
  );
}