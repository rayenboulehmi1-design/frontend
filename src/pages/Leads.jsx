import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users, ArrowLeft, Lock, ArrowRight, Building2, Search, Mail,
  ShieldCheck, GitBranch, Bookmark, Radar, Database,
} from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import { useEntitlement } from "@/hooks/useEntitlement";
import LockedFeature from "@/components/entitlement/LockedFeature";
import UsageMeter from "@/components/entitlement/UsageMeter";
import LeadsFilterBar from "@/components/leads/LeadsFilterBar";
import LeadStatusBadge from "@/components/leads/LeadStatusBadge";
import { PLANS } from "@/lib/plans";

function LeadsEmptyState({ icon: Icon, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
      <Icon className="w-10 h-10 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">{description}</p>
    </div>
  );
}

function StatusSummaryCard({ icon: Icon, title, statuses }) {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="space-y-2">
        {statuses.map((s) => (
          <div key={s.status} className="flex items-center justify-between">
            <LeadStatusBadge status={s.status} size="xs" />
            <span className="text-xs font-medium text-slate-400">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Leads() {
  const demoLink = useDemoLink();
  const { tier, checkAccess } = useEntitlement();
  const access = checkAccess("leadsProvider");
  const [filters, setFilters] = useState({ search: "" });

  // Pro plan — no leads access, show locked state with upgrade path
  if (access === "LOCKED") {
    const upgradePlan = tier === "Pro" ? "Pro+" : "Agency";
    return (
      <div className="p-5 sm:p-8 max-w-5xl mx-auto">
        <Link to={demoLink("/dashboard")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Leads Provider Agent</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-blue-100 dark:border-blue-950 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/30 dark:to-violet-950/30 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Leads Provider Agent requires {upgradePlan}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                The Leads Provider Agent starts from a verified ScoutyGo opportunity and helps identify
                relevant companies and decision makers. It discovers public business contacts, verifies them,
                scores lead relevance, and assists with AI-powered outreach.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Link to={demoLink("/account-overview")} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                  Upgrade to {upgradePlan} <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-slate-400">${PLANS[upgradePlan]?.price}/mo</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Building2, title: "Relevant Companies", desc: "Companies connected to verified opportunities" },
            { icon: Users, title: "Decision Makers", desc: "Key people at matched companies" },
            { icon: Mail, title: "Contact Enrichment", desc: "Public business contacts gathered and verified" },
            { icon: Search, title: "Relevance Scoring", desc: "Each lead scored for opportunity fit" },
            { icon: ShieldCheck, title: "Verification", desc: "Contacts verified before display" },
            { icon: GitBranch, title: "CRM Integration", desc: "Track leads through your pipeline" },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-slate-50 dark:border-slate-800/50 bg-white dark:bg-slate-900">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{step.title}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Pro+ or Agency — full leads experience
  return (
    <div className="p-5 sm:p-8 max-w-5xl mx-auto">
      <Link to={demoLink("/dashboard")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Leads Provider Agent</h1>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          access === "FULL" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
        }`}>
          {access === "FULL" ? "Full Access" : "Limited"} · {tier}
        </span>
      </div>

      {/* Usage meter */}
      <div className="mb-6">
        <UsageMeter label="Leads Discovery" used={0} limit={null} icon={Users} />
        <p className="text-[10px] text-slate-400 mt-1 ml-1">
          {access === "FULL"
            ? "Fair-use limits apply. Usage counters will be displayed when the Leads Intelligence Engine is connected."
            : "Limited leads access. Usage counters will be displayed when the Leads Intelligence Engine is connected."}
        </p>
      </div>

      {/* Search and filters */}
      <LeadsFilterBar filters={filters} onChange={setFilters} />

      {/* Status summary */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <StatusSummaryCard icon={Mail} title="Enrichment" statuses={[
          { status: "enriched", count: 0 },
          { status: "enrichment_pending", count: 0 },
        ]} />
        <StatusSummaryCard icon={ShieldCheck} title="Verification" statuses={[
          { status: "verified", count: 0 },
          { status: "verification_pending", count: 0 },
        ]} />
        <StatusSummaryCard icon={GitBranch} title="CRM Status" statuses={[
          { status: "discovered", count: 0 },
          { status: "stale", count: 0 },
        ]} />
      </div>

      {/* Recent discoveries */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Recent Lead Discoveries</h2>
        <LeadsEmptyState
          icon={Building2}
          title="No leads discovered yet"
          description="Leads will appear here when opportunities are analyzed by the Leads Intelligence Engine. Start from any verified opportunity to find relevant companies and decision makers."
        />
      </motion.div>

      {/* Saved leads */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Saved Leads</h2>
        <LeadsEmptyState
          icon={Bookmark}
          title="No saved leads"
          description="Leads you save will appear here for quick access."
        />
      </motion.div>

      {/* Leads by opportunity */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Leads by Opportunity</h2>
        <LeadsEmptyState
          icon={Database}
          title="No opportunity-linked leads yet"
          description="Leads grouped by their source opportunity will appear here. Visit any opportunity detail page to start the Leads Provider Agent workflow."
        />
      </motion.div>

      {/* Leads by AI Mission */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Leads by AI Mission</h2>
        <LeadsEmptyState
          icon={Radar}
          title="No mission-linked leads yet"
          description="Leads generated from opportunities matched to your AI Missions will appear here. Mission-matched opportunities feed directly into the leads pipeline."
        />
      </motion.div>
    </div>
  );
}