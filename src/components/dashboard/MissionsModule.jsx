import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Radar, ArrowRight, Clock, Plus, Target } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import { useEntitlement } from "@/hooks/useEntitlement";
import UsageMeter from "@/components/entitlement/UsageMeter";

export default function MissionsModule() {
  const demoLink = useDemoLink();
  const { tier, checkAccess } = useEntitlement();
  const access = checkAccess('missions');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/30 dark:to-slate-900 p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <Radar className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Missions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Persistent intelligence objectives that continuously scan for matching opportunities</p>
          </div>
        </div>
        <Link
          to={demoLink("/missions")}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:gap-2 transition-all shrink-0"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Active Missions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Active Missions</span>
          </div>
          <div className="flex flex-col items-center justify-center py-6 text-center rounded-xl border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-800/30">
            <Radar className="w-8 h-8 text-slate-200 dark:text-slate-700 mb-2" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">No active missions yet</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mb-3">
              Create a mission to continuously monitor markets, categories, and keywords for new opportunities
            </p>
            <Link
              to={demoLink("/missions")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-3 h-3" /> Create Mission
            </Link>
          </div>
        </div>

        {/* Usage + Latest Matches */}
        <div className="space-y-3">
          {access !== 'FULL' && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Plan Limits</span>
              </div>
              <UsageMeter label="Missions" used={0} limit={access === 'LOCKED' ? 0 : null} icon={Radar} />
              {access === 'LOCKED' && (
                <Link
                  to={demoLink("/account-overview")}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:gap-2 transition-all"
                >
                  Upgrade to unlock missions <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Latest Matches</span>
            </div>
            <div className="flex flex-col items-center justify-center py-4 text-center rounded-xl border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-800/30">
              <Clock className="w-6 h-6 text-slate-200 dark:text-slate-700 mb-1.5" />
              <p className="text-xs text-slate-400 dark:text-slate-500">Mission matches will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}