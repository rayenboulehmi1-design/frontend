import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SignalCard from "@/components/SignalCard";

export default function LiveIntelligence() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Signal.list("-created_date", 6)
      .then(setSignals)
      .catch(() => setSignals([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="live-intelligence" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900"
            >
              Live Intelligence
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="mt-2 text-slate-500"
            >
              Signals detected across global markets.
            </motion.p>
          </div>
          <Link
            to="/intelligence-feed"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:gap-2.5 transition-all"
          >
            View All Live Intelligence <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? [0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
              ))
            : signals.map((signal, i) => (
                <motion.div
                  key={signal.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <SignalCard signal={signal} />
                </motion.div>
              ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/intelligence-feed"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600"
          >
            View All Live Intelligence <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}