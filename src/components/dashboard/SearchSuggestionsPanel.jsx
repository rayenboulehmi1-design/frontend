import React from "react";
import { TrendingUp, Clock, Building2, Globe } from "lucide-react";
import { categoryCounts } from "@/lib/dealUtils";

export default function SearchSuggestionsPanel({ signals, query, onSelectDeal, onSelectMarket, onSelectCategory }) {
  const q = query.toLowerCase().trim();

  if (!q) {
    const recent = [...signals]
      .sort((a, b) => (b.detected_timestamp || 0) - (a.detected_timestamp || 0))
      .slice(0, 4);

    const marketMap = {};
    signals.forEach((s) => {
      const c = s.country || (s.location ? s.location.split(",").pop().trim() : null);
      if (c && c !== "Global") marketMap[c] = (marketMap[c] || 0) + 1;
    });
    const trending = Object.entries(marketMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return (
      <div className="p-3">
        <Section label="Recent Intelligence" icon={Clock} />
        {recent.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelectDeal(s)}
            className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-muted flex items-center gap-2"
          >
            <Building2 className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
            <span className="text-sm text-foreground truncate flex-1">{s.company || s.entity_name || s.title}</span>
            <span className="text-xs text-muted-foreground/70 shrink-0">{s.time_ago}</span>
          </button>
        ))}
        {trending.length > 0 && <Section label="Trending Markets" icon={Globe} />}
        {trending.map(([country, count]) => (
          <button
            key={country}
            onClick={() => onSelectMarket(country)}
            className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-muted flex items-center gap-2"
          >
            <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-sm text-foreground flex-1">{country}</span>
            <span className="text-xs text-muted-foreground/70">{count} signals</span>
          </button>
        ))}
      </div>
    );
  }

  const matchedDeals = signals.filter((s) =>
    s.company?.toLowerCase().includes(q) ||
    s.entity_name?.toLowerCase().includes(q) ||
    s.title?.toLowerCase().includes(q)
  ).slice(0, 5);

  const matchedCountries = signals.filter((s) => {
    const c = s.country || (s.location ? s.location.split(",").pop().trim() : "");
    return c.toLowerCase().includes(q);
  }).map((s) => s.country || s.location.split(",").pop().trim());
  const uniqueCountries = [...new Set(matchedCountries)].slice(0, 5);

  const counts = categoryCounts(signals);
  const matchedCategories = Object.entries(counts).filter(([name, count]) =>
    count > 0 && name.toLowerCase().includes(q)
  );

  const hasResults = matchedDeals.length > 0 || uniqueCountries.length > 0 || matchedCategories.length > 0;

  if (!hasResults) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-muted-foreground/70">No genuine intelligence matches "{query}" yet.</p>
      </div>
    );
  }

  return (
    <div className="p-3">
      {matchedCategories.length > 0 && <Section label="Categories" icon={TrendingUp} />}
      {matchedCategories.map(([name, count]) => (
        <button
          key={name}
          onClick={() => onSelectCategory(name)}
          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-muted flex items-center justify-between"
        >
          <span className="text-sm text-foreground">{name}</span>
          <span className="text-xs text-muted-foreground/70">{count} signals</span>
        </button>
      ))}
      {matchedDeals.length > 0 && <Section label="Companies & Developers" icon={Building2} />}
      {matchedDeals.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelectDeal(s)}
          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-muted flex items-center gap-2"
        >
          <Building2 className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
          <span className="text-sm text-foreground truncate flex-1">{s.company || s.entity_name || s.title}</span>
          <span className="text-xs text-muted-foreground/70 shrink-0">{s.type || s.category}</span>
        </button>
      ))}
      {uniqueCountries.length > 0 && <Section label="Markets" icon={Globe} />}
      {uniqueCountries.map((country) => (
        <button
          key={country}
          onClick={() => onSelectMarket(country)}
          className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-muted flex items-center gap-2"
        >
          <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-sm text-foreground">{country}</span>
        </button>
      ))}
    </div>
  );
}

function Section({ label, icon: Icon }) {
  return (
    <div className="flex items-center gap-1.5 px-2 pt-3 pb-1">
      <Icon className="w-3 h-3 text-muted-foreground/30" />
      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground/30">{label}</span>
    </div>
  );
}