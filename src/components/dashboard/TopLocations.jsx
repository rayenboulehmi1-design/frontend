import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MapPin } from "lucide-react";

export default function TopLocations({ signals }) {
  const data = useMemo(() => {
    const map = {};
    signals.forEach((s) => {
      if (!s.location) return;
      map[s.location] = (map[s.location] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [signals]);

  if (!data.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <div className="flex items-center gap-2 mb-1">
        <MapPin className="w-4 h-4 text-muted-foreground/70" />
        <h2 className="text-lg font-bold text-foreground">Top Markets</h2>
      </div>
      <p className="text-sm text-muted-foreground/70 mb-6">Geographic distribution of signals</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={120} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 13 }} cursor={{ fill: "hsl(var(--muted))" }} />
          <Bar dataKey="value" fill="#2D6A4F" radius={[0, 8, 8, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}