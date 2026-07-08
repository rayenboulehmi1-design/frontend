import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Search, Radar, ArrowRight, Activity } from "lucide-react";
import { fetchSignals } from "@/lib/scoutyClient";
import SignalCard from "@/components/SignalCard";

export default function Hero() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSignals(3)
      .then(setSignals)
      .catch(() => setSignals([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs font-semibold text-primary tracking-wide">
                Live Global Intelligence
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.08]"
            >
              See what's moving.
              <br />
              <span className="text-muted-foreground/50">Before everyone else does.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl"
            >
              ScoutyGo monitors real estate developments, off-plan launches, business activity,
              investment signals, market expansion and partnerships across global markets — turning
              fragmented public information into actionable intelligence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <Link
                to="/intelligence-feed"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25 group"
              >
                Explore Live Intelligence
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-6 flex items-center gap-2 p-2 rounded-full border border-border bg-card shadow-sm max-w-xl"
            >
              <Search className="w-5 h-5 text-muted-foreground/70 ml-2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search off-plan developments in Dubai..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 px-1"
              />
              <button
                onClick={() => navigate(`/intelligence-feed?search=${encodeURIComponent(search)}`)}
                className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Search
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="rounded-3xl border border-border bg-card shadow-xl shadow-foreground/5 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary tracking-wide">LIVE NOW</span>
                </div>
                <span className="text-xs text-muted-foreground/70">{signals.length} signals</span>
              </div>

              <div className="space-y-3">
                {loading
                  ? [0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-20 rounded-xl bg-muted animate-pulse"
                      />
                    ))
                  : signals.map((s) => (
                      <SignalCard key={s.id} signal={s} compact />
                    ))}
              </div>

              <Link
                to="/intelligence-feed"
                className="mt-4 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
              >
                View all live intelligence <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}