import React from "react";
import { Link } from "react-router-dom";
import { Search, Building2, UserCheck, Mail, ShieldCheck, Sparkles, GitBranch, ArrowRight, Gauge } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import { useEntitlement } from "@/hooks/useEntitlement";
import LockedFeature from "@/components/entitlement/LockedFeature";
import EnginePlaceholder from "@/components/opportunity/EnginePlaceholder";

const WORKFLOW_STEPS = [
  { label: "Find Relevant Companies", icon: Search, desc: "Identify companies connected to this verified opportunity" },
  { label: "Company Matches", icon: Building2, desc: "Review matched companies with relevance scores and evidence" },
  { label: "Find Decision Makers", icon: UserCheck, desc: "Discover key decision makers at matched companies" },
  { label: "Contact Enrichment", icon: Mail, desc: "Gather public business contact information" },
  { label: "Verification", icon: ShieldCheck, desc: "Verify contact details and data quality" },
  { label: "Lead Relevance", icon: Gauge, desc: "Score how strongly the verified company and decision maker match the source opportunity" },
  { label: "Outreach Assistance", icon: Sparkles, desc: "Generate AI-powered outreach from verified data only" },
  { label: "Add to CRM", icon: GitBranch, desc: "Track the lead through your pipeline to outcome" },
];

export default function LeadsWorkflow({ opportunity }) {
  const demoLink = useDemoLink();
  const { checkAccess } = useEntitlement();
  const access = checkAccess("leadsProvider");

  if (access === "LOCKED") {
    return (
      <LockedFeature
        featureKey="leadsProvider"
        title="Leads Provider Agent"
        description="Discover relevant companies, decision makers, and verified contacts for this opportunity. Available on Pro+ and higher plans."
      >
        <div className="h-8" />
      </LockedFeature>
    );
  }

  return (
    <div>
      <EnginePlaceholder message="The Leads Intelligence Engine will power this workflow — company matching, decision-maker discovery, enrichment, and verification are all managed by the backend. No search has been performed yet." />

      <div className="mt-4 space-y-2">
        {WORKFLOW_STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-50 bg-slate-50/30">
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-700">
                  <span className="text-slate-400 mr-1">{i + 1}.</span>{step.label}
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
              {i < WORKFLOW_STEPS.length - 1 && (
                <ArrowRight className="w-3 h-3 text-slate-200 shrink-0 rotate-90" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[10px] text-slate-400">
          Source opportunity: <span className="font-medium text-slate-500">{opportunity?.title?.substring(0, 50) || "Current opportunity"}</span>
        </p>
        <Link to={demoLink("/leads")} className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700">
          View All Leads <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}