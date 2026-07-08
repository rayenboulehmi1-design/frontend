import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { fetchSignalById, fetchSignals } from "@/lib/scoutyClient";
import OpportunityPipeline from "@/components/opportunity/OpportunityPipeline";
import SignalCard from "@/components/SignalCard";

export default function OpportunityDetail() {
  const { id } = useParams();
  const [signal, setSignal] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-5 sm:p-8 max-w-3xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <OpportunityPipeline signal={signal} />

      {related.length > 0 && (
        <div className="mt-10">
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