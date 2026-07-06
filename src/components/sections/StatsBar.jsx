import React from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "3", label: "Countries Monitored" },
  { value: "1,388", label: "Live Signals (7d)" },
  { value: "13", label: "Active Opportunities" },
  { value: "200", label: "Entities Monitored" },
  { value: "0", label: "Verified Today" },
];

export default function StatsBar() {
  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                {stat.value}
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