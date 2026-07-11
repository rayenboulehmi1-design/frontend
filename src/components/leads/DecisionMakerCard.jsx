import React from "react";
import { User, Mail, Phone, Globe, MapPin, ShieldCheck, Clock, AlertCircle, Bookmark, GitBranch } from "lucide-react";
import LeadStatusBadge from "./LeadStatusBadge";

export default function DecisionMakerCard({ person, onSave, onAddToCRM, onGenerateOutreach }) {
  if (!person || !person.personId) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-5 text-center">
        <User className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Decision Maker Discovery Pending</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
          Key decision makers will appear here when discovered by the Leads Intelligence Engine.
        </p>
      </div>
    );
  }

  const isVerified = person.verificationStatus === "verified";
  const hasContact = person.publicBusinessEmail || person.publicBusinessPhone || person.publicProfessionalProfileUrl;

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-violet-600" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 truncate">{person.fullName}</p>
            <p className="text-xs text-slate-500">{person.jobTitle}</p>
            {person.companyName && <p className="text-xs text-slate-400">{person.companyName}</p>}
          </div>
        </div>
        {person.relevanceScore != null && (
          <div className="shrink-0 text-right">
            <p className="text-lg font-bold text-slate-900">{person.relevanceScore}</p>
            <p className="text-[10px] text-slate-400">Relevance</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
        {person.department && <span className="text-slate-400">Dept: {person.department}</span>}
        {person.seniority && <span className="text-slate-400">· {person.seniority}</span>}
        {person.country && (
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {person.country}</span>
        )}
      </div>

      {/* Contact information — only rendered from backend-provided fields, never guessed */}
      {hasContact ? (
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 mb-3 space-y-1.5">
          {person.publicBusinessEmail && (
            <div className="flex items-center gap-2 text-xs">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-600">{person.publicBusinessEmail}</span>
              {!isVerified && <LeadStatusBadge status="verification_pending" size="xs" />}
            </div>
          )}
          {person.publicBusinessPhone && (
            <div className="flex items-center gap-2 text-xs">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-600">{person.publicBusinessPhone}</span>
              {!isVerified && <LeadStatusBadge status="verification_pending" size="xs" />}
            </div>
          )}
          {person.publicProfessionalProfileUrl && (
            <div className="flex items-center gap-2 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <a href={person.publicProfessionalProfileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                Professional Profile
              </a>
              {!isVerified && <LeadStatusBadge status="verification_pending" size="xs" />}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-3 mb-3 text-center">
          <AlertCircle className="w-4 h-4 text-slate-300 mx-auto mb-1" />
          <p className="text-xs text-slate-400">No public business contact information available yet.</p>
        </div>
      )}

      {/* Verification status and last verified date */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <LeadStatusBadge status={person.verificationStatus || "discovered"} size="xs" />
        {person.lastVerifiedAt && (
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <Clock className="w-2.5 h-2.5" /> Last verified {new Date(person.lastVerifiedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {person.relevanceReasons?.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5">Why This Person</p>
          <ul className="space-y-1">
            {person.relevanceReasons.map((reason, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                <ShieldCheck className="w-3 h-3 mt-0.5 text-slate-300 shrink-0" /> {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-slate-50">
        {isVerified && hasContact && onGenerateOutreach && (
          <button
            onClick={onGenerateOutreach}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" /> Generate Outreach
          </button>
        )}
        <button onClick={onSave} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-slate-300 transition-colors">
          <Bookmark className="w-3.5 h-3.5" /> Save
        </button>
        <button onClick={onAddToCRM} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-slate-300 transition-colors">
          <GitBranch className="w-3.5 h-3.5" /> CRM
        </button>
      </div>
    </div>
  );
}