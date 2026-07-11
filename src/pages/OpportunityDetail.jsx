import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Radar, Building2 } from "lucide-react";
import { fetchSignalById, fetchSignals } from "@/lib/scoutyClient";
import OpportunityPipeline from "@/components/opportunity/OpportunityPipeline";
import SignalCard from "@/components/SignalCard";
import CreateMissionWizard from "@/components/missions/CreateMissionWizard";

export default function OpportunityDetail() {
  const { id } = useParams();
  const [signal, setSignal] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [missionWizardOpen, setMissionWizardOpen] = useState(false);

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
        <p className="text-slate-400 dark:text-slate-500 mb-4">This opportunity could not be found.</p>
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8 max-w-3xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          to={`/company/${id}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Building2 className="w-4 h-4" /> Company Intelligence
        </Link>
        <button
          onClick={() => setMissionWizardOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
        >
          <Radar className="w-4 h-4" /> Create AI Mission
        </button>
      </div>

      <OpportunityPipeline signal={signal} />

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Related Signals</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((s) => (
              <SignalCard key={s.id} signal={s} />
            ))}
          </div>
        </div>
      )}

      <CreateMissionWizard
        open={missionWizardOpen}
        onClose={() => setMissionWizardOpen(false)}
        prefill={{
          objective: signal.title
            ? `Find opportunities similar to: ${signal.title}${signal.country ? ` in ${signal.country}` : ""}`
            : signal.country
            ? `Monitor opportunities in ${signal.country}`
            : "",
          industry: signal.category || "",
          countries: signal.country ? [signal.country] : [],
          categories: signal.category ? [signal.category] : [],
          keywords: [signal.company, signal.entity_name].filter(Boolean),
          source_opportunity_id: signal.id,
        }}
      />
    </div>
  );
}