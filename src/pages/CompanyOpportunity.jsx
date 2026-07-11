import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Building2, Globe, MapPin, Briefcase, ShieldCheck,
  Target, TrendingUp, FileSearch, AlertCircle, Lightbulb, Users,
  Radar, ExternalLink, Sparkles, Clock, Database, Lock, CheckCircle2,
  XCircle, RefreshCw,
} from "lucide-react";
import { getOpportunityDetail, getCompanyDetail, getDecisionMakers, getEvidence, getExecutiveBrief } from "@/lib/scoutyClient";
import { useDemoLink } from "@/lib/demoMode";
import StateWrapper from "@/components/common/StateWrapper";
import { Skeleton, SkeletonSection } from "@/components/common/Skeleton";
import ProspectStatusBadge from "@/components/common/ProspectStatusBadge";
import ScoreCard from "@/components/common/ScoreCard";
import PersonCard from "@/components/person/PersonCard";
import EvidenceTimeline from "@/components/evidence/EvidenceTimeline";

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

function QualityGateDisplay({ qualityGate }) {
  if (!qualityGate) return null;
  const passed = qualityGate.status === 'PASSED' || qualityGate.passed === true;
  const Icon = passed ? CheckCircle2 : XCircle;

  return (
    <div className={`rounded-xl border p-4 ${passed ? "border-emerald-100 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20" : "border-amber-100 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20"}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${passed ? "text-emerald-500" : "text-amber-500"}`} />
        <span className={`text-sm font-bold ${passed ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
          {qualityGate.label || qualityGate.status || (passed ? "Quality Gate Passed" : "Quality Gate Review Needed")}
        </span>
      </div>
      {qualityGate.reason && <p className="text-xs text-slate-500 dark:text-slate-400">{qualityGate.reason}</p>}
      {qualityGate.criteria && Array.isArray(qualityGate.criteria) && (
        <ul className="mt-2 space-y-1">
          {qualityGate.criteria.map((c, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              {c.passed ? <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" /> : <XCircle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />}
              {c.label || c.name || c.description || JSON.stringify(c)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CompanyOpportunity() {
  const { id } = useParams();
  const demoLink = useDemoLink();

  const [opp, setOpp] = useState(null);
  const [oppStatus, setOppStatus] = useState('loading');
  const [company, setCompany] = useState(null);
  const [people, setPeople] = useState([]);
  const [peopleStatus, setPeopleStatus] = useState('loading');
  const [evidence, setEvidence] = useState([]);
  const [evidenceStatus, setEvidenceStatus] = useState('loading');
  const [brief, setBrief] = useState(null);
  const [briefStatus, setBriefStatus] = useState('loading');

  const loadAll = useCallback(async () => {
    setOppStatus('loading');
    setCompany(null);
    setPeopleStatus('loading');
    setEvidenceStatus('loading');
    setBriefStatus('loading');

    const oppResult = await getOpportunityDetail(id);
    setOpp(oppResult.data);
    setOppStatus(oppResult.status);

    if (oppResult.status !== 'success' || !oppResult.data) return;

    const [companyResult, peopleResult, evidenceResult, briefResult] = await Promise.all([
      getCompanyDetail(id),
      getDecisionMakers(id),
      getEvidence(id),
      getExecutiveBrief(id),
    ]);

    setCompany(companyResult.data);
    setPeople(peopleResult.data?.people || peopleResult.data?.decisionMakers || (Array.isArray(peopleResult.data) ? peopleResult.data : []));
    setPeopleStatus(peopleResult.status === 'success' && (peopleResult.data?.people || peopleResult.data?.decisionMakers || (Array.isArray(peopleResult.data) ? peopleResult.data : [])).length > 0 ? 'success' : 'empty');

    const evData = evidenceResult.data?.evidence || (Array.isArray(evidenceResult.data) ? evidenceResult.data : []);
    setEvidence(evData);
    setEvidenceStatus(evidenceResult.status === 'success' && evData.length > 0 ? 'success' : 'empty');

    setBrief(briefResult.data);
    setBriefStatus(briefResult.status === 'success' && briefResult.data ? 'success' : 'empty');
  }, [id]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

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
          onRetry={loadAll}
          emptyTitle="Opportunity not found"
          emptyMessage="This opportunity may have been removed or is no longer available."
          errorTitle="Couldn't load opportunity"
        />
      </div>
    );
  }

  const companyName = opp.company || company?.name || opp.title || "Company";
  const website = company?.website || opp.website || company?.officialWebsite;
  const industry = company?.industry || opp.industry || opp.category;
  const country = opp.country || company?.country;
  const region = company?.region || opp.region;
  const confidence = opp.confidenceScore ?? opp.confidence;
  const buyerIntentScore = opp.buyerIntentScore ?? company?.buyerIntentScore;
  const opportunityScore = opp.opportunityScore ?? opp.matchScore ?? opp.actionabilityScore;
  const qualityGate = opp.qualityGate || company?.qualityGate;
  const prospectStatus = opp.prospectStatus || company?.prospectStatus;
  const topReasons = opp.topReasons || company?.topReasons || [];
  const missingEvidence = opp.missingEvidence || company?.missingEvidence || [];
  const commercialSignals = opp.signals || opp.commercialSignals || company?.commercialSignals || [];
  const summary = opp.summary || opp.explanation || company?.description;
  const detectedAt = opp.detectedAt || opp.createdAt;

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
                {prospectStatus && <ProspectStatusBadge status={prospectStatus} />}
                {detectedAt && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Detected {new Date(detectedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{companyName}</h1>
              {summary && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-3">{summary}</p>}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                <InfoRow icon={Briefcase} label="Industry" value={industry} />
                <InfoRow icon={MapPin} label="Country" value={country} />
                <InfoRow icon={MapPin} label="Region" value={region} />
                {website && (
                  <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    <Globe className="w-3.5 h-3.5" /> Visit website <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scores */}
      <div className="grid sm:grid-cols-3 gap-4">
        <ScoreCard label="Confidence" score={confidence} icon={ShieldCheck} description="Intelligence Engine assessment" />
        <ScoreCard label="Buyer Intent" score={buyerIntentScore} icon={Target} description="Purchase readiness signal" />
        <ScoreCard label="Opportunity Score" score={opportunityScore} icon={TrendingUp} description="Business attractiveness" />
      </div>

      {/* Quality Gate */}
      {qualityGate && (
        <Section title="Quality Gate" icon={ShieldCheck}>
          <QualityGateDisplay qualityGate={qualityGate} />
        </Section>
      )}

      {/* Executive AI Brief */}
      <Section title="Executive AI Brief" icon={Sparkles}>
        <StateWrapper
          status={briefStatus}
          onRetry={loadAll}
          skeletonVariant="section"
          skeletonCount={1}
          emptyTitle="Brief not available yet"
          emptyMessage="The AI executive brief will be generated when the Intelligence Engine completes analysis."
          errorTitle="Couldn't load brief"
        >
          {briefStatus === 'success' && brief ? (
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
              {brief.summary && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Summary</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{brief.summary}</p>
                </div>
              )}
              {brief.whyItMatters && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Why It Matters</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{brief.whyItMatters}</p>
                </div>
              )}
              {brief.commercialOpportunity && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Commercial Opportunity</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{brief.commercialOpportunity}</p>
                </div>
              )}
              {brief.suggestedAction && (
                <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-blue-500 mb-1">Suggested Action</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{brief.suggestedAction}</p>
                </div>
              )}
              {brief.confidence != null && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-400">Brief confidence: {Math.round(brief.confidence)}%</span>
                </div>
              )}
            </div>
          ) : null}
        </StateWrapper>
      </Section>

      {/* Top Reasons */}
      {topReasons.length > 0 && (
        <Section title="Top Reasons" icon={Lightbulb}>
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <ul className="space-y-2.5">
              {topReasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-300">{typeof reason === 'string' ? reason : reason.text || reason.description || JSON.stringify(reason)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {/* Missing Evidence */}
      {missingEvidence.length > 0 && (
        <Section title="Missing Evidence" icon={AlertCircle}>
          <div className="rounded-2xl border border-amber-100 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 p-5">
            <ul className="space-y-2">
              {missingEvidence.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                  {typeof item === 'string' ? item : item.description || item.label || JSON.stringify(item)}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {/* Commercial Signals */}
      {commercialSignals.length > 0 && (
        <Section title="Commercial Signals" icon={Radar}>
          <div className="flex flex-wrap gap-2">
            {commercialSignals.map((signal, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                {typeof signal === 'string' ? signal : signal.name || signal.label || JSON.stringify(signal)}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Evidence Timeline */}
      <Section title="Evidence Timeline" icon={FileSearch}>
        <StateWrapper
          status={evidenceStatus}
          onRetry={loadAll}
          emptyTitle="No evidence available yet"
          emptyMessage="The Intelligence Engine will populate evidence as it discovers and verifies sources."
          errorTitle="Couldn't load evidence"
        >
          {evidenceStatus === 'success' && evidence.length > 0 ? (
            <EvidenceTimeline evidence={evidence} />
          ) : null}
        </StateWrapper>
      </Section>

      {/* Supporting Sources */}
      {evidence.length > 0 && (
        <Section title="Supporting Sources" icon={Database}>
          <div className="grid sm:grid-cols-2 gap-3">
            {evidence.filter((e) => e.sourceUrl || e.url).slice(0, 6).map((item, i) => (
              <a
                key={i}
                href={item.sourceUrl || item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{item.source || item.type || "Source"}</p>
                  <p className="text-[10px] text-slate-400 truncate">{item.sourceUrl || item.url}</p>
                </div>
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* Buying Committee / Decision Makers */}
      <Section title="Buying Committee" icon={Users}>
        <StateWrapper
          status={peopleStatus}
          onRetry={loadAll}
          skeletonCount={2}
          emptyTitle="No decision makers discovered yet"
          emptyMessage="The Intelligence Engine will surface buying committee members as it identifies and verifies contacts."
          errorTitle="Couldn't load decision makers"
        >
          {peopleStatus === 'success' && people.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {people.map((person, i) => (
                <PersonCard key={person.id || i} person={person} />
              ))}
            </div>
          ) : null}
        </StateWrapper>
      </Section>

      {/* Person Discovery Summary */}
      <Section title="Person Discovery Summary" icon={Radar}>
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
              <p className="text-lg font-bold text-slate-400 dark:text-slate-600">{people.length}</p>
              <p className="text-[10px] text-slate-400">Discovered</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-300 dark:text-slate-700">—</p>
              <p className="text-[10px] text-slate-400">Verified</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-300 dark:text-slate-700">—</p>
              <p className="text-[10px] text-slate-400">Enriched</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Refresh */}
      <div className="flex justify-center pt-4">
        <button
          onClick={loadAll}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Intelligence
        </button>
      </div>
    </div>
  );
}