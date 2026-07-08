import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Radar, ArrowLeft, Construction } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";

export default function ComingSoon({ title, description }) {
  const demoLink = useDemoLink();
  return (
    <div className="p-5 sm:p-8 max-w-2xl mx-auto">
      <Link to={demoLink("/dashboard")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-100 bg-white p-10 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
          <Construction className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{title || "Coming Soon"}</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          {description || "This module is under active development and will be available in a future release."}
        </p>

        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-400 text-xs font-medium">
          <Radar className="w-3.5 h-3.5" />
          ScoutyGo — Market Intelligence Platform
        </div>
      </motion.div>
    </div>
  );
}