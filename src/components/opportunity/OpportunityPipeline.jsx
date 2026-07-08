import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Target, Sparkles, Gauge, ShieldCheck, FileSearch, Lightbulb,
  Users, UserCheck, Mail, Bookmark, Radar, Bell, PieChart,
  Share2, Loader2, Check, MapPin, Building2, Clock,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";
import { useEntitlement } from "@/hooks/useEntitlement";
import { useDemoLink } from "@/lib/demoMode";
import ConfidenceBadge from "@/components/dashboard/ConfidenceBadge";
import LockedFeature from "@/components/entitlement/LockedFeature";
import PipelineStep from "@/components/opportunity/PipelineStep";

const categoryStyles = {
  "Real Estate": { badge: "bg-blue-50 text-blue-700 border-blue-100" },
  Investment: { badge: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  Business: { badge: "bg-violet-50 text-violet-700 border-violet-100" },
};

export default function OpportunityPipeline({ signal }) {
  const demoLink = useDemoLink();
  const { isSaved, toggleSave } = useSavedOpportunities();
  const { checkAccess } = useEntitlement();
  const saved = isSaved(signal.id);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shareMsg, setShareMsg] = useState(false);
  const [tracked, setTracked] = useState(false);
  const [missionCreated, setMissionCreated] = useState(false);
  const [crmAdded, setCrmAdded] = useState(false);

  const style = categoryStyles[signal.category] || categoryStyles["Real Estate"];
  const aiAccess = checkAccess("aiAnalysis");
  const crmAccess = checkAccess("opportunityCRM");
  const score = signal.confidence;

  // ─── AI Analysis ───
  const generateAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are ScoutyGo Intelligence. Analyze this business opportunity and provide structured insights.

Title: ${signal.title}
Category: ${signal.category}
Location: ${signal.location}
Entity: ${signal.entity_name || "N/A"}
Summary: ${signal.summary || signal.explanation || "N/A"}
Confidence: ${signal.confidence || "N/A"}%

Provide:
1. ai_summary: A concise 2-3 sentence intelligent summary of what this opportunity is.
2. ai_confidence: An object with:
   - level: "High", "Moderate", or "Low"
   - reasoning: 1-2 sentences explaining the confidence assessment based on available data.
3. supporting_evidence: An array of 3-5 evidence items, each with:
   - type: The type of evidence (e.g., "Public Filing", "News Source", "Market Data", "Registry Record", "Broker Activity")
   - description: Brief description of what the evidence indicates.
4. why_it_matters: 2-3 key reasons why this opportunity is significant right now.`,
        response_json_schema: {
          type: "object",
          properties: {
            ai_summary: { type: "string" },
            ai_confidence: {
              type: "object",
              properties: {
                level: { type: "string" },
                reasoning: { type: "string" },
              },
              required: ["level", "reasoning"],
            },
            supporting_evidence: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  description: { type: "string" },
                },
                required: ["type", "description"],
              },
            },
            why_it_matters: { type: "array", items: { type: "string" } },
          },
          required: ["ai_summary", "ai_confidence", "supporting_evidence", "why_it_matters"],
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
    const alerts = JSON.parse(localStorage.getItem("scouty_alerts") || "[]");
    if (!alerts.some((a) => a.name === signal.title.substring(0, 50))) {
      localStorage.setItem("scouty_alerts", JSON.stringify([{
        id: Date.now().toString(),
        name: signal.title.substring(0, 50),
        category: signal.category || "",
        location: signal.location || "",
        keywords: signal.entity_name || "",
        minConfidence: signal.confidence || 50,
        createdAt: new Date().toISOString(),
      }, ...alerts]));
    }
    setTracked(true);
    setTimeout(() => setTracked(false), 3000);
  };

  const handleCreateMission = () => {
    const missions = JSON.parse(localStorage.getItem("scouty_missions") || "[]");
    if (!missions.some((m) => m.name === signal.title.substring(0, 40))) {
      localStorage.setItem("scouty_missions", JSON.stringify([{
        id: Date.now().toString(),
        name: signal.title.substring(0, 40),
        category: signal.category || "",
        location: signal.location || "",
        keywords: signal.entity_name || "",
        minConfidence: signal.confidence || 50,
        active: true,
        createdAt: new Date().toISOString(),
      }, ...missions]));
    }
    setMissionCreated(true);
    setTimeout(() => setMissionCreated(false), 3000);
  };

  const handleAddToCRM = () => {
    const pipeline = JSON.parse(localStorage.getItem("scouty_crm_pipeline") || "[]");
    if (!pipeline.some((p) => p.signalId === signal.id)) {
      localStorage.setItem("scouty_crm_pipeline", JSON.stringify([{
        id: Date.now().toString(),
        signalId: signal.id,
        title: signal.title,
        category: signal.category,
        location: signal.location,
        entity_name: signal.entity_name,
        confidence: signal.confidence,
        stage: "Discovered",
        createdAt: new Date().toISOString(),
      }, ...pipeline]));
    }
    setCrmAdded(true);
    setTimeout(() => setCrmAdded(false), 3000);
  };

  // ─── AI Step Helpers ───
  const generateBtn = (
    <button
      onClick={generateAnalysis}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
    >
      <Sparkles className="w-3.5 h-3.5" /> Generate AI Analysis
    </button>
  );

  const loadingEl = (
    <div className="flex items-center gap-2 text-sm text-slate-400 py-2">
      <Loader2 className="w-4 h-4 animate-spin" /> Analyzing opportunity...
    </div>
  );

  const errorEl = (
    <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 flex items-center justify-between">
      <span className="text-sm text-rose-600">{error}</span>
      <button onClick={generateAnalysis} className="text-xs font-semibold text-rose-700 hover:underline">Retry</button>
    </div>
  );

  const aiCard = (content) => (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      {error ? errorEl : analysis ? content : loading ? loadingEl : generateBtn}
    </div>
  );

  const futureCard = (icon, description) => (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-5 text-center">
      {icon && React.createElement(icon, { className: "w-8 h-8 text-slate-300 mx-auto mb-2" })}
      <p className="text-sm font-medium text-slate-500">Coming Soon</p>
      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">{description}</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {/* Step 1: Opportunity */}
      <PipelineStep number={1} title="Opportunity" icon={Target}>
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${style.badge}`}>
              {signal.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {signal.time_ago}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-tight mb-3">
            {signal.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {signal.location}
            </span>
            {signal.entity_name && (
              <span className="flex items-center gap-1.5 text-slate-600">
                <Building2 className="w-3.5 h-3.5 text-slate-400" /> {signal.entity_name}
              </span>
            )}
          </div>
        </div>
      </PipelineStep>

      {/* Step 2: AI Summary */}
      <PipelineStep number={2} title="AI Summary" icon={Sparkles}>
        {aiAccess === "LOCKED" || aiAccess === "PREVIEW" ? (
          <LockedFeature featureKey="aiAnalysis" title="AI Summary" description="AI-powered summaries are available on Pro and higher plans.">
            <div className="h-8" />
          </LockedFeature>
        ) : analysis ? (
          aiCard(<p className="text-slate-600 leading-relaxed">{analysis.ai_summary}</p>)
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            {(signal.summary || signal.explanation) && (
              <p className="text-slate-600 leading-relaxed mb-3">{signal.summary || signal.explanation}</p>
            )}
            {error ? errorEl : loading ? loadingEl : generateBtn}
          </div>
        )}
      </PipelineStep>

      {/* Step 3: Opportunity Score */}
      <PipelineStep number={3} title="Opportunity Score" icon={Gauge}>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 flex items-center gap-5">
          <ConfidenceBadge score={score} size="lg" />
          <div>
            <p className="text-2xl font-bold text-slate-900">
              {score != null ? `${score}%` : "N/A"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">ScoutyGo Confidence Score</p>
          </div>
        </div>
      </PipelineStep>

      {/* Step 4: AI Confidence */}
      <PipelineStep number={4} title="AI Confidence" icon={ShieldCheck}>
        {aiAccess === "LOCKED" || aiAccess === "PREVIEW" ? (
          <LockedFeature featureKey="aiAnalysis" title="AI Confidence" description="AI confidence assessment is available on Pro and higher plans.">
            <div className="h-8" />
          </LockedFeature>
        ) : (
          aiCard(
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  analysis.ai_confidence?.level === "High" ? "bg-emerald-50 text-emerald-700" :
                  analysis.ai_confidence?.level === "Moderate" ? "bg-amber-50 text-amber-700" :
                  "bg-rose-50 text-rose-700"
                }`}>
                  {analysis.ai_confidence?.level || "—"} Confidence
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{analysis.ai_confidence?.reasoning}</p>
              {(signal.verificationStatus || signal.corroborationState || signal.freshnessState) && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {signal.verificationStatus && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {signal.verificationStatus}
                    </span>
                  )}
                  {signal.corroborationState && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {signal.corroborationState}
                    </span>
                  )}
                  {signal.freshnessState && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-100">
                      {signal.freshnessState}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        )}
      </PipelineStep>

      {/* Step 5: Supporting Evidence */}
      <PipelineStep number={5} title="Supporting Evidence" icon={FileSearch}>
        {aiAccess === "LOCKED" || aiAccess === "PREVIEW" ? (
          <LockedFeature featureKey="aiAnalysis" title="Supporting Evidence" description="AI evidence analysis is available on Pro and higher plans.">
            <div className="h-8" />
          </LockedFeature>
        ) : (
          aiCard(
            <div className="space-y-3">
              {analysis.supporting_evidence?.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <FileSearch className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.type}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </PipelineStep>

      {/* Step 6: Why It Matters */}
      <PipelineStep number={6} title="Why It Matters" icon={Lightbulb}>
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
                  <span className="text-sm text-slate-600">{reason}</span>
                </li>
              ))}
            </ul>
          )
        )}
      </PipelineStep>

      {/* Step 7: Potential Buyers (future) */}
      <PipelineStep number={7} title="Potential Buyers" icon={Users}>
        {futureCard(Users, "AI-powered buyer identification will automatically match this opportunity to likely investor and buyer profiles.")}
      </PipelineStep>

      {/* Step 8: Decision Makers (future) */}
      <PipelineStep number={8} title="Decision Makers" icon={UserCheck}>
        {futureCard(UserCheck, "The Leads Provider Agent will discover and verify key decision makers associated with this opportunity.")}
      </PipelineStep>

      {/* Step 9: Suggested Outreach (future) */}
      <PipelineStep number={9} title="Suggested Outreach" icon={Mail}>
        {futureCard(Mail, "AI outreach assistance will generate personalized outreach strategies and messaging for decision makers.")}
      </PipelineStep>

      {/* Step 10: Save */}
      <PipelineStep number={10} title="Save" icon={Bookmark} compact>
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

      {/* Step 11: Create AI Mission */}
      <PipelineStep number={11} title="Create AI Mission" icon={Radar} compact>
        <div className="flex items-center gap-2">
          {missionCreated && (
            <Link to={demoLink("/missions")} className="text-xs text-blue-600 font-medium hover:underline">View Missions</Link>
          )}
          <button
            onClick={handleCreateMission}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              missionCreated ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            {missionCreated ? "Mission Created" : "Create AI Mission"}
          </button>
        </div>
      </PipelineStep>

      {/* Step 12: Track */}
      <PipelineStep number={12} title="Track" icon={Bell} compact>
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

      {/* Step 13: Add to CRM */}
      <PipelineStep number={13} title="Add to CRM" icon={PieChart} compact isLast>
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
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors relative"
        >
          <Share2 className="w-3.5 h-3.5" /> Share
          {shareMsg && (
            <span className="absolute -top-7 right-0 text-xs bg-slate-900 text-white px-2 py-1 rounded whitespace-nowrap">
              Link copied
            </span>
          )}
        </button>
      </div>
    </motion.div>
  );
}