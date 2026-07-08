import React from "react";
import { motion } from "framer-motion";
import { Activity, Globe, Building2, Zap } from "lucide-react";

export default function PlatformStats({ stats, loading }) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  const platform = stats.platform || {};
  const cards = [
    { label: "Active Opportunities", value: platform.activeOpportunities ?? 0, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Countries Monitored", value: platform.countries ?? 0, icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Companies Tracked", value: platform.companiesMonitored ?? 0, icon: Building2, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "New Signals (7d)", value: platform.newSignalsLast7Days ?? 0, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-slate-100 bg-white p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{card.value.toLocaleString()}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wide mt-1">{card.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}