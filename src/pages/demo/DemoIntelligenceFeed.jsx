import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Filter, Search } from "lucide-react";
import { DEMO_SIGNALS } from "@/lib/demoData";
import SignalCard from "@/components/SignalCard";

const categories = ["All", "Real Estate", "Investment", "Business"];

export default function DemoIntelligenceFeed() {
  const [signals] = useState(DEMO_SIGNALS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return signals.filter((s) => {
      const matchesCategory = activeCategory === "All" || s.category === activeCategory;
      const matchesSearch =
        !search ||
        s.title?.toLowerCase().includes(search.toLowerCase()) ||
        s.location?.toLowerCase().includes(search.toLowerCase()) ||
        s.entity_name?.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [signals, activeCategory, search]);

  return (
    <div className="p-5 sm:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50/50 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
          </span>
          <span className="text-xs font-semibold text-blue-700 tracking-wide">Live Feed (Demo)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Intelligence Feed</h1>
        <p className="mt-2 text-slate-500">Real-time signals detected across global markets — updated continuously.</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex items-center gap-2 p-2 rounded-full border border-slate-200 bg-white flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search signals, locations, entities..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 px-1"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 text-sm text-slate-400">{filtered.length} signal{filtered.length !== 1 ? "s" : ""} found</div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400">No signals match your filters. Try a different search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((signal, i) => (
            <motion.div key={signal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }}>
              <SignalCard signal={signal} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}