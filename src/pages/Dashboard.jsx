import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Activity, TrendingUp, MapPin, Building2, Loader2, Briefcase } from "lucide-react";
import { fetchSignals } from "@/lib/scoutyClient";

const CATEGORY_COLORS = {
  "Real Estate": "#2563eb",
  "Investment": "#10b981",
  "Business": "#8b5cf6",
};

export default function Dashboard() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignals(200)
      .then(setSignals)
      .catch(() => setSignals([]))
      .finally(() => setLoading(false));
  }, []);

  // Build last-14-days time series
  const timeSeries = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      days.push({
        date: d,
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        "Real Estate": 0,
        "Investment": 0,
        "Business": 0,
      });
    }
    signals.forEach((s) => {
      const d = new Date(s.created_date || s.time_ago);
      d.setHours(0, 0, 0, 0);
      const idx = days.findIndex((day) => day.date.getTime() === d.getTime());
      if (idx !== -1 && s.category) days[idx][s.category]++;
    });
    return days;
  }, [signals]);

  // Totals by category
  const categoryTotals = useMemo(() => {
    const totals = { "Real Estate": 0, "Investment": 0, "Business": 0 };
    signals.forEach((s) => {
      if (s.category && totals[s.category] !== undefined) totals[s.category]++;
    });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [signals]);

  // Top locations
  const locationTotals = useMemo(() => {
    const map = {};
    signals.forEach((s) => {
      if (!s.location) return;
      map[s.location] = (map[s.location] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [signals]);

  const total = signals.length;
  const avgConfidence = signals.length
    ? Math.round(signals.filter(s => s.confidence).reduce((acc, s) => acc + (s.confidence || 0), 0) / (signals.filter(s => s.confidence).length || 1))
    : 0;
  const last7 = timeSeries.slice(-7).reduce((acc, d) => acc + d["Real Estate"] + d["Investment"] + d["Business"], 0);

  const statCards = [
    { label: "Total Signals", value: total, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Signals (7d)", value: last7, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Avg Confidence", value: `${avgConfidence}%`, icon: Building2, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Markets", value: locationTotals.length, icon: MapPin, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Intelligence Dashboard
          </h1>
          <p className="mt-2 text-slate-500">
            Visualizing signal activity and trends across global markets.
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-slate-100 bg-white p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900">{card.value}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wide mt-1">{card.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Activity over time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-slate-100 bg-white p-6 mb-8"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-1">Signal Activity Over Time</h2>
          <p className="text-sm text-slate-400 mb-6">Daily signal count by category (last 14 days)</p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeSeries}>
              <defs>
                {Object.keys(CATEGORY_COLORS).map((cat) => (
                  <linearGradient key={cat} id={`grad-${cat}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CATEGORY_COLORS[cat]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CATEGORY_COLORS[cat]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
                labelStyle={{ fontWeight: 600, color: "#1e293b" }}
              />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Area type="monotone" dataKey="Real Estate" stroke={CATEGORY_COLORS["Real Estate"]} fill={`url(#grad-Real Estate)`} strokeWidth={2} />
              <Area type="monotone" dataKey="Investment" stroke={CATEGORY_COLORS["Investment"]} fill={`url(#grad-Investment)`} strokeWidth={2} />
              <Area type="monotone" dataKey="Business" stroke={CATEGORY_COLORS["Business"]} fill={`url(#grad-Business)`} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Category breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-slate-100 bg-white p-6"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-1">Signals by Category</h2>
            <p className="text-sm text-slate-400 mb-6">Distribution across intelligence types</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryTotals}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {categoryTotals.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#94a3b8"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
                <Legend wrapperStyle={{ fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top locations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl border border-slate-100 bg-white p-6"
          >
            <h2 className="text-lg font-bold text-slate-900 mb-1">Top Markets by Signal Volume</h2>
            <p className="text-sm text-slate-400 mb-6">Geographic distribution of activity</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={locationTotals} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={120} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Bar dataKey="value" fill="#2563eb" radius={[0, 8, 8, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}