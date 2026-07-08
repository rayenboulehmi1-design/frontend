import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function ConfidenceChart({ signals, loading }) {
  const data = useMemo(() => {
    const buckets = [
      { range: "0-20", min: 0, max: 20, count: 0 },
      { range: "21-40", min: 21, max: 40, count: 0 },
      { range: "41-60", min: 41, max: 60, count: 0 },
      { range: "61-80", min: 61, max: 80, count: 0 },
      { range: "81-100", min: 81, max: 100, count: 0 },
    ];
    signals.forEach((s) => {
      if (s.confidence == null) return;
      const bucket = buckets.find((b) => s.confidence >= b.min && s.confidence <= b.max);
      if (bucket) bucket.count++;
    });
    return buckets.map((b) => ({ range: b.range, count: b.count }));
  }, [signals]);

  if (loading) {
    return <div className="h-64 rounded-2xl bg-muted animate-pulse" />;
  }

  const colors = ["#f87171", "#FFB703", "#fbbf24", "#34d399", "#2D6A4F"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <h2 className="text-lg font-bold text-foreground mb-1">Confidence Distribution</h2>
      <p className="text-sm text-muted-foreground/70 mb-6">Signal count by confidence score range</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 13 }} cursor={{ fill: "hsl(var(--muted))" }} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={48}>
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}