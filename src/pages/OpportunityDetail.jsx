import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Building2, Bookmark, Share2, Loader2 } from "lucide-react";
import { fetchSignalById, fetchSignals } from "@/lib/scoutyClient";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";
import ConfidenceBadge from "@/components/dashboard/ConfidenceBadge";
import SignalCard from "@/components/SignalCard";

const categoryStyles = {
  "Real Estate": { badge: "bg-blue-50 text-blue-700 border-blue-100" },
  Investment: { badge: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  Business: { badge: "bg-violet-50 text-violet-700 border-violet-100" },
};

export default function OpportunityDetail() {
  const { id } = useParams();
  const [signal, setSignal] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isSaved, toggleSave } = useSavedOpportunities();

  useEffect(() => {
    setLoading(true);
    fetchSignalById(id, 200)
      .then(async (sig) => {
        setSignal(sig);
        if (sig) {
          const all = await fetchSignals(200);
          setRelated(all.filter((s) => s.id !== sig.id && s.category === sig.category).slice(0, 3));
        }
      })
      .catch(() => setSignal(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!signal) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center py-20">
        <p className="text-slate-400 mb-4">This opportunity could not be found.</p>
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-blue-600 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const style = categoryStyles[signal.category] || categoryStyles["Real Estate"];
  const saved = isSaved(signal.id);

  return (
    <div className="p-5 sm:p-8 max-w-5xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${style.badge}`}>
            {signal.category}
          </span>
          <span className="text-sm text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {signal.time_ago}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
            {signal.title}
          </h1>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => toggleSave(signal)} className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
              <Bookmark className={`w-4 h-4 ${saved ? "fill-blue-600 text-blue-600" : "text-slate-400"}`} />
            </button>
            <button className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
              <Share2 className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Key metrics */}
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
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400" /> {signal.location}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">Entity</div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 truncate">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" /> {signal.entity_name || "—"}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">Detected</div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Clock className="w-4 h-4 text-slate-400" /> {signal.time_ago}
            </div>
          </div>
        </div>

        {/* Summary */}
        {signal.summary && (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 mb-8">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Intelligence Summary</h2>
            <p className="text-slate-600 leading-relaxed">{signal.summary}</p>
          </div>
        )}

        <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 mb-8">
          <p className="text-xs text-slate-400">
            Detailed opportunity metadata (source links, financials, contact data) requires the Replit{" "}
            <code className="text-slate-600">GET /opportunities/:id</code> endpoint. See{" "}
            <code className="text-slate-600">DASHBOARD_API_CONTRACT.md</code>.
          </p>
        </div>
      </motion.div>

      {/* Related signals */}
      {related.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Related Signals</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((s) => (
              <SignalCard key={s.id} signal={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}