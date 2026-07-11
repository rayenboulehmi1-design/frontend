import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BarChart3, ArrowRight, Globe, Tag } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";

// Derive market movement from engine signals (verified data only — no invented trends)
function deriveMarketMovement(signals) {
  if (!signals.length) return { byCountry: [], byCategory: [], total: 0 };

  const countryMap = {};
  const categoryMap = {};

  signals.forEach((s) => {
    const country = s.country || (s.location ? s.location.split(",").pop().trim() : "Global");
    countryMap[country] = (countryMap[country] || 0) + 1;
    if (s.category) categoryMap[s.category] = (categoryMap[s.category] || 0) + 1;
  });

  const toSorted = (map) => Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 6);

  return {
    byCountry: toSorted(countryMap),
    byCategory: toSorted(categoryMap),
    total: signals.length,
  };
}

function MovementBar({ item, maxCount, color }) {
  const pct = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-600 w-24 truncate shrink-0">{item.name}</span>
      <div className="flex-1 h-5 rounded bg-slate-100 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} className={`h-full ${color} rounded`} />
      </div>
      <span className="text-xs font-semibold text-slate-700 w-6 text-right shrink-0">{item.count}</span>
    </div>
  );
}

export default function MarketMovement({ signals }) {
  const demoLink = useDemoLink();
  const movement = useMemo(() => deriveMarketMovement(signals), [signals]);
  const maxCountry = Math.max(...movement.byCountry.map((c) => c.count), 1);
  const maxCategory = Math.max(...movement.byCategory.map((c) => c.count), 1);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Market Movement</h3>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase border bg-blue-50 text-blue-600 border-blue-100">Engine</span>
        </div>
        <span className="text-xs text-slate-400">{movement.total} signals tracked</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Signal Volume by Country</span>
          </div>
          <div className="space-y-2">
            {movement.byCountry.map((item, i) => (
              <MovementBar key={i} item={item} maxCount={maxCountry} color="bg-emerald-400" />
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-3.5 h-3.5 text-violet-500" />
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Opportunity Concentration</span>
          </div>
          <div className="space-y-2">
            {movement.byCategory.map((item, i) => (
              <MovementBar key={i} item={item} maxCount={maxCategory} color="bg-violet-400" />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}