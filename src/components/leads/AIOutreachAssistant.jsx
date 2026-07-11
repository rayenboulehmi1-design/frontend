import React, { useState } from "react";
import { Sparkles, Lock, Mail, MessageSquare, Phone, Calendar, MessageCircle, Copy, Check, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useEntitlement } from "@/hooks/useEntitlement";
import LockedFeature from "@/components/entitlement/LockedFeature";

const OUTREACH_TYPES = [
  { key: "email", label: "Email Draft", icon: Mail },
  { key: "linkedin", label: "LinkedIn Message", icon: MessageSquare },
  { key: "call_prep", label: "Call Prep Notes", icon: Phone },
  { key: "meeting_brief", label: "Meeting Brief", icon: Calendar },
  { key: "talking_points", label: "Talking Points", icon: MessageCircle },
];

export default function AIOutreachAssistant({ lead }) {
  const { checkAccess } = useEntitlement();
  const access = checkAccess("aiOutreachAssistance");
  const [activeType, setActiveType] = useState("email");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  if (access === "LOCKED") {
    return (
      <LockedFeature
        featureKey="aiOutreachAssistance"
        title="AI Outreach Assistance"
        description="Generate personalized email drafts, LinkedIn messages, call prep notes, and meeting briefs from verified lead data. Available on Pro+ and higher plans."
      >
        <div className="h-8" />
      </LockedFeature>
    );
  }

  // AI outreach requires verified lead data — never generate from unverified or missing data
  const hasVerifiedData =
    lead?.verificationStatus === "verified" &&
    lead?.decisionMaker?.verificationStatus === "verified" &&
    lead?.company?.companyName &&
    lead?.decisionMaker?.fullName;

  if (!hasVerifiedData) {
    return (
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI Outreach Assistance</h3>
        </div>
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-5 text-center">
          <Lock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Verified Lead Data Required</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            AI outreach generation is available only after a lead's company and decision-maker data
            have been verified by the Leads Intelligence Engine. The AI never invents contact
            information or unsupported facts.
          </p>
        </div>
      </div>
    );
  }

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setResult(null);
    try {
      const typeLabel = OUTREACH_TYPES.find((t) => t.key === activeType)?.label || "outreach";
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are the ScoutyGo AI Outreach Assistant. Draft a professional ${typeLabel} based ONLY on the verified lead data below. You must NEVER invent email addresses, phone numbers, LinkedIn URLs, or any personal details not explicitly provided in the verified data.

VERIFIED LEAD DATA (use only this):
- Opportunity: ${lead.opportunity?.title || "N/A"}
- Company: ${lead.company?.companyName}
- Industry: ${lead.company?.industry || "N/A"}
- Location: ${lead.company?.country || "N/A"}
- Decision Maker: ${lead.decisionMaker?.fullName}
- Job Title: ${lead.decisionMaker?.jobTitle || "N/A"}

Generate a professional ${typeLabel}. Do not include any contact details (email, phone, LinkedIn) that are not in the verified data above. Base the content solely on the opportunity context and the decision maker's role.`,
        response_json_schema: {
          type: "object",
          properties: {
            subject: { type: "string", description: "Subject line (for email) or opening line" },
            body: { type: "string", description: "The full outreach content" },
            key_points: { type: "array", items: { type: "string" }, description: "Suggested talking points or follow-up actions" },
          },
          required: ["body"],
        },
      });
      setResult(response);
    } catch (err) {
      setError(err.message || "Failed to generate outreach content");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    const text = result?.subject ? `Subject: ${result.subject}\n\n${result.body}` : result?.body || "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-violet-500" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI Outreach Assistance</h3>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">Generated from verified data only</span>
      </div>

      {/* Outreach type tabs */}
      <div className="flex items-center gap-1.5 flex-wrap mb-4">
        {OUTREACH_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.key}
              onClick={() => { setActiveType(type.key); setResult(null); }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeType === type.key
                  ? "bg-violet-600 text-white"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {type.label}
            </button>
          );
        })}
      </div>

      {/* Generate button */}
      {!result && !generating && !error && (
        <button
          onClick={handleGenerate}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
        >
          <Sparkles className="w-4 h-4" /> Generate {OUTREACH_TYPES.find((t) => t.key === activeType)?.label}
        </button>
      )}

      {generating && (
        <div className="flex items-center gap-2 py-4 justify-center">
          <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
          <span className="text-sm text-slate-400">AI Assistant is drafting outreach from verified data...</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 flex items-center justify-between">
          <span className="text-sm text-rose-600">{error}</span>
          <button onClick={handleGenerate} className="text-xs font-semibold text-rose-700 hover:underline">Retry</button>
        </div>
      )}

      {result && (
        <div className="space-y-3">
          {result.subject && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Subject / Opening</p>
              <p className="text-sm font-medium text-slate-900">{result.subject}</p>
            </div>
          )}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Content</p>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{result.body}</p>
          </div>
          {result.key_points?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Key Points</p>
              <ul className="space-y-1">
                {result.key_points.map((point, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <Check className="w-3 h-3 mt-0.5 text-emerald-500 shrink-0" /> {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex items-center gap-2 pt-2">
            <button onClick={handleCopy} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-slate-300 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button onClick={() => setResult(null)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-slate-300 transition-colors">
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}