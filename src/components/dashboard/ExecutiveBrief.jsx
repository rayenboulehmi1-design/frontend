import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Loader2, AlertCircle, ArrowRight, Clock, Star, Globe, Zap, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { getGreeting, uniqueCountries } from "@/lib/dealUtils";
import { useDemoLink } from "@/lib/demoMode";
import { useEntitlement } from "@/hooks/useEntitlement";
import LockedFeature from "@/components/entitlement/LockedFeature";
import ConfidenceBadge from "@/components/dashboard/ConfidenceBadge";
import { getTypeStyle } from "@/lib/dealUtils";

export default function ExecutiveBrief({ signals, user, dataStatus, lastUpdated, onRetry }) {
  const firstName = user?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";
  const demoLink = useDemoLink();
  const { checkAccess } = useEntitlement();
  const aiAccess = checkAccess("aiAnalysis");

  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── Engine-derived metrics (NOT AI) ───
  const engineMetrics = useMemo(() => {
    if (!signals.length) return null;
    const newCount = signals.filter((s) => s.isNew).length;
    const priority = signals.filter((s) => s.confidence != null && s.confidence >= 75).length;
    const markets = uniqueCountries(signals).length;
    const urgent = signals.filter((s) => {
      const tl = (s.timeline || "").toLowerCase();
      return s.confidence >= 80 && (tl.includes("3 month") || tl.includes("1 month") || tl.includes("2 month") || tl.includes("immediate") || !s.timeline);
    });

    const priorities = [...signals]
      .filter((s) => s.confidence != null)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);

    return { newCount, priority, markets, urgent: urgent.length, priorities };
  }, [signals]);

  // ─── AI Brief generation (explains engine output only) ───
  const generateBrief = async () => {
    setLoading(true);
    setError(null);
    try {
      const topSignals = (engineMetrics?.priorities || []).slice(0, 5).map((s) => ({
        title: s.title,
        category: s.category,
        location: s.location,
        confidence: s.confidence,
        company: s.company || s.entity_name,
      }));
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are the ScoutyGo AI Intelligence Assistant. Generate an executive intelligence brief for ${firstName}.

You are given VERIFIED Intelligence Engine output:
- Total signals today: ${signals.length}
- New signals: ${engineMetrics?.newCount || 0}
- Priority opportunities (confidence ≥ 75%): ${engineMetrics?.priority || 0}
- Active markets: ${engineMetrics?.markets || 0}
- Urgent opportunities: ${engineMetrics?.urgent || 0}
- Top opportunities: ${JSON.stringify(topSignals)}

Generate ONLY the following:
1. summary: A 2-3 sentence executive summary of today's intelligence landscape. Base this ONLY on the verified data above.
2. key_points: 3-4 bullet points highlighting what requires attention. Use ONLY verified data.
3. recommended_action: One concise recommended next step based on the verified data.

Do NOT invent facts, evidence, sources, companies, people, or statistics not present in the data above.`,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            key_points: { type: "array", items: { type: "string" } },
            recommended_action: { type: "string" },
          },
          required: ["summary", "key_points", "recommended_action"],
        },
      });
      setBrief(result);
    } catch (err) {
      setError(err.message || "Failed to generate executive brief");
    } finally {
      setLoading(false);
    }
  };

  // ─── Loading state ───
  if (dataStatus === "loading") {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6">
        <div className="flex items-center gap-2 mb-5">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          <h2 className="text-xl font-bold text-slate-900">{getGreeting()}, {firstName}</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
        <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  // ─── Error state ───
  if (dataStatus === "error") {
    const updatedText = lastUpdated
      ? new Date(lastUpdated).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      : null;
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{getGreeting()}, {firstName}</h2>
            <p className="text-sm text-amber-600 mt-0.5">
              Live intelligence is temporarily unavailable.
              {updatedText && <span className="text-slate-400"> · Last updated {updatedText}</span>}
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed mb-4">
          We're having trouble connecting to the ScoutyGo Intelligence Engine. Your data will appear here once the connection is restored.
        </p>
        {onRetry && (
          <button onClick={onRetry} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors">
            <RefreshCw className="w-4 h-4" /> Retry Connection
          </button>
        )}
      </motion.div>
    );
  }

  // ─── Empty state ───
  if (dataStatus === "empty" || !engineMetrics) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 bg-white p-6">
        <h2 className="text-xl font-bold text-slate-900">{getGreeting()}, {firstName}</h2>
        <p className="text-sm text-slate-500 mt-0.5 mb-6">
          No opportunities have been detected yet. ScoutyGo is actively scanning global markets — check back shortly.
        </p>
      </motion.div>
    );
  }

  // ─── KPI Cards (engine-owned data) ───
  const kpiCards = [
    { label: "New Signals", value: engineMetrics.newCount, icon: Clock, color: "text-blue-600", bg: "bg-blue-50", link: demoLink("/intelligence-feed") },
    { label: "Priority Opportunities", value: engineMetrics.priority, icon: Star, color: "text-amber-600", bg: "bg-amber-50", link: demoLink("/dashboard") },
    { label: "Active Markets", value: engineMetrics.markets, icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50", link: demoLink("/geo-intelligence") },
    { label: "Urgent Changes", value: engineMetrics.urgent, icon: Zap, color: "text-rose-600", bg: "bg-rose-50", link: demoLink("/alerts") },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{getGreeting()}, {firstName}</h2>
          <p className="text-sm text-slate-500 mt-0.5">Today's Executive Intelligence Brief</p>
        </div>
        {lastUpdated && (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" /> {new Date(lastUpdated).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} to={card.link} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className="text-2xl font-bold text-slate-900">{card.value}</div>
              <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                {card.label}
                <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* AI Executive Brief */}
      <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50/30 to-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wide text-violet-600">AI Executive Brief</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase border bg-slate-50 text-slate-500 border-slate-200">AI Assistant</span>
        </div>

        {aiAccess === "LOCKED" || aiAccess === "PREVIEW" ? (
          <LockedFeature featureKey="aiAnalysis" title="AI Executive Brief" description="AI-generated executive briefs are available on Pro and higher plans.">
            <div className="h-12" />
          </LockedFeature>
        ) : brief ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-700 leading-relaxed">{brief.summary}</p>
            {brief.key_points?.length > 0 && (
              <ul className="space-y-1.5">
                {brief.key_points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            )}
            {brief.recommended_action && (
              <div className="flex items-start gap-2 pt-3 border-t border-violet-100">
                <ArrowRight className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
                <p className="text-sm font-medium text-slate-700">{brief.recommended_action}</p>
              </div>
            )}
            <button onClick={generateBrief} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Regenerate brief</button>
          </div>
        ) : loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-400 py-3">
            <Loader2 className="w-4 h-4 animate-spin" /> AI Assistant is analyzing verified intelligence...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-rose-100 bg-rose-50 p-3 flex items-center justify-between">
            <span className="text-sm text-rose-600">{error}</span>
            <button onClick={generateBrief} className="text-xs font-semibold text-rose-700 hover:underline">Retry</button>
          </div>
        ) : (
          <button onClick={generateBrief} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors">
            <Sparkles className="w-3.5 h-3.5" /> Generate Executive Brief
          </button>
        )}
      </div>

      {/* Priority Opportunities quick list */}
      {engineMetrics.priorities.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Priority Opportunities</h3>
          <div className="space-y-2">
            {engineMetrics.priorities.map((deal, i) => {
              const typeStyle = getTypeStyle(deal.type || deal.category);
              return (
                <Link key={deal.id} to={demoLink(`/opportunities/${deal.id}`)} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${typeStyle.badge}`}>{deal.type || deal.category}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">{deal.company || deal.entity_name || deal.title}</p>
                    <p className="text-xs text-slate-400 truncate">{deal.country || deal.location}</p>
                  </div>
                  {deal.confidence != null && <ConfidenceBadge score={deal.confidence} size="sm" />}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}