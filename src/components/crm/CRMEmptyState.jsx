import React from "react";
import { GitBranch, Database, AlertCircle, Lock, Search } from "lucide-react";

const VARIANTS = {
  empty: { icon: GitBranch, title: "Your CRM pipeline is empty", desc: "Add opportunities or verified leads to your CRM to start tracking them through to outcome." },
  noResults: { icon: Search, title: "No matching records", desc: "Try adjusting your filters to see more CRM records." },
  backend: { icon: Database, title: "CRM backend activation pending", desc: "The Replit backend will provide secure record persistence, workspace authorization, and audit logging. Records you create now are stored locally in your browser." },
  notFound: { icon: AlertCircle, title: "CRM record not found", desc: "This record may have been deleted, or the CRM backend has not synced it yet." },
  locked: { icon: Lock, title: "Opportunity CRM is locked", desc: "Upgrade your plan to access the intelligence-native CRM pipeline." },
};

export default function CRMEmptyState({ variant = "empty", action }) {
  const v = VARIANTS[variant] || VARIANTS.empty;
  const Icon = v.icon;
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-8 sm:p-12 text-center">
      <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mx-auto mb-4 shadow-sm">
        <Icon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
      </div>
      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{v.title}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto leading-relaxed">{v.desc}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}