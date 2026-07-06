import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

const tiers = [
  {
    name: "Scout",
    tagline: "For individual dealmakers testing the waters",
    price: 49,
    features: [
      "Full AI deal analysis & confidence scoring",
      "Public business contacts & decision makers",
      "Deal timelines & procurement predictions",
      "Up to 2 active missions",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    tagline: "For teams actively closing new business",
    price: 149,
    features: [
      "Everything in Scout",
      "AI-generated outreach drafts",
      "Unlimited active missions",
      "Priority instant alerts",
      "CRM export & integrations",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    tagline: "For organizations scaling deal flow company-wide",
    price: 399,
    features: [
      "Everything in Professional",
      "Unlimited team seats",
      "Custom market coverage",
      "Dedicated account manager",
      "API access",
      "SLA-backed support",
    ],
    popular: false,
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");

  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900"
          >
            Transparent access.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-3 text-slate-500"
          >
            Choose the intelligence tier that fits your pipeline.
          </motion.p>

          <div className="inline-flex items-center gap-1 p-1 mt-6 rounded-full bg-slate-100">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                billing === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                billing === "annual" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Annual <span className="text-blue-600">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`relative rounded-3xl p-8 transition-all ${
                tier.popular
                  ? "bg-slate-950 text-white shadow-2xl scale-[1.02] border border-slate-800"
                  : "bg-white border border-slate-100 hover:shadow-lg"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </div>
              )}
              <h3 className={`text-lg font-bold ${tier.popular ? "text-white" : "text-slate-900"}`}>
                {tier.name}
              </h3>
              <p className={`text-sm mt-1 mb-6 ${tier.popular ? "text-slate-400" : "text-slate-500"}`}>
                {tier.tagline}
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-4xl font-bold ${tier.popular ? "text-white" : "text-slate-900"}`}>
                  ${billing === "annual" ? Math.round(tier.price * 0.8) : tier.price}
                </span>
                <span className={`text-sm ${tier.popular ? "text-slate-400" : "text-slate-400"}`}>
                  /month
                </span>
              </div>
              <button
                className={`w-full py-3 rounded-full text-sm font-semibold transition-colors mb-8 ${
                  tier.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                Get Started
              </button>
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        tier.popular ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <span className={`text-sm ${tier.popular ? "text-slate-300" : "text-slate-600"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}