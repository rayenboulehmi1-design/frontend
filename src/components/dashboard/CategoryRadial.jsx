import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";

const CATEGORY_COLORS = {
  "Real Estate": "#2D6A4F",
  "Investment": "#FFB703",
  "Business": "#0d9488",
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
      fill: CATEGORY_COLORS[name] || "hsl(var(--muted-foreground))",
    }));
  }, [signals]);

  if (loading) {
    return <div className="h-64 rounded-2xl bg-muted animate-pulse" />;
  }

  const total = data.reduce((acc, d) => acc + d.value, 0) || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <h2 className="text-lg font-bold text-foreground mb-1">Category Breakdown</h2>
      <p className="text-sm text-muted-foreground/70 mb-6">Radial distribution of signal categories</p>
      <ResponsiveContainer width="100%" height={260}>
        <RadialBarChart innerRadius="30%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, total]} tick={false} />
          <RadialBar background dataKey="value" cornerRadius={8} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 13 }} />
          <Legend iconSize={10} wrapperStyle={{ fontSize: 13 }} />
        </RadialBarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}