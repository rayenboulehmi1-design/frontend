import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Filter, Search, Loader2, MapPin, X } from "lucide-react";
import { fetchSignals } from "@/lib/scoutyClient";
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
    fetchSignals(200)
      .then(setSignals)
      .catch(() => setSignals([]))
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

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-semibold text-primary tracking-wide">Live Feed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Intelligence Feed
          </h1>
          <p className="mt-2 text-muted-foreground">
            Real-time signals detected across global markets — updated continuously.
          </p>

          {market && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-medium">{market.name}</span>
              <button
                onClick={() => setMarket(null)}
                className="ml-1 p-0.5 rounded-full hover:bg-muted-foreground/10 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground/70" />
              </button>
            </div>
          )}
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2 p-2 rounded-full border border-border bg-card flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground/70 ml-2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search signals, locations, entities..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 px-1"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-muted-foreground/70 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "bg-foreground text-background"
                    : "bg-card text-muted-foreground border border-border hover:border-primary/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 text-sm text-muted-foreground/70">
          {loading ? "Loading..." : `${filtered.length} signal${filtered.length !== 1 ? "s" : ""} found`}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground/70">No signals match your filters. Try a different search.</p>
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