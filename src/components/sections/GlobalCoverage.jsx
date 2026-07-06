import React from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { Link } from "react-router-dom";

const markets = [
  { code: "US", name: "United States", records: 503 },
  { code: "GB", name: "United Kingdom", records: 500 },
  { code: "AE", name: "United Arab Emirates", records: 6 },
  { code: "QA", name: "Qatar", records: 1 },
];

export default function GlobalCoverage() {
  return (
    <section id="markets" className="py-20 sm:py-28 bg-slate-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 mb-5"
          >
            <Globe className="w-7 h-7 text-blue-400" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold tracking-tight"
          >
            Global coverage.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-3 text-slate-400"
          >
            Monitoring 3 markets, market by market.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {markets.map((market, i) => (
            <Link key={market.code} to={`/intelligence-feed?market=${market.code}`}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-blue-600/50 hover:bg-slate-900 transition-all group cursor-pointer h-full"
              >
                <div className="text-4xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform origin-left">
                  {market.code}
                </div>
                <div className="text-sm text-slate-300 font-medium mb-1">{market.name}</div>
                <div className="text-xs text-slate-500">{market.records} records tracked</div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}