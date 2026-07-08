import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Radar } from "lucide-react";
import { DEMO_SIGNALS } from "@/lib/demoData";
import { useDemoLink } from "@/lib/demoMode";
import OpportunityPipeline from "@/components/opportunity/OpportunityPipeline";
import SignalCard from "@/components/SignalCard";
import CreateMissionWizard from "@/components/missions/CreateMissionWizard";

export default function DemoOpportunityDetail() {
  const { id } = useParams();
  const demoLink = useDemoLink();
  const [missionWizardOpen, setMissionWizardOpen] = useState(false);

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

      <div className="mb-6">
        <button
          onClick={() => setMissionWizardOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Radar className="w-4 h-4" /> Create AI Mission from this Opportunity
        </button>
        <p className="text-xs text-slate-400 mt-2">
          ScoutyGo will continuously monitor for opportunities similar to this one
        </p>
      </div>

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