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
      "Isolated events mean nothing. Scouty clusters related signals to identify high-probability corporate intent before it's public.",
  },
  {
    number: "03",
    title: "Match",
    icon: Target,
    description:
      "Every opportunity is graded and matched to your saved markets and industries, filtering out noise and surfacing only validated fits.",
  },
  {
    number: "04",
    title: "Alert",
    icon: Bell,
    description:
      "Receive real-time alerts the moment a high-confidence opportunity is detected, with full analysis and contacts ready to go.",
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
            className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900"
          >
            How it works.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-3 text-slate-500 leading-relaxed"
          >
            Stop relying on stale databases. Scouty turns scattered public data into structured,
            actionable intelligence in near real time.
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
                <div className="rounded-2xl border border-slate-100 bg-white p-6 h-full hover:border-blue-200 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <Icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-2xl font-bold text-slate-100 group-hover:text-blue-100 transition-colors">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}