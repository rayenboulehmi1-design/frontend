import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, ArrowLeft, Lock, ArrowRight, Building2, Search, Mail } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import { useEntitlement } from "@/hooks/useEntitlement";
import LockedFeature from "@/components/entitlement/LockedFeature";
import { PLANS } from "@/lib/plans";

export default function Leads() {
  const demoLink = useDemoLink();
  const { tier, checkAccess } = useEntitlement();
  const access = checkAccess('leadsProvider');
  const upgradePlan = access === 'LOCKED' ? (tier === 'Pro' ? 'Pro+' : 'Agency') : null;

  return (
    <div className="p-5 sm:p-8 max-w-5xl mx-auto">
      <Link to={demoLink("/dashboard")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <Users className="w-5 h-5 text-blue-600" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Leads Provider Agent</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 bg-white p-6 mb-6">
        <h2 className="text-sm font-bold text-slate-900 mb-4">How It Works</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Building2, title: "Relevant Companies", desc: "Companies associated with detected opportunities are automatically identified" },
            { icon: Users, title: "Decision Makers", desc: "Key decision makers at those companies are discovered from public sources" },
            { icon: Mail, title: "Contact Enrichment", desc: "Public business contact information is gathered and verified" },
            { icon: Search, title: "Relevance Scoring", desc: "Each lead is scored for relevance to the specific opportunity" },
            { icon: ArrowRight, title: "Leads Presented", desc: "Verified leads appear alongside the opportunity for immediate action" },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-50 bg-slate-50/50">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <LockedFeature
        featureKey="leadsProvider"
        title="Leads Provider Agent"
        description={
          access === 'LOCKED'
            ? `The Leads Provider Agent discovers decision makers and verifies contacts for your opportunities. It starts with ${upgradePlan}.`
            : `Your ${tier} plan includes ${access === 'FULL' ? 'full' : 'limited'} access to the Leads Provider Agent.`
        }
      >
        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center">
          <Building2 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No leads discovered yet. Leads will appear here when opportunities are analyzed.</p>
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
                The {upgradePlan} plan (${PLANS[upgradePlan].price}/mo) includes {PLANS[upgradePlan].features.leadsProvider.access === 'LIMITED' ? 'limited' : 'full'} Leads Provider Agent access.
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