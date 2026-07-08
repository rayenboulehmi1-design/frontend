import React from "react";
import { motion } from "framer-motion";
import { Search, BrainCircuit, Target, Bell } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Scout",
    icon: Search,
    description:
      "Our systems constantly scan millions of data points across public registries, job boards, press releases, and filings.",
  },
  {
    number: "02",
    title: "Analyze",
    icon: BrainCircuit,
    description:
      "Isolated events mean little on their own. Scouty clusters related signals to identify potential corporate intent before it's widely known.",
  },
  {
    number: "03",
    title: "Match",
    icon: Target,
    description:
      "Every signal is scored and matched to your saved markets and industries, filtering out noise and surfacing relevant opportunities for your review.",
  },
  {
    number: "04",
    title: "Alert",
    icon: Bell,
    description:
      "Receive alerts when a signal matching your criteria is detected, with analysis and context to support your own research.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground"
          >
            How it works.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-3 text-muted-foreground leading-relaxed"
          >
            Stop relying on stale databases. Scouty turns scattered public data into structured,
            searchable intelligence — updated regularly.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative group"
              >
                <div className="rounded-2xl border border-border bg-card p-6 h-full hover:border-primary/30 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <span className="text-2xl font-bold text-muted/50 group-hover:text-primary/20 transition-colors">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}