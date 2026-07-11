import React from "react";
import { Building2, Globe, MapPin, ExternalLink, UserCheck, Bookmark, GitBranch, ArrowRight } from "lucide-react";
import LeadStatusBadge from "./LeadStatusBadge";

export default function CompanyMatchCard({ company, onViewCompany, onFindDecisionMakers, onSave, onAddToCRM }) {
  if (!company || !company.companyId) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-5 text-center">
        <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Company Match Pending</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
          Relevant companies will appear here when identified by the Leads Intelligence Engine.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 truncate">{company.companyName}</p>
            <div className="flex items-center gap-2 flex-wrap mt-0.5">
              {company.industry && <span className="text-xs text-slate-500">{company.industry}</span>}
              {company.companySize && <span className="text-xs text-slate-400">· {company.companySize}</span>}
            </div>
          </div>
        </div>
        {company.relevanceScore != null && (
          <div className="shrink-0 text-right">
            <p className="text-lg font-bold text-slate-900">{company.relevanceScore}</p>
            <p className="text-[10px] text-slate-400">Relevance</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
        {(company.country || company.city) && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {[company.city, company.country].filter(Boolean).join(", ")}
          </span>
        )}
        {company.website && (
          <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 hover:text-blue-700">
            <Globe className="w-3 h-3" /> Website <ExternalLink className="w-2.5 h-2.5" />
          </a>
        )}
      </div>

      {company.relevanceReasons?.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5">Why This Company</p>
          <ul className="space-y-1">
            {company.relevanceReasons.map((reason, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0" /> {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap mb-3">
        {company.verificationStatus && <LeadStatusBadge status={company.verificationStatus} size="xs" />}
        {company.enrichmentStatus && <LeadStatusBadge status={company.enrichmentStatus} size="xs" />}
      </div>

      <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-slate-50">
        <button
          onClick={onFindDecisionMakers}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          <UserCheck className="w-3.5 h-3.5" /> Find Decision Makers
        </button>
        <button
          onClick={onViewCompany}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-slate-300 transition-colors"
        >
          View Company <ArrowRight className="w-3 h-3" />
        </button>
        <button
          onClick={onSave}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-slate-300 transition-colors"
        >
          <Bookmark className="w-3.5 h-3.5" /> Save
        </button>
        <button
          onClick={onAddToCRM}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:border-slate-300 transition-colors"
        >
          <GitBranch className="w-3.5 h-3.5" /> CRM
        </button>
      </div>
    </div>
  );
}