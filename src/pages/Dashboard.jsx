import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2, Bookmark, Bell, ArrowRight, Clock } from "lucide-react";
import { fetchSignalsWithMeta } from "@/lib/scoutyClient";
import { base44 } from "@/api/base44Client";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";
import { getStoredMarket, setStoredMarket } from "@/components/dashboard/MarketSelector";

import IntelligenceHealth from "@/components/dashboard/IntelligenceHealth";
import ExecutiveBrief from "@/components/dashboard/ExecutiveBrief";
import DealCard from "@/components/dashboard/DealCard";
import ActiveMissions from "@/components/dashboard/ActiveMissions";
import WatchlistActivity from "@/components/dashboard/WatchlistActivity";
import MarketMovement from "@/components/dashboard/MarketMovement";
import RecentIntelligence from "@/components/dashboard/RecentIntelligence";
import AlertsSummary from "@/components/dashboard/AlertsSummary";
import SavedOpportunitiesSummary from "@/components/dashboard/SavedOpportunitiesSummary";
import FutureModulesRow from "@/components/dashboard/FutureModulesRow";
import EnhancedFilterBar from "@/components/dashboard/EnhancedFilterBar";
import EmptyState from "@/components/dashboard/EmptyState";
import CRMModule from "@/components/dashboard/CRMModule";

const DEFAULT_FILTERS = {
  search: "",
  searchMode: "All",
  market: "Global",
  type: "All",
  country: "All",
  persona: "All",
  assetType: "All",
  transactionType: "All",
  developmentStage: "All",
};

export default function Dashboard() {
  const [signals, setSignals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataStatus, setDataStatus] = useState("loading");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [user, setUser] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    market: getStoredMarket(),
  });
  const { savedCount } = useSavedOpportunities();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilters((prev) => ({
      ...prev,
      search: params.get("q") || "",
      searchMode: params.get("mode") || "All",
      type: params.get("type") || "All",
      country: params.get("country") || "All",
    }));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("q", filters.search);
    if (filters.searchMode !== "All") params.set("mode", filters.searchMode);
    if (filters.type !== "All") params.set("type", filters.type);
    if (filters.country !== "All") params.set("country", filters.country);
    window.history.replaceState({}, "", `/dashboard${params.toString() ? `?${params}` : ""}`);
  }, [filters]);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    setLoading(true);
    setDataStatus("loading");
    fetchSignalsWithMeta(200)
      .then((data) => {
        setSignals(data.signals || []);
        setStats(data.stats || null);
        setDataStatus(data.status);
        if (data.status === "success" || data.status === "empty") {
          setLastUpdated(data.lastUpdated);
        }
      })
      .catch(() => {
        setSignals([]);
        setStats(null);
        setDataStatus("error");
      })
      .finally(() => setLoading(false));
  }, [retryCount]);

  const filtered = useMemo(() => {
    let result = signals;
    if (filters.market !== "Global") {
      result = result.filter((s) => {
        const c = s.country || (s.location ? s.location.split(",").pop().trim() : "");
        return c === filters.market;
      });
    }
    if (filters.type !== "All") {
      result = result.filter((s) => (s.type || s.category) === filters.type);
    }
    if (filters.country !== "All") {
      result = result.filter((s) => {
        const c = s.country || (s.location ? s.location.split(",").pop().trim() : "");
        return c === filters.country;
      });
    }
    if (filters.assetType !== "All") {
      result = result.filter((s) => s.realEstateDetails?.assetType === filters.assetType);
    }
    if (filters.transactionType !== "All") {
      result = result.filter((s) => s.realEstateDetails?.transactionType === filters.transactionType);
    }
    if (filters.developmentStage !== "All") {
      result = result.filter((s) => s.realEstateDetails?.developmentStage === filters.developmentStage);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((s) =>
        s.title?.toLowerCase().includes(q) ||
        s.company?.toLowerCase().includes(q) ||
        s.entity_name?.toLowerCase().includes(q) ||
        s.country?.toLowerCase().includes(q) ||
        s.location?.toLowerCase().includes(q) ||
        s.type?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q) ||
        (s.signals || []).some((sig) => sig.toLowerCase().includes(q))
      );
    }
    if (["Real Estate", "Business", "Investment"].includes(filters.searchMode)) {
      result = result.filter((s) => s.category === filters.searchMode);
    }
    return result;
  }, [signals, filters]);

  const clearFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setStoredMarket("Global");
  };

  const handleRetry = () => setRetryCount((c) => c + 1);

  // Priority opportunities — top 6 by confidence
  const priorityOpportunities = useMemo(() => {
    return [...filtered]
      .filter((s) => s.confidence != null)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 6);
  }, [filtered]);

  return (
    <div className="p-5 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-6">
      {/* A. Intelligence Health */}
      <IntelligenceHealth status={dataStatus} lastUpdated={lastUpdated} onRetry={handleRetry} />

      {/* B. Executive Intelligence Brief (hero) */}
      <ExecutiveBrief
        signals={signals}
        user={user}
        dataStatus={dataStatus}
        lastUpdated={lastUpdated}
        onRetry={handleRetry}
      />

      {/* Only render dashboard sections when we have data */}
      {dataStatus !== "error" && !loading && signals.length > 0 && (
        <>
          {/* C. Priority Opportunities */}
          <div>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Priority Opportunities</h2>
                <p className="text-xs text-slate-500 mt-0.5">Top opportunities by confidence — verified by the Intelligence Engine</p>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/saved" className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors">
                  <Bookmark className="w-4 h-4 text-slate-400" />
                  Saved
                  {savedCount > 0 && <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">{savedCount}</span>}
                </Link>
                <Link to="/alerts" className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors">
                  <Bell className="w-4 h-4 text-slate-400" />
                  Alerts
                </Link>
              </div>
            </div>

            <EnhancedFilterBar
              signals={signals}
              filters={filters}
              setFilters={setFilters}
              resultCount={filtered.length}
              onClear={clearFilters}
            />

            {priorityOpportunities.length > 0 ? (
              <motion.div layout className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {priorityOpportunities.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </motion.div>
            ) : filtered.length > 0 ? (
              <motion.div layout className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.slice(0, 6).map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </motion.div>
            ) : (
              <EmptyState onClearFilters={clearFilters} />
            )}

            {filtered.length > 6 && (
              <div className="flex justify-center mt-5">
                <Link to="/intelligence-feed" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors">
                  View All Opportunities <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* D. Active AI Missions */}
          <ActiveMissions signals={signals} />

          {/* E. Watchlist Activity */}
          <WatchlistActivity signals={signals} />

          {/* F. Market Movement */}
          <MarketMovement signals={signals} />

          {/* G + H. Recent Intelligence + Alerts + Saved (3-column on desktop) */}
          <div className="grid lg:grid-cols-3 gap-5">
            <RecentIntelligence signals={signals} />
            <AlertsSummary />
            <SavedOpportunitiesSummary />
          </div>

          {/* I. Future-ready modules */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Intelligence Workspace</h2>
            <p className="text-xs text-slate-500 mb-4">Advanced modules — available on higher plans or coming soon</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
              <CRMModule />
            </div>
            <FutureModulesRow />
          </div>
        </>
      )}
    </div>
  );
}