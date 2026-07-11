import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal, RotateCcw } from "lucide-react";
import FilterDropdown from "./FilterDropdown";
import MarketSelector, { getStoredMarket, setStoredMarket } from "./MarketSelector";
import SearchSuggestionsPanel from "./SearchSuggestionsPanel";
import { avgConfidence, categoryCounts, PERSONA_PRESETS } from "@/lib/dealUtils";

const MODE_TABS = ["All", "Real Estate", "Business", "Investment", "Companies", "Markets"];
const OPPORTUNITY_TYPES = ["All", "Real Estate", "Expansion", "Franchise", "Industrial", "Hospitality", "Mixed-Use", "Public Sector & Procurement"];
const PERSONAS = ["All", "Investor", "Broker", "Developer", "Contractor", "Architect", "Fit-out", "Supplier"];

export default function EnhancedFilterBar({
  signals, filters, setFilters, resultCount, onClear,
}) {
  const [focused, setFocused] = useState(false);
  const searchRef = useRef(null);

  const countries = React.useMemo(() => {
    const set = new Set();
    signals.forEach((s) => {
      const c = s.country || (s.location ? s.location.split(",").pop().trim() : null);
      if (c && c !== "Global") set.add(c);
    });
    return ["All", ...Array.from(set).sort()];
  }, [signals]);

  const assetTypes = React.useMemo(() => {
    const set = new Set();
    signals.forEach((s) => {
      if (s.realEstateDetails?.assetType) set.add(s.realEstateDetails.assetType);
    });
    return ["All", ...Array.from(set).sort()];
  }, [signals]);

  const transactionTypes = React.useMemo(() => {
    const set = new Set();
    signals.forEach((s) => {
      if (s.realEstateDetails?.transactionType) set.add(s.realEstateDetails.transactionType);
    });
    return ["All", ...Array.from(set).sort()];
  }, [signals]);

  const devStages = React.useMemo(() => {
    const set = new Set();
    signals.forEach((s) => {
      if (s.realEstateDetails?.developmentStage) set.add(s.realEstateDetails.developmentStage);
    });
    return ["All", ...Array.from(set).sort()];
  }, [signals]);

  const isRealEstate = filters.type === "Real Estate";
  const avg = avgConfidence(signals);
  const counts = categoryCounts(signals);

  const update = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  const handlePersona = (persona) => {
    if (persona === "All") {
      update("persona", "All");
      return;
    }
    const preset = PERSONA_PRESETS[persona];
    if (preset) {
      setFilters(prev => ({
        ...prev,
        persona,
        type: preset.type || prev.type,
        assetType: preset.assetType || "All",
        transactionType: preset.transactionType || "All",
        developmentStage: preset.developmentStage || "All",
      }));
    }
  };

  const hasActiveFilters = filters.search || filters.type !== "All" || filters.country !== "All" ||
    filters.persona !== "All" || filters.assetType !== "All" || filters.transactionType !== "All" ||
    filters.developmentStage !== "All" || filters.market !== "Global" || filters.searchMode !== "All";

  return (
    <div className="space-y-4">
      {/* Search bar with suggestions */}
      <div className="relative">
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            ref={searchRef}
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search companies, markets, signals..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400"
          />
          {filters.search && (
            <button onClick={() => update("search", "")} className="p-1 rounded hover:bg-slate-100">
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>
        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-1 left-0 right-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl z-40 max-h-80 overflow-y-auto"
            >
              <SearchSuggestionsPanel
                signals={signals}
                query={filters.search}
                onSelectDeal={(s) => { update("search", s.company || s.entity_name || s.title); setFocused(false); }}
                onSelectMarket={(c) => { update("country", c); setFocused(false); }}
                onSelectCategory={(cat) => { update("searchMode", cat); setFocused(false); }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mode tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {MODE_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => update("searchMode", tab)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filters.searchMode === tab
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Result summary + avg confidence */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {filters.searchMode === "Companies"
            ? `${resultCount} companies matching "${filters.search || "all"}"`
            : filters.searchMode === "Markets"
            ? `${resultCount} markets matching "${filters.search || "all"}"`
            : <>
                {resultCount} results across intelligence categories —{" "}
                <span className="text-blue-600 dark:text-blue-400">Real Estate: {counts["Real Estate"]}</span> ·{" "}
                <span className="text-violet-600 dark:text-violet-400">Business: {counts["Business"]}</span> ·{" "}
                <span className="text-emerald-600 dark:text-emerald-400">Investment: {counts["Investment"]}</span>
              </>
          }
        </p>
        <div className="flex items-center gap-2">
          {avg > 0 && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 text-xs font-semibold">
              Avg Confidence: {avg}%
            </span>
          )}
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
        <MarketSelector
          value={filters.market}
          onChange={(v) => { update("market", v); setStoredMarket(v); }}
          signals={signals}
        />
        <FilterDropdown label="Type" options={OPPORTUNITY_TYPES} value={filters.type} onChange={(v) => update("type", v)} />
        <FilterDropdown label="Country" options={countries} value={filters.country} onChange={(v) => update("country", v)} />
        <FilterDropdown label="Persona" options={PERSONAS} value={filters.persona} onChange={handlePersona} />
        {isRealEstate && assetTypes.length > 1 && (
          <FilterDropdown label="Asset Type" options={assetTypes} value={filters.assetType} onChange={(v) => update("assetType", v)} />
        )}
        {isRealEstate && transactionTypes.length > 1 && (
          <FilterDropdown label="Transaction" options={transactionTypes} value={filters.transactionType} onChange={(v) => update("transactionType", v)} />
        )}
        {isRealEstate && devStages.length > 1 && (
          <FilterDropdown label="Dev Stage" options={devStages} value={filters.developmentStage} onChange={(v) => update("developmentStage", v)} />
        )}
      </div>
    </div>
  );
}