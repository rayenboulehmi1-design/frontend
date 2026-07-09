import React from "react";
import { Search, X, Filter } from "lucide-react";
import { CRM_STAGES, PRIORITIES, INTELLIGENCE_STATUS_KEYS, INTELLIGENCE_STATUSES } from "@/lib/crmConfig";

export default function CRMFilters({ filters, onChange }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3.5 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={filters.search || ""}
            onChange={(e) => set("search", e.target.value)}
            placeholder="Search records, companies, people..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>
        {(filters.stage || filters.priority || filters.intelligenceStatus) && (
          <button
            onClick={() => onChange({ search: filters.search })}
            className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-500 hover:border-slate-300 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        <select value={filters.stage || ""} onChange={(e) => set("stage", e.target.value)} className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 focus:outline-none focus:border-blue-400 bg-white">
          <option value="">All Stages</option>
          {CRM_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.priority || ""} onChange={(e) => set("priority", e.target.value)} className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 focus:outline-none focus:border-blue-400 bg-white capitalize">
          <option value="">All Priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={filters.intelligenceStatus || ""} onChange={(e) => set("intelligenceStatus", e.target.value)} className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 focus:outline-none focus:border-blue-400 bg-white">
          <option value="">All Intel Statuses</option>
          {INTELLIGENCE_STATUS_KEYS.map((k) => <option key={k} value={k}>{INTELLIGENCE_STATUSES[k].label}</option>)}
        </select>
      </div>
    </div>
  );
}