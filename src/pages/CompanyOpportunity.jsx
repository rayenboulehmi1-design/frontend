import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Building2, Globe, MapPin, Briefcase, ShieldCheck,
  Target, TrendingUp, FileSearch, AlertCircle, Lightbulb, Users,
  Radar, ExternalLink, Sparkles, Clock, Database, Lock,
  RefreshCw, Tag, Layers,
} from "lucide-react";
import { getOpportunityDetail, composeCompanyIntelligence } from "@/lib/scoutyClient";
import { useDemoLink } from "@/lib/demoMode";
import StateWrapper from "@/components/common/StateWrapper";
import { Skeleton, SkeletonSection } from "@/components/common/Skeleton";
import ScoreCard from "@/components/common/ScoreCard";
import ConfidenceBadge from "@/components/dashboard/ConfidenceBadge";

function Section({ title, icon: Icon, children, action }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-slate-400" />}
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value, icon: Icon }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 py-1.5">
      {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}:</span>
      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{value}</span>
    </div>
  );
}

function CompanyEntityCard({ entity }) {
  const confidence = entity.roleConfidence != null ? Math.round(entity.roleConfidence * 100) : null;
  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{entity.name}</p>
          {entity.role && (
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wide">
              {entity.role}
            </span>
          )}
        </div>
        {confidence != null && <ConfidenceBadge score={confidence} size="sm" />}
      </div>
      {entity.evidenceSnippet && (
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mt-2">{entity.evidenceSnippet}</p>
      )}
    </div>
  );
}

export default function CompanyOpportunity() {
  const { id } = useParams();
  const demoLink = useDemoLink();

  const [opp, setOpp] = useState(null);
  const [oppStatus, setOppStatus] = useState('loading');

  const loadData = useCallback(async () => {
    setOppStatus('loading');
    const result = await getOpportunityDetail(id);
    setOpp(result.data);
    setOppStatus(result.status);
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (oppStatus === 'loading') {
    return (
      <div className="p-5 md:p-8 lg:p-10 max-w-5xl mx-auto space-y-6">
        <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <SkeletonSection />
        <div className="grid sm:grid-cols-3 gap-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <SkeletonSection />
        <SkeletonSection />
      </div>
    );
  }

  if (oppStatus === 'notfound' || oppStatus === 'error' || !opp) {
    return (
      <div className="p-5 md:p-8 max-w-2xl mx-auto">
        <Link to={demoLink("/dashboard")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <StateWrapper
          status={oppStatus}
          onRetry={loadData}
          emptyTitle="Opportunity not found"
          emptyMessage="This opportunity may have been removed or is no longer available."
          errorTitle="Couldn't load opportunity"
        />
      </div>
    );
  }

  const intel = composeCompanyIntelligence(opp);
  const detectedAt = intel.detectedAt || intel.createdAt;

  return (
    <div className="p-5 md:p-8 lg:p-10 max-w-5xl mx-auto space-y-8">
      <Link to={demoLink("/dashboard")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Company Profile Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-950 dark:to-violet-950 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {intel.stage && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wide">
                    {intel.stage.replace(/_/g, ' ')}
                  </span>
                )}
                {detectedAt && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Detected {new Date(typeof detectedAt === 'number' ? detectedAt : detectedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{intel.companyName}</h1>
              {intel.summary && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-3">{intel.summary}</p>}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                <InfoRow icon={Briefcase} label="Category" value={intel.industry} />
                <InfoRow icon={MapPin} label="Country" value={intel.country} />
                <InfoRow icon={Layers} label="Type" value={intel.opportunityType} />
                {intel.sourceUrl && (
                  <a href={intel.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    <Globe className="w-3.5 h-3.5" /> Source <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scores — only render cards for scores that exist */}
      <div className="grid sm:grid-cols-3 gap-4">
        <ScoreCard label="Confidence" score={intel.confidenceScore} icon={ShieldCheck} description="Intelligence Engine assessment" />
        <ScoreCard label="Match" score={intel.matchScore} icon={Target} description="Mission match quality" />
        <ScoreCard label="Actionability" score={intel.actionabilityScore} icon={TrendingUp} description="Business attractiveness" />
      </div>

      {/* Next Best Action — from engine */}
      {intel.nextBestAction && (
        <Section title="Next Best Action" icon={Sparkles}>
          <div className="rounded-2xl border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 p-5">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{intel.nextBestAction}</p>
          </div>
        </Section>
      )}

      {/* Commercial Signals — from engine tags */}
      {intel.signals.length > 0 && (
        <Section title="Commercial Signals" icon={Radar}>
          <div className="flex flex-wrap gap-2">
            {intel.signals.map((signal, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                {typeof signal === 'string' ? signal : signal.name || signal.label || JSON.stringify(signal)}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Company Entities — real data from embedded `companies` array */}
      <Section title="Company Intelligence" icon={Building2}>
        {intel.companies.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {intel.companies.map((entity, i) => (
              <CompanyEntityCard key={i} entity={entity} />
            ))}
          </div>
        ) : (
          <StateWrapper
            status="empty"
            emptyTitle="No company entities identified"
            emptyMessage="The Intelligence Engine will surface buyer and supplier entities as it analyzes this opportunity."
          />
        )}
      </Section>

      {/* Supporting Source — from engine sourceUrl */}
      {intel.sourceUrl && (
        <Section title="Supporting Source" icon={Database}>
          <a
            href={intel.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 hover:border-slate-200 dark:hover:border-slate-700 transition-colors max-w-md"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{intel.sourceType || "Source"}</p>
              <p className="text-[10px] text-slate-400 truncate">{intel.sourceUrl}</p>
            </div>
          </a>
        </Section>
      )}

      {/* ─── Capabilities NOT yet available on Replit ─── */}

      {/* Executive AI Brief — unsupported */}
      <Section title="Executive AI Brief" icon={Sparkles}>
        <StateWrapper
          status="unsupported"
          unsupportedTitle="Executive AI Brief not available yet"
          unsupportedMessage="This capability requires a backend analysis endpoint that is not yet deployed on the Intelligence Engine."
        />
      </Section>

      {/* Evidence Timeline — unsupported */}
      <Section title="Evidence Timeline" icon={FileSearch}>
        <StateWrapper
          status="unsupported"
          unsupportedTitle="Evidence timeline not available yet"
          unsupportedMessage="The Intelligence Engine will populate a categorized evidence timeline once the evidence endpoint is deployed."
        />
      </Section>

      {/* Buying Committee — unsupported */}
      <Section title="Buying Committee" icon={Users}>
        <StateWrapper
          status="unsupported"
          unsupportedTitle="Decision-maker discovery not available yet"
          unsupportedMessage="The Intelligence Engine will surface buying committee members once the person discovery pipeline is deployed."
        />
      </Section>

      {/* Person Discovery Summary */}
      <Section title="Person Discovery Pipeline" icon={Radar}>
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Person Discovery Pipeline</p>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            The Intelligence Engine identifies buying committee members through public records,
            professional networks, and corporate filings. Discovered persons are verified before
            appearing in the Buying Committee section above.
          </p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center">
              <p className="text-lg font-bold text-slate-300 dark:text-slate-700">—</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Discovered</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-300 dark:text-slate-700">—</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Verified</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-300 dark:text-slate-700">—</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Enriched</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Refresh */}
      <div className="flex justify-center pt-4">
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Intelligence
        </button>
      </div>
    </div>
  );
}