import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GitBranch, ArrowLeft, Lock, ArrowRight } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import { useEntitlement } from "@/hooks/useEntitlement";
import LockedFeature from "@/components/entitlement/LockedFeature";
import { PLANS } from "@/lib/plans";

const PIPELINE_STAGES = [
  "Discovered",
  "Researching",
  "Qualified",
  "Contacted",
  "Meeting",
  "Negotiation",
  "Won",
  "Lost",
];

export default function CRM() {
  const demoLink = useDemoLink();
  const { tier, checkAccess } = useEntitlement();
  const access = checkAccess('opportunityCRM');
  const upgradePlan = access === 'LOCKED' ? (tier === 'Pro' || tier === 'Free' ? 'Pro+' : 'Agency') : null;

  return (
    <div className="p-5 sm:p-8 max-w-5xl mx-auto">
      <Link to={demoLink("/dashboard")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <GitBranch className="w-5 h-5 text-blue-600" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Opportunity CRM</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 bg-white p-6 mb-6">
        <h2 className="text-sm font-bold text-slate-900 mb-2">Pipeline Stages</h2>
        <p className="text-xs text-slate-400 mb-4">Track opportunities from discovery through to close</p>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {PIPELINE_STAGES.map((stage, i) => (
            <React.Fragment key={stage}>
              <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-medium text-slate-500 whitespace-nowrap">
                {stage}
              </div>
              {i < PIPELINE_STAGES.length - 1 && <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      <LockedFeature
        featureKey="opportunityCRM"
        title="Opportunity CRM"
        description={
          access === 'LOCKED'
            ? `A lightweight CRM for tracking outreach, notes, tasks, and status changes for your opportunities. ${upgradePlan ? `Available with ${upgradePlan}.` : ''}`
            : `Your ${tier} plan includes ${access === 'FULL' ? 'full' : 'limited'} CRM access.`
        }
      >
        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center">
          <GitBranch className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">Your pipeline is empty. Add opportunities to your CRM to start tracking them.</p>
        </div>
      </LockedFeature>

      {upgradePlan && (
        <div className="mt-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-violet-50 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">Unlock with {upgradePlan}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                The {upgradePlan} plan (${PLANS[upgradePlan].price}/mo) includes {PLANS[upgradePlan].features.opportunityCRM.access === 'LIMITED' ? 'limited' : 'full'} Opportunity CRM access.
              </p>
            </div>
            <Link to={demoLink("/account-overview")} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shrink-0">
              Upgrade <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}