import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AlertTriangle, Star, Globe, Coins, TrendingUp, ArrowRight } from "lucide-react";
import ConfidenceBadge from "@/components/dashboard/ConfidenceBadge";
import { getTypeStyle, getGreeting, uniqueCountries } from "@/lib/dealUtils";

export default function DailyIntelligenceBriefing({ signals, user, loading }) {
  const firstName = user?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  const insights = useMemo(() => {
    if (!signals.length) return { urgent: 0, top: 0, markets: 0, highValue: 0, priorities: [], focus: null, snapshot: [] };

    const isUrgent = (s) => {
      const tl = (s.timeline || "").toLowerCase();
      const isShortTimeline = tl.includes("3 month") || tl.includes("1 month") || tl.includes("2 month") || tl.includes("immediate") || tl.includes("short");
      return (s.confidence != null && s.confidence >= 80) && (isShortTimeline || !s.timeline);
    };

    const urgent = signals.filter(isUrgent).length;
    const top = signals.filter((s) => s.confidence != null && s.confidence >= 75).length;
    const markets = uniqueCountries(signals).length;
    const highValue = signals.filter((s) => s.marketSize).length;

    const priorities = [...signals]
      .filter((s) => s.confidence != null)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);

    const focus = priorities.find(isUrgent) || priorities[0] || null;

    const snapshot = [];
    const byType = {};
    const byCountry = {};
    signals.forEach((s) => {
      const t = s.type || s.category;
      if (t) byType[t] = (byType[t] || 0) + 1;
      const c = s.country || (s.location ? s.location.split(",").pop().trim() : null);
      if (c && c !== "Global") byCountry[c] = (byCountry[c] || 0) + 1;
    });

    const topType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];
    if (topType) snapshot.push(`${topType[1]} ${topType[0]} signals detected across all markets`);

    const topCountry = Object.entries(byCountry).sort((a, b) => b[1] - a[1])[0];
    if (topCountry) snapshot.push(`${topCountry[1]} active signals in ${topCountry[0]}`);

    if (highValue > 0) snapshot.push(`${highValue} deals with disclosed market value`);

    const topCompany = {};
    signals.forEach((s) => {
      const c = s.company || s.entity_name;
      if (c) topCompany[c] = (topCompany[c] || 0) + 1;
    });
    const topCo = Object.entries(topCompany).sort((a, b) => b[1] - a[1])[0];
    if (topCo && topCo[1] > 1) snapshot.push(`${topCo[0]} leads with ${topCo[1]} signals tracked`);

    return { urgent, top, markets, highValue, priorities, focus, snapshot: snapshot.slice(0, 4) };
  }, [signals]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 mb-6">
        <div className="h-6 w-48 bg-muted rounded animate-pulse mb-4" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />)}
        </div>
        <div className="h-32 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  const kpiCards = [
    { label: "Urgent Alerts", value: insights.urgent, icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Top Opportunities", value: insights.top, icon: Star, color: "text-accent", bg: "bg-accent/10" },
    { label: "Active Markets", value: insights.markets, icon: Globe, color: "text-primary", bg: "bg-primary/10" },
    { label: "High Value Deals", value: insights.highValue, icon: Coins, color: "text-teal-600", bg: "bg-teal-50" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6 mb-6"
    >
      <div className="mb-5">
        <h2 className="text-xl font-bold text-foreground">{getGreeting()}, {firstName}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          You have <span className="font-semibold text-foreground">{signals.length}</span> opportunities worth reviewing today.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl border border-border bg-muted/50 p-4">
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className="text-2xl font-bold text-foreground">{card.value}</div>
              <div className="text-xs text-muted-foreground/70 mt-0.5">{card.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">Priority Opportunities</h3>
          <div className="space-y-2">
            {insights.priorities.length === 0 ? (
              <p className="text-sm text-muted-foreground/70">No high-confidence opportunities yet.</p>
            ) : (
              insights.priorities.map((deal, i) => {
                const typeStyle = getTypeStyle(deal.type || deal.category);
                return (
                  <Link
                    key={deal.id}
                    to={`/opportunities/${deal.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                  >
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${typeStyle.badge}`}>
                          {deal.type || deal.category}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {deal.company || deal.entity_name || deal.title}
                      </p>
                      <p className="text-xs text-muted-foreground/70 truncate">{deal.country || deal.location}</p>
                    </div>
                    {deal.confidence != null && <ConfidenceBadge score={deal.confidence} size="sm" />}
                  </Link>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-4">
          {insights.focus && (
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3">Recommended Focus Today</h3>
              <Link
                to={`/opportunities/${insights.focus.id}`}
                className="block rounded-xl border-2 border-accent/30 bg-accent/5 p-4 hover:border-accent/50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {insights.focus.company || insights.focus.entity_name || insights.focus.title}
                    </p>
                    <p className="text-xs text-muted-foreground/70">{insights.focus.country || insights.focus.location}</p>
                  </div>
                  <ConfidenceBadge score={insights.focus.confidence} size="md" />
                </div>
                {insights.focus.explanation && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{insights.focus.explanation}</p>
                )}
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-foreground">
                  View Full Analysis <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          )}

          {insights.snapshot.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-foreground mb-3">Market Activity Snapshot</h3>
              <div className="space-y-2">
                {insights.snapshot.map((text, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}