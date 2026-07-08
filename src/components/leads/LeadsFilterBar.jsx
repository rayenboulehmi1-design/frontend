import React from "react";
import { Search, ChevronDown } from "lucide-react";

const FILTER_CONFIG = [
  { key: "country", label: "Country", options: ["All countries"] },
  { key: "industry", label: "Industry", options: ["All industries", "Real Estate", "Investment", "Business", "Construction", "Logistics", "Hospitality"] },
  { key: "opportunity", label: "Opportunity", options: ["All opportunities"] },
  { key: "mission", label: "AI Mission", options: ["All missions"] },
  { key: "role", label: "Decision-Maker Role", options: ["All roles", "CEO", "CFO", "Director", "Manager", "Partner"] },
  { key: "verification", label: "Verification", options: ["All statuses", "Verified", "Verification Pending", "Unverified"] },
  { key: "enrichment", label: "Enrichment", options: ["All statuses", "Enriched", "Enrichment Pending"] },
  { key: "crm", label: "CRM Status", options: ["All statuses", "Not Added", "In Pipeline", "Contacted", "Won"] },
];

export default function LeadsFilterBar({ filters, onChange }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 mb-6">
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search leads by company, decision maker, or opportunity..."
          value={filters.search || ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-300 transition-colors"
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {FILTER_CONFIG.map((opt) => (
          <div key={opt.key} className="relative">
            <select
              value={filters[opt.key] || ""}
              onChange={(e) => onChange({ ...filters, [opt.key]: e.target.value })}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 bg-white hover:border-slate-300 focus:outline-none focus:border-blue-300 cursor-pointer transition-colors"
            >
              <option value="">{opt.label}</option>
              {opt.options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}