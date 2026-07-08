import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Building2, Bookmark, Share2, Bell } from "lucide-react";
import { DEMO_SIGNALS } from "@/lib/demoData";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";
import { useDemoLink } from "@/lib/demoMode";
import ConfidenceBadge from "@/components/dashboard/ConfidenceBadge";
import SignalCard from "@/components/SignalCard";
import LeadsModule from "@/components/entitlement/LeadsModule";

const categoryStyles = {
  "Real Estate": { badge: "bg-blue-50 text-blue-700 border-blue-100" },
  Investment: { badge: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  Business: { badge: "bg-violet-50 text-violet-700 border-violet-100" },
};

export default function DemoOpportunityDetail() {
  const { id } = useParams();
  const demoLink = useDemoLink();
  const { isSaved, toggleSave } = useSavedOpportunities();
  const [shareMsg, setShareMsg] = useState(false);
  const [trackedMsg, setTrackedMsg] = useState(false);

  const signal = DEMO_SIGNALS.find((s) => s.id === id);

  if (!signal) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center py-20">
        <p className="text-slate-400 mb-4">This opportunity could not be found.</p>
        <Link to={demoLink("/dashboard")} className="inline-flex items-center gap-2 text-blue-600 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const style = categoryStyles[signal.category] || categoryStyles["Real Estate"];
  const saved = isSaved(signal.id);
  const related = DEMO_SIGNALS.filter((s) => s.id !== signal.id && s.category === signal.category).slice(0, 3);

  const handleShare = () => {
    setShareMsg(true);
    setTimeout(() => setShareMsg(false), 2000);
  };

  const handleTrack = () => {
    setTrackedMsg(true);
    setTimeout(() => setTrackedMsg(false), 3000);
  };

  return (
    <div className="p-5 sm:p-8 max-w-5xl mx-auto">
      <Link to={demoLink("/dashboard")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${style.badge}`}>{signal.category}</span>
          <span className="text-sm text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {signal.time_ago}</span>
        </div>

        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">{signal.title}</h1>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => toggleSave(signal)} className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors" aria-label="Save">
              <Bookmark className={`w-4 h-4 ${saved ? "fill-blue-600 text-blue-600" : "text-slate-400"}`} />
            </button>
            <button onClick={handleTrack} className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors relative" aria-label="Create alert">
              <Bell className={`w-4 h-4 ${trackedMsg ? "fill-blue-600 text-blue-600" : "text-slate-400"}`} />
              {trackedMsg && <span className="absolute -top-9 left-1/2 -translate-x-1/2 text-xs bg-slate-900 text-white px-2 py-1 rounded whitespace-nowrap">Alert simulated (demo)</span>}
            </button>
            <button onClick={handleShare} className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors relative" aria-label="Share">
              <Share2 className="w-4 h-4 text-slate-400" />
              {shareMsg && <span className="absolute -top-9 left-1/2 -translate-x-1/2 text-xs bg-slate-900 text-white px-2 py-1 rounded whitespace-nowrap">Link copied (demo)</span>}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">Confidence</div>
            <div className="flex items-center gap-3">
              <ConfidenceBadge score={signal.confidence} size="sm" />
              <span className="text-sm font-medium text-slate-600">{signal.confidence != null ? `${signal.confidence}%` : "N/A"}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">Location</div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700"><MapPin className="w-4 h-4 text-slate-400" /> {signal.location}</div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">Entity</div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 truncate"><Building2 className="w-4 h-4 text-slate-400 shrink-0" /> {signal.entity_name || "—"}</div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">Detected</div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700"><Clock className="w-4 h-4 text-slate-400" /> {signal.time_ago}</div>
          </div>
        </div>

        {signal.summary && (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 mb-8">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Intelligence Summary</h2>
            <p className="text-slate-600 leading-relaxed">{signal.summary}</p>
          </div>
        )}

        {signal.explanation && (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 mb-8">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">AI Analysis</h2>
            <p className="text-slate-600 leading-relaxed">{signal.explanation}</p>
          </div>
        )}
      </motion.div>

      {/* Leads Provider Agent — plan-aware */}
      <div className="mb-8">
        <LeadsModule deal={signal} />
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Related Signals</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((s) => <SignalCard key={s.id} signal={s} />)}
          </div>
        </div>
      )}
    </div>
  );
}