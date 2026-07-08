import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchSignals } from "@/lib/scoutyClient";

const MARKET_MAP = {
  "United States": { code: "US", name: "United States" },
  "United Kingdom": { code: "GB", name: "United Kingdom" },
  "United Arab Emirates": { code: "AE", name: "United Arab Emirates" },
  "Qatar": { code: "QA", name: "Qatar" },
};

export default function GlobalCoverage() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignals(500)
      .then((signals) => {
        const counts = {};
        signals.forEach((s) => {
          if (!s.location) return;
          const parts = s.location.split(",").map((p) => p.trim());
          const country = parts[parts.length - 1];
          if (!counts[country]) counts[country] = { name: country, records: 0 };
          counts[country].records++;
        });
        const sorted = Object.values(counts)
          .map((m) => ({
            ...m,
            code: MARKET_MAP[m.name]?.code || m.name.slice(0, 2).toUpperCase(),
          }))
          .sort((a, b) => b.records - a.records)
          .slice(0, 8);
        setMarkets(sorted);
      })
      .catch(() => setMarkets([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="markets" className="py-20 sm:py-28 bg-foreground text-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/20 mb-5"
          >
            <Globe className="w-7 h-7 text-primary" />
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
            className="mt-3 text-background/70"
          >
            Monitoring {loading ? "…" : markets.length} {markets.length === 1 ? "market" : "markets"}, market by market.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            [0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-background/10 bg-background/5 p-6 h-32 animate-pulse" />
            ))
          ) : markets.length === 0 ? (
            <p className="col-span-full text-center text-background/50 py-8">No market data available right now.</p>
          ) : (
            markets.map((market, i) => (
              <Link key={market.code} to={`/intelligence-feed?market=${market.code}`}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="rounded-2xl border border-background/10 bg-background/5 p-6 hover:border-primary/50 hover:bg-background/10 transition-all group cursor-pointer h-full"
                >
                  <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform origin-left">
                    {market.code}
                  </div>
                  <div className="text-sm text-background/80 font-medium mb-1">{market.name}</div>
                  <div className="text-xs text-background/50">{market.records} records tracked</div>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}