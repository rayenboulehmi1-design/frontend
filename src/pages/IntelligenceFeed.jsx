import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Filter, Search, Loader2, MapPin, X, AlertCircle, RefreshCw, SearchX } from "lucide-react";
import { fetchSignalsWithMeta } from "@/lib/scoutyClient";
import SignalCard from "@/components/SignalCard";

const categories = ["All", "Real Estate", "Investment", "Business"];

const MARKET_MAP = {
  US: { code: "US", name: "United States" },
  GB: { code: "GB", name: "United Kingdom" },
  AE: { code: "AE", name: "United Arab Emirates" },
  QA: { code: "QA", name: "Qatar" },
};

export default function IntelligenceFeed() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [market, setMarket] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get("market");
    if (m) setMarket(MARKET_MAP[m.toUpperCase()] || { code: m.toUpperCase(), name: m });
    const s = params.get("search");
    if (s) setSearch(s);
    const c = params.get("category");
    if (c && categories.includes(c)) setActiveCategory(c);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchSignalsWithMeta(200)
      .then((data) => {
        setSignals(data.signals || []);
        if (data.status === "error") setError(data.error || "Failed to load intelligence");
      })
      .catch(() => {
        setSignals([]);
        setError("Failed to load intelligence feed");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return signals.filter((s) => {
      const matchesCategory = activeCategory === "All" || s.category === activeCategory;
      const matchesSearch =
        !search ||
        s.title?.toLowerCase().includes(search.toLowerCase()) ||
        s.location?.toLowerCase().includes(search.toLowerCase()) ||
        s.entity_name?.toLowerCase().includes(search.toLowerCase());
      const matchesMarket =
        !market ||
        s.location?.includes(market.code) ||
        s.location?.toLowerCase().includes(market.name.toLowerCase());
      return matchesCategory && matchesSearch && matchesMarket;
    });
  }, [signals, activeCategory, search, market]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchSignalsWithMeta(200)
      .then((data) => {
        setSignals(data.signals || []);
        if (data.status === "error") setError(data.error || "Failed to load intelligence");
      })
      .catch(() => {
        setSignals([]);
        setError("Failed to load intelligence feed");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50/50 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
            </span>
            <span className="text-xs font-semibold text-blue-700 tracking-wide">Live Feed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Intelligence Feed
          </h1>
          <p className="mt-2 text-slate-500">
            Real-time signals detected across global markets — updated continuously.
          </p>

          {market && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-sm font-medium">{market.name}</span>
              <button
                onClick={() => setMarket(null)}
                className="ml-1 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2 p-2 rounded-full border border-slate-200 bg-white flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search signals, locations, entities..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 px-1"
            />
            {search && (
              <button onClick={() => setSearch("")} className="p-1 rounded-full hover:bg-slate-100 transition-colors">
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
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

        {/* Results count */}
        <div className="mb-6 text-sm text-slate-400">
          {loading ? "Loading..." : error ? "—" : `${filtered.length} signal${filtered.length !== 1 ? "s" : ""} found`}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 space-y-3 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-20 rounded-full bg-slate-100" />
                  <div className="h-3 w-16 bg-slate-100 rounded" />
                </div>
                <div className="h-4 w-3/4 bg-slate-100 rounded" />
                <div className="h-3 w-full bg-slate-100 rounded" />
                <div className="h-3 w-5/6 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-rose-500" />
            </div>
            <p className="text-sm font-bold text-rose-900 mb-1">Couldn't load intelligence feed</p>
            <p className="text-xs text-rose-500 mb-4 max-w-sm mx-auto">
              We're having trouble connecting to the Intelligence Engine. Please try again.
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No signals match your filters</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
              Try adjusting your search query or selecting a different category.
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); setMarket(null); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Clear filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((signal, i) => (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <SignalCard signal={signal} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}