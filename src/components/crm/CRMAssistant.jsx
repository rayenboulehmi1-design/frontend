import React, { useState } from "react";
import { Sparkles, Loader2, Copy, Check, RefreshCw, FileText, MessageSquare, Lightbulb, AlertCircle, Lock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useEntitlement } from "@/hooks/useEntitlement";
import LockedFeature from "@/components/entitlement/LockedFeature";

const AI_ACTIONS = [
  { key: "summary", label: "Summarize History", icon: FileText },
  { key: "next_action", label: "Suggest Next Action", icon: Lightbulb },
  { key: "follow_up", label: "Draft Follow-up", icon: MessageSquare },
  { key: "meeting_brief", label: "Meeting Brief", icon: FileText },
];

export default function CRMAssistant({ record, activities, tasks, meetings }) {
  const { checkAccess } = useEntitlement();
  const access = checkAccess("aiAnalysis");
  const [activeAction, setActiveAction] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  if (access === "LOCKED") {
    return (
      <LockedFeature featureKey="aiAnalysis" title="CRM AI Assistant" description="AI-powered CRM assistance — summarize history, suggest next actions, draft follow-ups, and prepare meeting briefs. Available on Pro and higher plans.">
        <div className="h-8" />
      </LockedFeature>
    );
  }

  // AI requires verified CRM context — never invents data
  const hasContext = record && record.title;

  if (!hasContext) {
    return (
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">CRM AI Assistant</h3>
        </div>
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-5 text-center">
          <Lock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">CRM Context Required</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            AI assistance is available only for saved CRM records with verified context. The AI never invents meetings, contact attempts, deal values, or outcomes.
          </p>
        </div>
      </div>
    );
  }

  const buildPrompt = (action) => {
    const context = `
VERIFIED CRM RECORD:
- Title: ${record.title}
- Stage: ${record.stage}
- Priority: ${record.priority}
- Company: ${record.companyName || "N/A"}
- Decision Maker: ${record.personName || "N/A"}
- Next Action: ${record.nextAction || "N/A"}
- Next Action Date: ${record.nextActionDate || "N/A"}
- Intelligence Status: ${record.intelligenceStatus || "N/A"}
- Source Opportunity: ${record.entity_name || record.category || "N/A"}

RECENT ACTIVITIES (${activities.length}):
${activities.slice(0, 10).map((a) => `- ${a.type}: ${a.description}`).join("\n") || "None"}

TASKS (${tasks.length}):
${tasks.map((t) => `- ${t.title} (${t.status}, ${t.priority})`).join("\n") || "None"}

MEETINGS (${meetings.length}):
${meetings.map((m) => `- ${m.title} on ${m.dateTime || "unscheduled"}`).join("\n") || "None"}
`;

    const prompts = {
      summary: `Summarize the CRM history for this record. Base your summary ONLY on the verified data and activities provided. Do not invent meetings, contact attempts, or outcomes that are not listed.${context}`,
      next_action: `Based on the verified CRM data, suggest the single most logical next action. Consider the current stage, pending tasks, and recent activities. Do not invent data or assume outcomes not present.${context}`,
      follow_up: `Draft a professional follow-up message based ONLY on the verified CRM data. Do not include any contact details, deal values, promises, or commitments not explicitly in the data.${context}`,
      meeting_brief: `Prepare a meeting brief based ONLY on the verified CRM data. Include relevant context about the opportunity, company, and decision maker. Do not invent information not present in the data.${context}`,
    };
    return prompts[action];
  };

  const handleGenerate = async (action) => {
    setActiveAction(action);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: buildPrompt(action) + "\n\nIMPORTANT: You must NEVER invent meetings, contact attempts, customer statements, deal values, promises, commitments, or outcomes. Use only the verified data above.",
        response_json_schema: {
          type: "object",
          properties: {
            content: { type: "string", description: "The AI-generated response" },
            caveats: { type: "array", items: { type: "string" }, description: "Any limitations or data gaps noted" },
          },
          required: ["content"],
        },
      });
      setResult(response);
    } catch (err) {
      setError(err.message || "Failed to generate AI response");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result?.content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-violet-500" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">CRM AI Assistant</h3>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">Verified data only</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-4">
        {AI_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.key}
              onClick={() => handleGenerate(action.key)}
              disabled={loading}
              className={`inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeAction === action.key ? "bg-violet-600 text-white" : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700"
              } disabled:opacity-50`}
            >
              <Icon className="w-3.5 h-3.5" /> {action.label}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-4 justify-center">
          <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
          <span className="text-sm text-slate-400">AI Assistant is analyzing verified CRM data...</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 flex items-center justify-between">
          <span className="text-sm text-rose-600">{error}</span>
          <button onClick={() => handleGenerate(activeAction)} className="text-xs font-semibold text-rose-700 hover:underline">Retry</button>
        </div>
      )}

      {result && (
        <div className="space-y-2">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3">
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{result.content}</p>
          </div>
          {result.caveats?.length > 0 && (
            <div className="flex items-start gap-1.5 text-[11px] text-slate-400">
              <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
              <span>{result.caveats.join(" · ")}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-slate-300 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />} {copied ? "Copied" : "Copy"}
            </button>
            <button onClick={() => handleGenerate(activeAction)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-slate-300 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}