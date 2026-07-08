import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Radar, ArrowRight, Clock } from "lucide-react";

export default function MissionsModule() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid lg:grid-cols-2 gap-4 mb-6"
    >
      {/* Running Missions — Coming Soon */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radar className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Running Missions</h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 text-xs font-bold">0</span>
          </div>
          <Link to="/missions" className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:gap-2 transition-all">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Radar className="w-8 h-8 text-slate-200 mb-2" />
          <p className="text-sm font-semibold text-slate-500 mb-1">Missions coming soon</p>
          <p className="text-xs text-slate-400 max-w-xs">
            Persistent saved searches that continuously scan for new opportunities matching your criteria
          </p>
        </div>
      </div>

      {/* Latest Matches — Coming Soon */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900">Latest Matches</h3>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Clock className="w-8 h-8 text-slate-200 mb-2" />
          <p className="text-sm text-slate-400 mb-1">No matches found yet</p>
          <p className="text-xs text-slate-300">Mission match results will appear here</p>
        </div>
      </div>
    </motion.div>
  );
}