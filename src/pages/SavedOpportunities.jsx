import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, ArrowLeft } from "lucide-react";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";
import SignalCard from "@/components/SignalCard";

export default function SavedOpportunities() {
  const { saved } = useSavedOpportunities();

  return (
    <div className="p-5 sm:p-8 max-w-7xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bookmark className="w-5 h-5 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Saved Opportunities</h1>
        </div>
        <p className="text-slate-500 text-sm">
          {saved.length > 0
            ? `${saved.length} saved opportunity${saved.length !== 1 ? "s" : ""}`
            : "Bookmark signals to revisit them here."}
        </p>
      </div>

      {saved.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">No saved opportunities yet.</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
            Browse Intelligence
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {saved.map((signal, i) => (
            <motion.div key={signal.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <SignalCard signal={signal} />
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}