import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2, Bookmark, Bell, AlertCircle } from "lucide-react";
import { fetchSignalsWithMeta } from "@/lib/scoutyClient";
import { base44 } from "@/api/base44Client";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";
import { useNotifications } from "@/hooks/useNotifications";
import { getStoredMarket, setStoredMarket } from "@/components/dashboard/MarketSelector";

import DailyIntelligenceBriefing from "@/components/dashboard/DailyIntelligenceBriefing";
import WatchlistModule from "@/components/dashboard/WatchlistModule";
import MissionsModule from "@/components/dashboard/MissionsModule";
import LiveActivityBar from "@/components/dashboard/LiveActivityBar";
import EnhancedFilterBar from "@/components/dashboard/EnhancedFilterBar";
import DealCard from "@/components/dashboard/DealCard";
import CompaniesView from "@/components/dashboard/CompaniesView";
import MarketsView from "@/components/dashboard/MarketsView";
import EmptyState from "@/components/dashboard/EmptyState";
import ConfidenceChart from "@/components/dashboard/ConfidenceChart";
import CategoryRadial from "@/components/dashboard/CategoryRadial";
import TopLocations from "@/components/dashboard/TopLocations";
import SignalTable from "@/components/dashboard/SignalTable";

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
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    market: getStoredMarket(),
  });
  const { savedCount } = useSavedOpportunities();
  const { addNotification } = useNotifications();

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
    setError(false);
    fetchSignalsWithMeta(200)
      .then((data) => {
        const newSignals = data.signals || [];
        const seenKey = "scouty_seen_deals";
        let seen = new Set();
        try { seen = new Set(JSON.parse(sessionStorage.getItem(seenKey) || "[]")); } catch {}
        const tagged = newSignals.map((s) => ({ ...s, isNew: seen.size > 0 && !seen.has(s.id) }));
        tagged.filter((s) => s.isNew).forEach((s) => addNotification(s));
        try {
          sessionStorage.setItem(seenKey, JSON.stringify([...new Set([...seen, ...newSignals.map((s) => s.id)])]));
        } catch {}
        setSignals(tagged);
        setStats(data.stats || null);
        setError(false);
      })
      .catch(() => {
        setSignals([]);
        setStats(null);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [addNotification, retryCount]);

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

  const companies = useMemo(() => {
    if (filters.searchMode !== "Companies") return [];
    const map = {};
    filtered.forEach((s) => {
      const name = s.company || s.entity_name || s.title;
      if (!map[name]) map[name] = { name, signals: [], category: s.category, location: s.country || s.location };
      map[name].signals.push(s);
    });
    return Object.values(map).sort((a, b) => b.signals.length - a.signals.length);
  }, [filtered, filters.searchMode]);

  const markets = useMemo(() => {
    if (filters.searchMode !== "Markets") return [];
    const map = {};
    filtered.forEach((s) => {
      const c = s.country || (s.location ? s.location.split(",").pop().trim() : "Global");
      if (!map[c]) map[c] = { name: c, signals: [], categories: {} };
      map[c].signals.push(s);
      map[c].categories[s.category] = (map[c].categories[s.category] || 0) + 1;
    });
    return Object.values(map).sort((a, b) => b.signals.length - a.signals.length);
  }, [filtered, filters.searchMode]);

  const clearFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setStoredMarket("Global");
  };

  const handleSelectCompany = (name) => {
    setFilters((prev) => ({ ...prev, search: name, searchMode: "All" }));
  };

  const handleSelectMarket = (country) => {
    setFilters((prev) => ({ ...prev, country, searchMode: "All" }));
  };

  const resultCount = filters.searchMode === "Companies" ? companies.length
    : filters.searchMode === "Markets" ? markets.length
    : filtered.length;

  return (
    <div className="p-5 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-6">
      <DailyIntelligenceBriefing signals={signals} user={user} loading={loading} />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
          <AlertCircle className="w-8 h-8 text-destructive/60 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">Couldn't load live intelligence</p>
          <p className="text-xs text-muted-foreground/70 mb-4">The ScoutyGo API may be temporarily unavailable.</p>
          <button
            onClick={() => setRetryCount((c) => c + 1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Loader2 className="w-4 h-4" /> Retry
          </button>
        </div>
      ) : (
        <>
          <WatchlistModule />

          <MissionsModule />

          <LiveActivityBar liveCount={signals.length} />

          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">Opportunity Feed</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/saved" className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:border-primary/30 transition-colors">
                <Bookmark className="w-4 h-4 text-muted-foreground/70" />
                Saved
                {savedCount > 0 && <span className="px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-semibold">{savedCount}</span>}
              </Link>
              <Link to="/alerts" className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:border-primary/30 transition-colors">
                <Bell className="w-4 h-4 text-muted-foreground/70" />
                Alerts
              </Link>
            </div>
          </div>

          <EnhancedFilterBar
            signals={signals}
            filters={filters}
            setFilters={setFilters}
            resultCount={resultCount}
            onClear={clearFilters}
          />

          {filters.searchMode === "Companies" ? (
            companies.length > 0 ? (
              <CompaniesView companies={companies} onSelect={handleSelectCompany} />
            ) : (
              <EmptyState onClearFilters={clearFilters} />
            )
          ) : filters.searchMode === "Markets" ? (
            markets.length > 0 ? (
              <MarketsView markets={markets} onSelect={handleSelectMarket} />
            ) : (
              <EmptyState onClearFilters={clearFilters} />
            )
          ) : filtered.length > 0 ? (
            <motion.div layout className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </motion.div>
          ) : (
            <EmptyState onClearFilters={clearFilters} />
          )}

          <div className="grid lg:grid-cols-2 gap-6 pt-4">
            <ConfidenceChart signals={filtered} loading={false} />
            <CategoryRadial signals={filtered} loading={false} />
          </div>

          <TopLocations signals={filtered} />

          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Signal Registry</h2>
              <span className="text-sm text-muted-foreground/70">{filtered.length} records</span>
            </div>
            <SignalTable signals={filtered} loading={false} />
          </div>
        </>
      )}
    </div>
  );
}