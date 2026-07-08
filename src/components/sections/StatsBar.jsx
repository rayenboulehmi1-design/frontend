import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchSignalsWithMeta } from "@/lib/scoutyClient";

export default function StatsBar() {
  const [stats, setStats] = useState(null);
  const [signalCount, setSignalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignalsWithMeta(500)
      .then((data) => {
        setStats(data.stats || null);
        setSignalCount((data.signals || []).length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const platform = stats?.platform || {};
  const statsList = [
    { value: platform.countries ?? 3, label: "Countries Monitored" },
    { value: platform.newSignalsLast7Days ?? signalCount, label: "Live Signals" },
    { value: platform.activeOpportunities ?? signalCount, label: "Active Opportunities" },
    { value: platform.companiesMonitored ?? 0, label: "Entities Monitored" },
  ];

  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statsList.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                {loading ? "—" : (typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value)}
              </div>
              <div className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}