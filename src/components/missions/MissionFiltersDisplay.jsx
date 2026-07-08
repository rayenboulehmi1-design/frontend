import React from "react";
import { MapPin, Tag, Target, Building2, Type, Filter, Ban } from "lucide-react";

function FilterRow({ icon: Icon, label, values }) {
  if (!values || (Array.isArray(values) ? values.length === 0 : !values)) return null;
  const display = Array.isArray(values) ? values : [values];
  return (
    <div className="flex items-start gap-2 py-2 border-b border-slate-50 last:border-0">
      <Icon className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {display.map((v, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-xs font-medium">
              {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MissionFiltersDisplay({ mission }) {
  const hasFilters =
    mission.industry ||
    (mission.countries && mission.countries.length > 0) ||
    (mission.regions && mission.regions.length > 0) ||
    (mission.categories && mission.categories.length > 0) ||
    (mission.keywords && mission.keywords.length > 0) ||
    (mission.excluded_keywords && mission.excluded_keywords.length > 0) ||
    (mission.company_names && mission.company_names.length > 0) ||
    (mission.opportunity_types && mission.opportunity_types.length > 0) ||
    mission.min_confidence > 0;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-bold text-slate-900">Mission Filters</h3>
      </div>
      {hasFilters ? (
        <div className="rounded-xl border border-slate-100 bg-white px-4 py-1">
          <FilterRow icon={Building2} label="Industry" values={mission.industry} />
          <FilterRow icon={MapPin} label="Countries" values={mission.countries} />
          <FilterRow icon={MapPin} label="Regions" values={mission.regions} />
          <FilterRow icon={Tag} label="Categories" values={mission.categories} />
          <FilterRow icon={Target} label="Keywords" values={mission.keywords} />
          <FilterRow icon={Ban} label="Excluded Keywords" values={mission.excluded_keywords} />
          <FilterRow icon={Building2} label="Company Names" values={mission.company_names} />
          <FilterRow icon={Type} label="Opportunity Types" values={mission.opportunity_types} />
          {mission.min_confidence > 0 && (
            <div className="flex items-center gap-2 py-2 border-b border-slate-50 last:border-0">
              <Target className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-xs font-medium text-slate-500">Min Confidence</span>
              <span className="ml-auto px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-xs font-bold">≥ {mission.min_confidence}%</span>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center">
          <Filter className="w-6 h-6 text-slate-200 mx-auto mb-1.5" />
          <p className="text-xs text-slate-400">No filters applied — the engine matches based on the objective alone</p>
        </div>
      )}
    </div>
  );
}