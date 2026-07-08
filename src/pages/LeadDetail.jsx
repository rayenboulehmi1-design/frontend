import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Users, Building2, User, Lightbulb, ShieldCheck, Mail,
  FileSearch, Sparkles, StickyNote, GitBranch, Target, Clock,
} from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import EnginePlaceholder from "@/components/opportunity/EnginePlaceholder";
import LeadRelevanceScore from "@/components/leads/LeadRelevanceScore";
import LeadStatusBadge from "@/components/leads/LeadStatusBadge";
import AIOutreachAssistant from "@/components/leads/AIOutreachAssistant";

function DetailSection({ number, title, icon: Icon, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 z-10">
          {number}
        </div>
        <div className="w-px flex-1 bg-gradient-to-b from-slate-200 to-slate-100 min-h-[1.5rem] my-1" />
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">{title}</h3>
        </div>
        {children}
      </div>
    </motion.div>
  );
}

export default function LeadDetail() {
  const { leadId } = useParams();
  const demoLink = useDemoLink();

  // No lead data is available yet — the Leads Intelligence Engine (Replit backend)
  // will provide lead data. The frontend architecture is ready to render it.
  const lead = null;

  return (
    <div className="p-5 sm:p-8 max-w-4xl mx-auto">
      <Link to={demoLink("/leads")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Leads
      </Link>

      <div className="flex items-center gap-3 mb-3">
        <Users className="w-5 h-5 text-blue-600" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Lead Detail</h1>
      </div>
      <p className="text-sm text-slate-400 mb-6">
        Full lead context, verification, and outreach — powered by verified data from the Leads Intelligence Engine.
      </p>

      {/* Engine status banner */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">Lead data will appear here when the Leads Intelligence Engine is connected.</p>
          <p className="text-xs text-slate-400 mt-0.5">Lead ID: {leadId}</p>
        </div>
      </div>

      <div>
        <DetailSection number={1} title="Lead Overview" icon={Target}>
          <EnginePlaceholder message="Lead overview — including company name, decision maker, and relevance summary — will be provided by the Leads Intelligence Engine." />
        </DetailSection>

        <DetailSection number={2} title="Related Opportunity" icon={Lightbulb}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <p className="text-xs text-slate-400 mb-2">The verified opportunity that produced this lead recommendation:</p>
            <EnginePlaceholder message="The source opportunity will be linked here when lead data is available." />
          </div>
        </DetailSection>

        <DetailSection number={3} title="Company Context" icon={Building2}>
          <EnginePlaceholder message="Company context — industry, size, location, website, and relevance reasons — will be provided by the Leads Intelligence Engine." />
        </DetailSection>

        <DetailSection number={4} title="Decision Maker" icon={User}>
          <EnginePlaceholder message="Decision maker details — name, title, department, seniority, and relevance — will be discovered and verified by the Leads Intelligence Engine." />
        </DetailSection>

        <DetailSection number={5} title="Why This Lead Is Relevant" icon={Lightbulb}>
          <EnginePlaceholder message="AI-generated relevance explanation will appear here once verified lead data is available. The AI explains relevance from verified data only — it never invents facts." />
        </DetailSection>

        <DetailSection number={6} title="Verification Status" icon={ShieldCheck}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 flex items-center gap-3 flex-wrap">
            <LeadStatusBadge status="discovered" />
            <LeadStatusBadge status="enrichment_pending" />
            <LeadStatusBadge status="verification_pending" />
            <p className="text-xs text-slate-400 w-full mt-2">
              Verification status and last-verified date will be shown here when the engine processes this lead.
            </p>
          </div>
        </DetailSection>

        <DetailSection number={7} title="Public Business Contact Information" icon={Mail}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <p className="text-xs text-slate-400 mb-3">
              Contact information is only displayed after verification. The frontend never guesses contact details.
            </p>
            <EnginePlaceholder message="Public business email, phone, and professional profile URL will appear here after enrichment and verification." />
          </div>
        </DetailSection>

        <DetailSection number={8} title="Related Evidence" icon={FileSearch}>
          <EnginePlaceholder message="Source evidence supporting this lead match will be provided by the Leads Intelligence Engine." />
        </DetailSection>

        <DetailSection number={9} title="AI Outreach Assistance" icon={Sparkles}>
          <AIOutreachAssistant lead={lead} />
        </DetailSection>

        <DetailSection number={10} title="Notes" icon={StickyNote}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <textarea
              disabled
              placeholder="Notes will be saved here when the Leads Intelligence Engine is connected..."
              className="w-full min-h-[80px] p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-sm text-slate-400 resize-none"
            />
          </div>
        </DetailSection>

        <DetailSection number={11} title="Add to CRM" icon={GitBranch}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <p className="text-xs text-slate-400 mb-3">
              CRM integration point: Opportunity → Company → Decision Maker → Lead → CRM Record
            </p>
            <button disabled className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed">
              <GitBranch className="w-3.5 h-3.5" /> Add to CRM
            </button>
          </div>
        </DetailSection>

        <DetailSection number={12} title="Track Outcome" icon={Target}>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <p className="text-xs text-slate-400 mb-3">
              Track the outcome of this lead — from first contact through to won/lost.
            </p>
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {["Discovered", "Contacted", "Meeting", "Negotiation", "Won", "Lost"].map((stage, i) => (
                <React.Fragment key={stage}>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-medium text-slate-400 whitespace-nowrap">{stage}</span>
                  {i < 5 && <span className="text-slate-200 text-xs">→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </DetailSection>
      </div>
    </div>
  );
}