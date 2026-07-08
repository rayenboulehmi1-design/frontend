import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DEMO_SIGNALS } from "@/lib/demoData";
import { useDemoLink } from "@/lib/demoMode";
import OpportunityPipeline from "@/components/opportunity/OpportunityPipeline";
import SignalCard from "@/components/SignalCard";

export default function DemoOpportunityDetail() {
  const { id } = useParams();
  const demoLink = useDemoLink();

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

  const related = DEMO_SIGNALS.filter((s) => s.id !== signal.id && s.category === signal.category).slice(0, 3);

  return (
    <div className="p-5 sm:p-8 max-w-3xl mx-auto">
      <Link to={demoLink("/dashboard")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
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