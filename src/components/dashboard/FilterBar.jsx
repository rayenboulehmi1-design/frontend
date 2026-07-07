import React from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

const categories = ["All", "Real Estate", "Investment", "Business"];

export default function FilterBar({
  search, setSearch, activeCategory, setActiveCategory,
  minConfidence, setMinConfidence, resultCount,
}) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-white flex-1">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search signals, locations, entities..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="text-sm text-slate-500 shrink-0">Min Confidence</span>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={minConfidence}
          onChange={(e) => setMinConfidence(Number(e.target.value))}
          className="flex-1 max-w-xs accent-blue-600"
        />
        <span className="text-sm font-semibold text-slate-700 w-12">{minConfidence}%+</span>
        <span className="ml-auto text-sm text-slate-400">{resultCount} results</span>
      </div>
    </div>
  );
}