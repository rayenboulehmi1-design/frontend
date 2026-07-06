import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, Briefcase, TrendingUp, ArrowUpRight, MapPin } from "lucide-react";
import { base44 } from "@/api/base44Client";

const products = [
  {
    number: "01",
    tag: "Flagship Product",
    title: "Real Estate Intelligence.",
    description:
      "Track projects before launch. See where developers are building, permits are filed, and land is changing hands — from early planning through construction and completion.",
    features: [
      "Off-plan launches",
      "Residential developments",
      "Commercial developments",
      "Planning applications",
      "Building permits",
      "Land transactions",
      "Developer activity",
      "Construction milestones",
    ],
    stats: [
      { value: "1,010", label: "Property Records" },
      { value: "4", label: "Developers Observed" },
    ],
    icon: Building2,
    accent: "blue",
    category: "Real Estate",
  },
  {
    number: "02",
    tag: "Corporate Intent",
    title: "Business Deals.",
    description:
      "Find companies entering new markets. Track businesses for sale, acquisitions, partnerships, franchise expansion and corporate expansion before it's announced.",
    features: [
      "Businesses for sale",
      "Acquisitions",
      "Partnerships",
      "Franchise expansion",
      "Market entry",
      "Corporate expansion",
    ],
    stats: [
      { value: "13", label: "Active Deals" },
      { value: "3", label: "Markets Monitored" },
    ],
    icon: Briefcase,
    accent: "violet",
    category: "Business",
  },
  {
    number: "03",
    tag: "Market Expansion",
    title: "Investment Intelligence.",
    description:
      "Monitor investment and partnership activity. Follow funding rounds, joint ventures, strategic partnerships and institutional capital deployment as it happens.",
    features: [
      "Funding activity",
      "Joint ventures",
      "Investment announcements",
      "Strategic partnerships",
      "Development finance",
      "Institutional activity",
    ],
    stats: [
      { value: "0", label: "Opportunities" },
      { value: "0", label: "Entities Monitored" },
    ],
    icon: TrendingUp,
    accent: "emerald",
    category: "Investment",
  },
];

const accentMap = {
  blue: { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100", dot: "bg-blue-600" },
  violet: { text: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100", dot: "bg-violet-600" },
  emerald: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", dot: "bg-emerald-600" },
};

export default function FlagshipProducts() {
  const [allSignals, setAllSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Signal.list("-created_date", 200)
      .then(setAllSignals)
      .catch(() => setAllSignals([]))
      .finally(() => setLoading(false));
  }, []);

  const signalsByCategory = useMemo(() => {
    const map = {};
    allSignals.forEach((s) => {
      if (!s.category) return;
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return map;
  }, [allSignals]);

  const getStats = (category) => {
    const items = signalsByCategory[category] || [];
    const entities = new Set(items.map((s) => s.entity_name).filter(Boolean));
    return [
      { value: items.length.toLocaleString(), label: "Live Signals" },
      { value: entities.size.toLocaleString(), label: "Entities Tracked" },
    ];
  };

  return (
    <section id="products" className="py-20 sm:py-28 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-20">
        {products.map((product, idx) => {
          const a = accentMap[product.accent];
          const Icon = product.icon;
          const reversed = idx % 2 === 1;
          const productSignals = (signalsByCategory[product.category] || []).slice(0, 4);

          return (
            <motion.div
              key={product.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                reversed ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-bold text-slate-300">{product.number}</span>
                  <span className={`text-xs font-semibold uppercase tracking-wide ${a.text}`}>
                    {product.tag}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
                  {product.title}
                </h2>
                <p className="text-slate-500 leading-relaxed mb-6">{product.description}</p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {product.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex gap-8">
                  {getStats(product.category).map((stat) => (
                    <div key={stat.label}>
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-xs text-slate-400 uppercase tracking-wide mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:gap-2.5 transition-all">
                  Explore {product.title.replace(".", "")} <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className={`rounded-3xl ${a.bg} ${a.border} border p-8 lg:p-10`}>
                <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm`}>
                  <Icon className={`w-7 h-7 ${a.text}`} />
                </div>
                <div className="space-y-3">
                  {loading
                    ? [0, 1, 2, 3].map((i) => (
                        <div key={i} className="h-16 rounded-xl bg-white/70 animate-pulse" />
                      ))
                    : productSignals.length === 0
                    ? <p className="text-sm text-slate-400 py-8 text-center">No active signals in this market right now — check back soon.</p>
                    : productSignals.map((signal, i) => (
                        <div key={signal.id} className="flex items-center gap-3 p-4 rounded-xl bg-white/70 backdrop-blur-sm">
                          <span className={`w-2 h-2 rounded-full ${a.dot} shrink-0 ${i === 0 ? "animate-pulse" : ""}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{signal.title}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{signal.location}{signal.entity_name ? ` • ${signal.entity_name}` : ""}</span>
                            </div>
                          </div>
                          <span className="text-xs text-slate-400 font-medium shrink-0">{signal.time_ago}</span>
                        </div>
                      ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}