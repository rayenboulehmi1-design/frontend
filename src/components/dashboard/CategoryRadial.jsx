import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";

const CATEGORY_COLORS = {
  "Real Estate": "#2563eb",
  "Investment": "#10b981",
  "Business": "#8b5cf6",
};

export default function CategoryRadial({ signals, loading }) {
  const data = useMemo(() => {
    const totals = { "Real Estate": 0, "Investment": 0, "Business": 0 };
    signals.forEach((s) => {
      if (s.category && totals[s.category] !== undefined) totals[s.category]++;
    });
    return Object.entries(totals).map(([name, value]) => ({
      name,
      value,
      fill: CATEGORY_COLORS[name] || "#94a3b8",
    }));
  }, [signals]);

  if (loading) {
    return <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />;
  }

  const total = data.reduce((acc, d) => acc + d.value, 0) || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
    >
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">Category Breakdown</h2>
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">Radial distribution of signal categories</p>
      <ResponsiveContainer width="100%" height={260}>
        <RadialBarChart innerRadius="30%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, total]} tick={false} />
          <RadialBar background dataKey="value" cornerRadius={8} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
          <Legend iconSize={10} wrapperStyle={{ fontSize: 13 }} />
        </RadialBarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}