import React from "react";
import {
  Radar, Building2, ShieldCheck, Target, FileSearch, Gauge,
  Users, Mail, Send, Lock,
} from "lucide-react";

/**
 * Visual mission intelligence pipeline.
 * Renders the full flow from mission → companies → qualification →
 * buyer intent → evidence → quality gate → decision makers →
 * future enrichment → future outreach.
 *
 * Data comes from the mission object (Replit backend). Each stage
 * shows real counts when available, or a pending placeholder.
 */
const STAGES = [
  {
    key: 'mission',
    label: 'Mission',
    icon: Radar,
    color: 'blue',
    getValue: (m) => m ? 'Active' : null,
  },
  {
    key: 'companies_discovered',
    label: 'Companies Discovered',
    icon: Building2,
    color: 'blue',
    getValue: (m) => m?.companiesDiscovered ?? m?.companies_discovered ?? null,
  },
  {
    key: 'qualified',
    label: 'Qualified Companies',
    icon: ShieldCheck,
    color: 'emerald',
    getValue: (m) => m?.qualifiedCompanies ?? m?.qualified_companies ?? null,
  },
  {
    key: 'buyer_intent',
    label: 'Buyer Intent',
    icon: Target,
    color: 'violet',
    getValue: (m) => m?.buyerIntentCount ?? m?.buyer_intent_count ?? null,
  },
  {
    key: 'evidence',
    label: 'Evidence',
    icon: FileSearch,
    color: 'amber',
    getValue: (m) => m?.evidenceCount ?? m?.evidence_count ?? null,
  },
  {
    key: 'quality_gate',
    label: 'Quality Gate',
    icon: Gauge,
    color: 'emerald',
    getValue: (m) => m?.qualityGatePassed ?? m?.quality_gate_passed ?? null,
  },
  {
    key: 'decision_makers',
    label: 'Decision Makers',
    icon: Users,
    color: 'blue',
    getValue: (m) => m?.decisionMakersCount ?? m?.decision_makers_count ?? null,
  },
  {
    key: 'enrichment',
    label: 'Contact Enrichment',
    icon: Mail,
    color: 'slate',
    getValue: () => null,
    future: true,
  },
  {
    key: 'outreach',
    label: 'Outreach',
    icon: Send,
    color: 'slate',
    getValue: () => null,
    future: true,
  },
];

const COLOR_MAP = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-900', dot: 'bg-blue-500' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-900', dot: 'bg-emerald-500' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-100 dark:border-violet-900', dot: 'bg-violet-500' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-900', dot: 'bg-amber-500' },
  slate: { bg: 'bg-slate-50 dark:bg-slate-800/50', text: 'text-slate-400 dark:text-slate-500', border: 'border-slate-100 dark:border-slate-700', dot: 'bg-slate-300 dark:bg-slate-600' },
};

function PipelineStage({ stage, mission, isLast }) {
  const value = stage.getValue(mission);
  const hasValue = value != null;
  const colors = COLOR_MAP[stage.color] || COLOR_MAP.slate;
  const Icon = stage.icon;

  return (
    <div className="flex items-start gap-0">
      <div className="flex flex-col items-center" style={{ minWidth: '72px' }}>
        <div className={`w-12 h-12 rounded-2xl border ${colors.border} ${colors.bg} flex items-center justify-center shrink-0 ${stage.future ? 'opacity-50' : ''}`}>
          {stage.future ? <Lock className="w-5 h-5 text-slate-300 dark:text-slate-600" /> : <Icon className={`w-5 h-5 ${colors.text}`} />}
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 min-h-[2rem] my-1" />
        )}
      </div>
      <div className="flex-1 pb-6">
        <p className={`text-xs font-bold ${stage.future ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
          {stage.label}
        </p>
        {stage.future ? (
          <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-0.5">Coming soon</p>
        ) : hasValue ? (
          <p className={`text-sm font-bold ${colors.text} mt-0.5`}>{value}</p>
        ) : (
          <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-0.5">Pending</p>
        )}
      </div>
    </div>
  );
}

export default function MissionPipeline({ mission }) {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Radar className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Intelligence Pipeline</h3>
        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase border bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900">
          Engine
        </span>
      </div>
      <div>
        {STAGES.map((stage, i) => (
          <PipelineStage
            key={stage.key}
            stage={stage}
            mission={mission}
            isLast={i === STAGES.length - 1}
          />
        ))}
      </div>
    </div>
  );
}