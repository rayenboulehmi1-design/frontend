import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Bookmark, Bell } from "lucide-react";
import { fetchSignalsWithMeta } from "@/lib/scoutyClient";
import { base44 } from "@/api/base44Client";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";
import PlatformStats from "@/components/dashboard/PlatformStats";
import ConfidenceChart from "@/components/dashboard/ConfidenceChart";
import CategoryRadial from "@/components/dashboard/CategoryRadial";
import TopLocations from "@/components/dashboard/TopLocations";
import FilterBar from "@/components/dashboard/FilterBar";
import SignalTable from "@/components/dashboard/SignalTable";
import SignalCard from "@/components/SignalCard";

export default function Dashboard() {
  const [signals, setSignals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("scouty_settings") || "{}").defaultCategory || "All"; } catch { return "All"; }
  });
  const [minConfidence, setMinConfidence] = useState(() => {
    try { return JSON.parse(localStorage.getItem("scouty_settings") || "{}").minConfidence || 0; } catch { return 0; }
  });
  const { savedCount } = useSavedOpportunities();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    fetchSignalsWithMeta(200)
      .then((data) => {
        setSignals(data.signals || []);
        setStats(data.stats || null);
      })
      .catch(() => { setSignals([]); setStats(null); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return signals.filter((s) => {
      const matchesCategory = activeCategory === "All" || s.category === activeCategory;
      const matchesSearch = !search ||
        s.title?.toLowerCase().includes(search.toLowerCase()) ||
        s.location?.toLowerCase().includes(search.toLowerCase()) ||
        s.entity_name?.toLowerCase().includes(search.toLowerCase());
      const matchesConfidence = !s.confidence || s.confidence >= minConfidence;
      return matchesCategory && matchesSearch && matchesConfidence;
    });
  }, [signals, search, activeCategory, minConfidence]);

  const recentDiscoveries = useMemo(() => {
    return [...filtered]
      .sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0))
      .slice(0, 6);
  }, [filtered]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  const firstName = user?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  return (
    <div className="p-5 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, {firstName}
            </h1>
            <p className="mt-1 text-slate-500 text-sm">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} — {signals.length} live signals tracked
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/saved" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors">
              <Bookmark className="w-4 h-4 text-slate-400" />
              Saved
              {savedCount > 0 && <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">{savedCount}</span>}
            </Link>
            <Link to="/alerts" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors">
              <Bell className="w-4 h-4 text-slate-400" />
              Alerts
            </Link>
          </div>
        </div>
      </motion.div>

      <PlatformStats stats={stats} loading={false} />

      <FilterBar
        search={search}
        setSearch={setSearch}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        minConfidence={minConfidence}
        setMinConfidence={setMinConfidence}
        resultCount={filtered.length}
      />

      {/* Recent Discoveries */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Discoveries</h2>
          <Link to="/intelligence-feed" className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:gap-2 transition-all">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentDiscoveries.map((signal, i) => (
            <motion.div key={signal.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <SignalCard signal={signal} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <ConfidenceChart signals={filtered} loading={false} />
        <CategoryRadial signals={filtered} loading={false} />
      </div>

      {/* Top Locations */}
      <div className="mb-8">
        <TopLocations signals={filtered} />
      </div>

      {/* Signal Registry */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Signal Registry</h2>
        <span className="text-sm text-slate-400">{filtered.length} records</span>
      </div>
      <SignalTable signals={filtered} loading={false} />
    </div>
  );
}