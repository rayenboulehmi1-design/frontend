import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Radar, Building2 } from "lucide-react";
import { getOpportunityDetail, fetchSignals, composeCompanyIntelligence } from "@/lib/scoutyClient";
import OpportunityPipeline from "@/components/opportunity/OpportunityPipeline";
import SignalCard from "@/components/SignalCard";
import CreateMissionWizard from "@/components/missions/CreateMissionWizard";

export default function OpportunityDetail() {
  const { id } = useParams();
  const [signal, setSignal] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const [missionWizardOpen, setMissionWizardOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setErrorStatus(null);
    getOpportunityDetail(id)
      .then(async (result) => {
        if (result.status === "success" && result.data) {
          // Use composeCompanyIntelligence to normalize the full opportunity object
          // into the signal shape that OpportunityPipeline expects
          const intel = composeCompanyIntelligence(result.data);
          // Merge opportunity-level fields with the composed intel
          const opp = result.data;
          setSignal({
            id: opp.id,
            title: opp.title || opp.company || "Untitled Opportunity",
            company: opp.company || null,
            entity_name: opp.company || null,
            category: intel.industry || opp.category || "Business",
            type: opp.opportunityType || opp.type || intel.industry || "Business",
            location: [opp.city, opp.country].filter(Boolean).join(", ") || "Global",
            country: opp.country || null,
            city: opp.city || null,
            time_ago: "recently",
            confidence: opp.confidenceScore ?? opp.confidence ?? null,
            summary: opp.summary || opp.description || intel.summary,
            explanation: opp.summary || opp.explanation || opp.executiveSummary,
            signals: Array.isArray(opp.signals) ? opp.signals : [],
            timeline: opp.estimatedTimeline || opp.timeline || null,
            marketSize: opp.marketSize || opp.estimatedValue || null,
            sourceType: opp.sourceType || null,
            sourceUrl: opp.sourceUrl || null,
            verificationStatus: opp.verificationStatus || null,
            freshnessState: opp.freshnessState || null,
            corroborationState: opp.corroborationState || null,
            realEstateDetails: opp.realEstateDetails || null,
            nextBestAction: opp.nextBestAction || null,
            companies: intel.companies || [],
            ...intel,
          });
          // Fetch related signals from the same category
          const all = await fetchSignals(200);
          setRelated(all.filter((s) => s.id !== opp.id && s.category === (intel.industry || opp.category)).slice(0, 3));
        } else {
          setSignal(null);
          setErrorStatus(result.status);
        }
      })
      .catch(() => {
        setSignal(null);
        setErrorStatus("error");
      })
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
    const isNotFound = errorStatus === "notfound";
    const isError = errorStatus === "error" || errorStatus === "auth_required";
    return (
      <div className="p-8 max-w-2xl mx-auto text-center py-20">
        {isError ? (
          <>
            <p className="text-amber-600 dark:text-amber-400 mb-2 font-medium">Couldn't load this opportunity.</p>
            <p className="text-slate-400 dark:text-slate-500 mb-4">The Intelligence Engine is temporarily unavailable. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors mb-4"
            >
              Retry
            </button>
          </>
        ) : (
          <p className="text-slate-400 dark:text-slate-500 mb-4">This opportunity could not be found.</p>
        )}
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