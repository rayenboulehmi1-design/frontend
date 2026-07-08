import React from "react";
import { motion } from "framer-motion";
import { Search, BarChart3, Bell, Database, Download, Shield } from "lucide-react";

const capabilities = [
  {
    icon: Search,
    title: "Signal Discovery",
    description:
      "AI-assisted scanning of public registries, filings, and press releases to surface emerging market activity.",
  },
  {
    icon: BarChart3,
    title: "Confidence Scoring",
    description:
      "Each signal is scored based on corroboration across multiple sources — an analytical assessment, not a guarantee of outcome.",
  },
  {
    icon: Bell,
    title: "Custom Alerts",
    description:
      "Set alerts by category, location, and keywords to monitor the markets that matter to you.",
  },
  {
    icon: Database,
    title: "Structured Data",
    description:
      "Fragmented public information organized into searchable, filterable intelligence records.",
  },
  {
    icon: Download,
    title: "Data Export",
    description:
      "Export saved signals to CSV for integration with your existing research workflow.",
  },
  {
    icon: Shield,
    title: "Public Sources Only",
    description:
      "All data is sourced exclusively from publicly available information — no private or confidential data is used.",
  },
];

export default function PlatformCapabilities() {
  return (
    <section className="py-20 sm:py-28 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground"
          >
            Built for research-driven professionals.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-3 text-muted-foreground leading-relaxed"
          >
            ScoutyGo is a market intelligence and signal detection platform. Here's what you get when you subscribe.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-background p-7 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{cap.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cap.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}