import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Target, Sparkles, Gauge, ShieldCheck, FileSearch, Lightbulb,
  Users, UserCheck, Mail, Bookmark, Radar, Bell, PieChart,
  Share2, Loader2, Check, MapPin, Building2, Clock, ExternalLink,
  TrendingUp, Calendar, Tag,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";
import { useAlerts } from "@/hooks/useAlerts";
import { useEntitlement } from "@/hooks/useEntitlement";
import { useDemoLink } from "@/lib/demoMode";
import ConfidenceBadge from "@/components/dashboard/ConfidenceBadge";
import LockedFeature from "@/components/entitlement/LockedFeature";
import PipelineStep from "@/components/opportunity/PipelineStep";
import EnginePlaceholder from "@/components/opportunity/EnginePlaceholder";
import LeadsWorkflow from "@/components/leads/LeadsWorkflow";
import AddToCRMDialog from "@/components/crm/AddToCRMDialog";
import CreateMissionWizard from "@/components/missions/CreateMissionWizard";

const categoryStyles = {
  "Real Estate": { badge: "bg-blue-50 text-blue-700 border-blue-100" },
  Investment: { badge: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  Business: { badge: "bg-violet-50 text-violet-700 border-violet-100" },
};

// ─── Future module placeholder ───
function FutureModulePlaceholder({ icon: Icon, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-5 text-center">
      {Icon && <Icon className="w-8 h-8 text-slate-300 mx-auto mb-2" />}
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Coming Soon</p>
      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">{description}</p>
    </div>
  );
}

// ─── Engine confidence reasoning (derived from engine states, NOT AI) ───
function getConfidenceReasoning(signal) {
  const reasons = [];
  if (signal.verificationStatus === "VERIFIED") reasons.push("Source verified by the Intelligence Engine");
  if (signal.corroborationState === "CORROBORATED") reasons.push("Corroborated across multiple independent sources");
  if (signal.corroborationState === "SINGLE_SOURCE") reasons.push("Based on a single source — further corroboration pending");
  if (signal.freshnessState === "FRESH") reasons.push("Signal is fresh — detected recently");
  if (signal.freshnessState === "RECENT") reasons.push("Signal is recent");
  if (signal.sourceType) reasons.push(`Sourced from ${signal.sourceType}`);
  return reasons;
}

export default function OpportunityPipeline({ signal }) {
  const demoLink = useDemoLink();
  const { isSaved, toggleSave } = useSavedOpportunities();
  const { createAlert } = useAlerts();
  const { checkAccess } = useEntitlement();
  const saved = isSaved(signal.id);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shareMsg, setShareMsg] = useState(false);
  const [tracked, setTracked] = useState(false);
  const [crmAdded, setCrmAdded] = useState(false);
  const [crmDialogOpen, setCrmDialogOpen] = useState(false);
  const [missionWizardOpen, setMissionWizardOpen] = useState(false);

  const style = categoryStyles[signal.category] || categoryStyles["Real Estate"];
  const aiAccess = checkAccess("aiAnalysis");
  const scoreAccess = checkAccess("confidenceScores");
  const evidenceAccess = checkAccess("evidenceAndSources");
  const detailsAccess = checkAccess("opportunityDetails");
  const leadsAccess = checkAccess("leadsProvider");
  const outreachAccess = checkAccess("aiOutreachAssistance");
  const crmAccess = checkAccess("opportunityCRM");

  const confidenceScore = signal.confidence;
  const confidenceReasons = getConfidenceReasoning(signal);
  // Evidence comes directly from the Intelligence Engine as a structured array.
  // The frontend does NOT construct or fabricate evidence.
  const evidenceItems = Array.isArray(signal.evidence) ? signal.evidence : [];

  // ─── AI Assistant: Executive Brief + Why It Matters ───
  // The AI ONLY explains verified engine output. It NEVER invents facts.
  const generateAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are the ScoutyGo AI Intelligence Assistant. Your role is to EXPLAIN verified intelligence data. You must NEVER invent facts, evidence, sources, companies, people, or statistics.

You are given the following VERIFIED Intelligence Engine output:
- Title: ${signal.title}
- Category: ${signal.category}
- Location: ${signal.location}
- Entity: ${signal.entity_name || "N/A"}
- Summary: ${signal.summary || signal.explanation || "N/A"}
- Confidence: ${signal.confidence || "N/A"}%
- Source Type: ${signal.sourceType || "N/A"}
- Verification: ${signal.verificationStatus || "N/A"}
- Corroboration: ${signal.corroborationState || "N/A"}
- Detected Signals: ${(signal.signals || []).join(", ") || "N/A"}

Provide ONLY the following:
1. executive_brief: A concise 2-3 sentence executive-level explanation of what this opportunity is. Base this ONLY on the verified data above. Do not add details not present in the data.
2. why_it_matters: 2-3 key reasons why this verified opportunity is significant right now. Base this ONLY on the provided evidence and signals.

Do NOT invent companies, people, evidence, sources, or statistics that are not in the verified data above.`,
        response_json_schema: {
          type: "object",
          properties: {
            executive_brief: { type: "string" },
            why_it_matters: { type: "array", items: { type: "string" } },
          },
          required: ["executive_brief", "why_it_matters"],
        },
      });
      setAnalysis(result);
    } catch (err) {
      setError(err.message || "Failed to generate analysis");
    } finally {
      setLoading(false);
    }
  };

  // ─── Actions ───
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: signal.title, url }); } catch {}
    } else {
      navigator.clipboard.writeText(url);
      setShareMsg(true);
      setTimeout(() => setShareMsg(false), 2000);
    }
  };

  const handleTrack = () => {
    const name = signal.title.substring(0, 50);
    createAlert({
      name,
      category: signal.category || "",
      location: signal.location || "",
      keywords: signal.entity_name || "",
      minConfidence: signal.confidence || 50,
    });
    setTracked(true);
    setTimeout(() => setTracked(false), 3000);
  };

  const handleCreateMission = () => {
    setMissionWizardOpen(true);
  };

  const handleAddToCRM = () => {
    setCrmDialogOpen(true);
  };

  const handleCRMSaved = () => {
    setCrmAdded(true);
    window.dispatchEvent(new Event("crm-updated"));
    setTimeout(() => setCrmAdded(false), 3000);
  };

  // ─── AI Step Helpers ───
  const generateBtn = (
    <button
      onClick={generateAnalysis}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
    >
      <Sparkles className="w-3.5 h-3.5" /> Generate Executive Brief
    </button>
  );

  const loadingEl = (
    <div className="flex items-center gap-2 text-sm text-slate-400 py-2">
      <Loader2 className="w-4 h-4 animate-spin" /> AI Assistant is analyzing verified intelligence...
    </div>
  );

  const errorEl = (
    <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 flex items-center justify-between">
      <span className="text-sm text-rose-600">{error}</span>
      <button onClick={generateAnalysis} className="text-xs font-semibold text-rose-700 hover:underline">Retry</button>
    </div>
  );

  const aiCard = (content) => (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      {error ? errorEl : analysis ? content : loading ? loadingEl : generateBtn}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {/* ───────── Step 1: Opportunity (Intelligence Engine) ───────── */}
      <PipelineStep number={1} title="Opportunity" icon={Target} owner="engine">
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${style.badge}`}>
              {signal.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {signal.time_ago}
            </span>
            {signal.isNew && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                NEW
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight mb-3">
            {signal.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm mb-3">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {signal.location}
            </span>
            {signal.entity_name && (
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-slate-400" /> {signal.entity_name}
              </span>
            )}
          </div>
          {/* Engine metadata */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-50">
            {signal.marketSize && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3" /> {signal.marketSize}
              </span>
            )}
            {signal.timeline && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                <Calendar className="w-3 h-3" /> {signal.timeline}
              </span>
            )}
            {signal.sourceType && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                <Tag className="w-3 h-3" /> {signal.sourceType}
              </span>
            )}
            {signal.verificationStatus && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg">
                <ShieldCheck className="w-3 h-3" /> {signal.verificationStatus}
              </span>
            )}
          </div>
        </div>
      </PipelineStep>

      {/* ───────── Step 2: Executive Intelligence Brief (AI Assistant) ───────── */}
      <PipelineStep number={2} title="Executive Intelligence Brief" icon={Sparkles} owner="ai">
        {aiAccess === "LOCKED" || aiAccess === "PREVIEW" ? (
          <LockedFeature featureKey="aiAnalysis" title="Executive Intelligence Brief" description="AI-powered executive briefs are available on Pro and higher plans.">
            <div className="h-8" />
          </LockedFeature>
        ) : analysis ? (
          aiCard(<p className="text-slate-600 dark:text-slate-400 leading-relaxed">{analysis.executive_brief}</p>)
        ) : (
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            {(signal.summary || signal.explanation) && (
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{signal.summary || signal.explanation}</p>
            )}
            {error ? errorEl : loading ? loadingEl : generateBtn}
          </div>
        )}
      </PipelineStep>

      {/* ───────── Step 3: Opportunity Score (Intelligence Engine) ───────── */}
      <PipelineStep number={3} title="Opportunity Score" icon={Gauge} owner="engine">
        {scoreAccess === "LOCKED" ? (
          <LockedFeature featureKey="confidenceScores" title="Opportunity Score" description="Opportunity scores are available on Pro and higher plans.">
            <div className="h-8" />
          </LockedFeature>
        ) : signal.opportunityScore != null ? (
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-5">
            <ConfidenceBadge score={signal.opportunityScore} size="lg" />
            <div className="flex-1">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{signal.opportunityScore}%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Business Attractiveness Score</p>
              {signal.opportunityScoreFactors?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {signal.opportunityScoreFactors.map((factor, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-50 text-slate-600 dark:text-slate-400 border border-slate-100">
                      {factor}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <EnginePlaceholder message="Opportunity Score will be available when supported by the ScoutyGo Intelligence Engine." />
        )}
      </PipelineStep>

      {/* ───────── Step 4: AI Confidence (Intelligence Engine) ───────── */}
      <PipelineStep number={4} title="AI Confidence" icon={ShieldCheck} owner="engine">
        {scoreAccess === "LOCKED" ? (
          <LockedFeature featureKey="confidenceScores" title="AI Confidence" description="Confidence analysis is available on Pro and higher plans.">
            <div className="h-8" />
          </LockedFeature>
        ) : confidenceScore != null ? (
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                confidenceScore >= 75 ? "bg-emerald-50 text-emerald-700" :
                confidenceScore >= 50 ? "bg-amber-50 text-amber-700" :
                "bg-rose-50 text-rose-700"
              }`}>
                {confidenceScore}% Confidence
              </div>
              <span className="text-xs text-slate-400">Intelligence Engine Assessment</span>
            </div>
            {confidenceReasons.length > 0 ? (
              <ul className="space-y-2">
                {confidenceReasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{reason}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">Detailed confidence reasoning will be provided by the Intelligence Engine.</p>
            )}
          </div>
        ) : (
          <EnginePlaceholder message="Confidence assessment will be available when supported by the ScoutyGo Intelligence Engine." />
        )}
      </PipelineStep>

      {/* ───────── Step 5: Supporting Evidence (Intelligence Engine) ───────── */}
      <PipelineStep number={5} title="Supporting Evidence" icon={FileSearch} owner="engine">
        {evidenceAccess === "LOCKED" ? (
          <LockedFeature featureKey="evidenceAndSources" title="Supporting Evidence" description="Evidence and sources are available on Pro and higher plans.">
            <div className="h-8" />
          </LockedFeature>
        ) : evidenceItems.length > 0 ? (
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <div className="space-y-3">
              {evidenceItems.map((item, i) => {
                const sourceUrl = item.url || item.sourceUrl || null;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <FileSearch className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.type}</p>
                        {sourceUrl && (
                          <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EnginePlaceholder message="Supporting evidence will be available when provided by the ScoutyGo Intelligence Engine." />
        )}
      </PipelineStep>

      {/* ───────── Step 6: Why It Matters (AI Assistant) ───────── */}
      <PipelineStep number={6} title="Why It Matters" icon={Lightbulb} owner="ai">
        {aiAccess === "LOCKED" || aiAccess === "PREVIEW" ? (
          <LockedFeature featureKey="aiAnalysis" title="Why It Matters" description="AI significance analysis is available on Pro and higher plans.">
            <div className="h-8" />
          </LockedFeature>
        ) : (
          aiCard(
            <ul className="space-y-2.5">
              {analysis.why_it_matters?.map((reason, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{reason}</span>
                </li>
              ))}
            </ul>
          )
        )}
      </PipelineStep>

      {/* ───────── Step 7: Leads Provider Agent (Future Leads Engine) ───────── */}
      <PipelineStep number={7} title="Leads Provider Agent" icon={Users} owner="future">
        <LeadsWorkflow opportunity={signal} />
      </PipelineStep>

      {/* ───────── Step 8: Save (Frontend + Backend) ───────── */}
      <PipelineStep number={8} title="Save" icon={Bookmark} owner="action" compact>
        <div className="flex items-center gap-2">
          {saved && <span className="text-xs text-blue-600 font-medium">Saved</span>}
          <button
            onClick={() => toggleSave(signal)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              saved ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-blue-600" : ""}`} />
            {saved ? "Saved" : "Save Opportunity"}
          </button>
        </div>
      </PipelineStep>

      {/* ───────── Step 9: Create AI Mission (Frontend + Backend) ───────── */}
      <PipelineStep number={9} title="Create AI Mission" icon={Radar} owner="action" compact>
        <div className="flex items-center gap-2">
          <Link to={demoLink("/missions")} className="text-xs text-blue-600 font-medium hover:underline">View Missions</Link>
          <button
            onClick={handleCreateMission}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            <Radar className="w-3.5 h-3.5" />
            Create AI Mission
          </button>
        </div>
      </PipelineStep>

      {/* ───────── Step 10: Track (Frontend + Backend) ───────── */}
      <PipelineStep number={10} title="Track" icon={Bell} owner="action" compact>
        <div className="flex items-center gap-2">
          {tracked && (
            <Link to={demoLink("/alerts")} className="text-xs text-blue-600 font-medium hover:underline">View Alerts</Link>
          )}
          <button
            onClick={handleTrack}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              tracked ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            <Bell className={`w-3.5 h-3.5 ${tracked ? "fill-emerald-600" : ""}`} />
            {tracked ? "Tracking" : "Track"}
          </button>
        </div>
      </PipelineStep>

      {/* ───────── Step 11: Add to CRM (Future Backend) ───────── */}
      <PipelineStep number={11} title="Add to CRM" icon={PieChart} owner="action" compact isLast>
        {crmAccess === "LOCKED" ? (
          <Link
            to={demoLink("/account-overview")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-50 text-slate-400 border border-slate-100 hover:border-slate-200 transition-colors"
          >
            <PieChart className="w-3.5 h-3.5" /> Unlock CRM
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            {crmAdded && (
              <Link to={demoLink("/crm")} className="text-xs text-blue-600 font-medium hover:underline">View CRM</Link>
            )}
            <button
              onClick={handleAddToCRM}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                crmAdded ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              {crmAdded ? "Added to CRM" : "Add to CRM"}
            </button>
          </div>
        )}
      </PipelineStep>

      {/* Share — secondary action */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleShare}
          aria-label="Share opportunity link"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg"
        >
          <Share2 className="w-3.5 h-3.5" /> Share
          {shareMsg && (
            <span className="absolute -top-7 right-0 text-xs bg-slate-900 text-white px-2 py-1 rounded whitespace-nowrap">
              Link copied
            </span>
          )}
        </button>
      </div>

      <AddToCRMDialog
        open={crmDialogOpen}
        onOpenChange={setCrmDialogOpen}
        opportunity={signal}
        lead={null}
        onSaved={handleCRMSaved}
      />

      <CreateMissionWizard
        open={missionWizardOpen}
        onClose={() => setMissionWizardOpen(false)}
        prefill={{
          objective: signal.title
            ? `Find opportunities similar to: ${signal.title}${signal.country ? ` in ${signal.country}` : ""}`
            : "",
          industry: signal.category || "",
          countries: signal.country ? [signal.country] : [],
          categories: signal.category ? [signal.category] : [],
          keywords: [signal.company, signal.entity_name].filter(Boolean),
          source_opportunity_id: signal.id,
        }}
      />
    </motion.div>
  );
}