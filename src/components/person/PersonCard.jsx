import React, { useState } from "react";
import {
  ChevronDown, Mail, Phone, ShieldCheck, Shield, ShieldAlert,
  ShieldX, Star, Target, FileSearch, Lock, ExternalLink, UserCheck, Clock,
} from "lucide-react";

const IDENTITY_STATUS_CONFIG = {
  VERIFIED: {
    label: "Verified",
    icon: ShieldCheck,
    cls: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900",
  },
  PROBABLE: {
    label: "Probable",
    icon: Shield,
    cls: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900",
  },
  UNCERTAIN: {
    label: "Uncertain",
    icon: ShieldAlert,
    cls: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
  },
  REJECTED: {
    label: "Rejected",
    icon: ShieldX,
    cls: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-900",
  },
  READY_FOR_ENRICHMENT: {
    label: "Ready for Enrichment",
    icon: UserCheck,
    cls: "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950 dark:text-violet-400 dark:border-violet-900",
  },
  READY_FOR_OUTREACH: {
    label: "Ready for Outreach",
    icon: Target,
    cls: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900",
  },
  NEEDS_REVIEW: {
    label: "Needs Review",
    icon: Clock,
    cls: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
  },
};

function ScorePill({ label, score, icon: Icon }) {
  if (score == null) return null;
  const color =
    score >= 75 ? "text-emerald-600 dark:text-emerald-400"
    : score >= 50 ? "text-amber-600 dark:text-amber-400"
    : "text-rose-600 dark:text-rose-400";
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="w-3 h-3 text-slate-400" />
      <span className="text-[10px] text-slate-500 dark:text-slate-400">{label}</span>
      <span className={`text-xs font-bold ${color}`}>{Math.round(score)}%</span>
    </div>
  );
}

export default function PersonCard({ person }) {
  const [expanded, setExpanded] = useState(false);

  const name = person.name || person.fullName || "Unknown";
  const title = person.title || person.currentTitle || "Title not available";
  const company = person.company || person.companyName || "";
  const evidence = person.evidence || person.evidenceItems || [];
  const identityStatus = person.identityStatus || person.verificationStatus;
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const leadReadiness = person.leadReadiness || person.leadReadinessScore;

  const statusConfig = IDENTITY_STATUS_CONFIG[identityStatus];
  const StatusIcon = statusConfig?.icon;

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-700 transition-all">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 dark:from-blue-950 dark:to-violet-950 flex items-center justify-center shrink-0 overflow-hidden">
          {person.photoUrl ? (
            <img src={person.photoUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{initials}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{title}</p>
          {company && <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{company}</p>}
        </div>
        {statusConfig && StatusIcon && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide shrink-0 ${statusConfig.cls}`}>
            <StatusIcon className="w-3 h-3" /> {statusConfig.label}
          </div>
        )}
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <ScorePill label="Role Relevance" score={person.roleRelevanceScore} icon={Target} />
        <ScorePill label="Overall" score={person.overallScore} icon={Star} />
        {leadReadiness != null && <ScorePill label="Lead Readiness" score={leadReadiness} icon={ShieldCheck} />}
        <div className="flex items-center gap-1.5">
          <FileSearch className="w-3 h-3 text-slate-400" />
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Evidence</span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{evidence.length}</span>
        </div>
      </div>

      {/* Contact info — only shown if returned by backend */}
      {(person.email || person.phone) && (
        <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-800 flex flex-wrap gap-3">
          {person.email && (
            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Mail className="w-3 h-3" /> {person.email}
            </span>
          )}
          {person.phone && (
            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Phone className="w-3 h-3" /> {person.phone}
            </span>
          )}
        </div>
      )}

      {/* No contact info state */}
      {!person.email && !person.phone && (
        <p className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500">
          No verified contact information has been discovered yet.
        </p>
      )}

      {/* Expandable evidence */}
      {evidence.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
            {expanded ? "Hide" : "Show"} Evidence ({evidence.length})
          </button>
          {expanded && (
            <div className="mt-2 space-y-2">
              {evidence.map((ev, i) => (
                <div key={i} className="rounded-lg bg-slate-50 dark:bg-slate-800 p-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                      {ev.type || ev.evidenceType || "Evidence"}
                    </p>
                    {ev.sourceUrl && (
                      <a href={ev.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 shrink-0">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  {ev.snippet && <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{ev.snippet}</p>}
                  {ev.confidence != null && (
                    <span className="inline-block mt-1 text-[10px] text-slate-400">{Math.round(ev.confidence)}% confidence</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Future enrichment placeholder */}
      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-300 dark:text-slate-600">
        <Lock className="w-2.5 h-2.5" /> Contact enrichment coming soon
      </div>
    </div>
  );
}