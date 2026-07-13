import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Eye, ArrowRight, Building2, Globe, Factory, Tag } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";

// Derive watchlist activity from engine signals (verified data only)
function deriveActivity(signals) {
  if (!signals.length) return { companies: [], countries: [], categories: [] };

  const companyMap = {};
  const countryMap = {};
  const categoryMap = {};

  signals.forEach((s) => {
    const company = s.company || s.entity_name;
    if (company) companyMap[company] = (companyMap[company] || 0) + 1;
    const country = s.country || (s.location ? s.location.split(",").pop().trim() : null);
    if (country && country !== "Global") countryMap[country] = (countryMap[country] || 0) + 1;
    if (s.category) categoryMap[s.category] = (categoryMap[s.category] || 0) + 1;
  });

  const toSorted = (map) => Object.entries(map).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 5);

  return {
    companies: toSorted(companyMap),
    countries: toSorted(countryMap),
    categories: toSorted(categoryMap),
  };
}

function ActivityColumn({ icon: Icon, title, items, accentColor }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-3.5 h-3.5 ${accentColor}`} />
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</span>
      </div>
      {items.length > 0 ? (
        <div className="space-y-1.5">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-800/30">
              <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold shrink-0">{item.count}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-4 text-center rounded-xl border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-800/30">
          <Icon className="w-6 h-6 text-slate-200 dark:text-slate-700 mb-1.5" />
          <p className="text-xs text-slate-400 dark:text-slate-500">No activity yet</p>
        </div>
      )}
    </div>
  );
}

export default function WatchlistActivity({ signals }) {
  const demoLink = useDemoLink();
  const activity = useMemo(() => deriveActivity(signals), [signals]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Watchlist Activity</h3>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase border bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900">Engine</span>
        </div>
        <Link to={demoLink("/watchlist")} className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:gap-2 transition-all">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <ActivityColumn icon={Building2} title="Companies" items={activity.companies} accentColor="text-blue-500" />
        <ActivityColumn icon={Globe} title="Countries" items={activity.countries} accentColor="text-emerald-500" />
        <ActivityColumn icon={Tag} title="Categories" items={activity.categories} accentColor="text-violet-500" />
      </div>
    </motion.div>
  );
}