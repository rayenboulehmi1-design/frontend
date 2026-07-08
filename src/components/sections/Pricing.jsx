import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const tiers = [
  {
    name: "Pro",
    tagline: "For individual professionals discovering opportunities",
    price: 79,
    features: [
      "Opportunity intelligence — limited",
      "Basic confidence scores",
      "Limited search & filters",
      "Up to 5 saved opportunities",
      "1 active alert",
      "Limited AI opportunity analysis",
      "Basic geographic & category intelligence preview",
      "Short historical intelligence window",
      "Very limited data export",
    ],
    popular: true,
    teamSeats: 0,
  },
  {
    name: "Pro+",
    tagline: "Advanced intelligence for serious dealmakers",
    price: 199,
    features: [
      "Everything in Pro, significantly deeper",
      "Advanced opportunity intelligence & details",
      "Advanced confidence analysis",
      "Advanced evidence and sources",
      "Higher saved opportunities & alerts",
      "More active missions",
      "Advanced AI opportunity analysis",
      "Full geographic & category intelligence",
      "Extended historical intelligence",
      "Limited data export",
      "Limited Leads Provider Agent access",
      "Limited decision-maker discovery",
      "Limited contact enrichment",
      "Limited AI outreach assistance",
      "Advanced personal Opportunity CRM (coming soon)",
      "Priority support",
    ],
    popular: false,
  },
  {
    name: "Agency",
    tagline: "The fullest workspace for agencies and small teams",
    price: 399,
    features: [
      "Everything in Pro+",
      "Full intelligence access across all modules",
      "Full evidence, sources & confidence analysis",
      "Highest saved opportunities, alerts & missions",
      "Full AI opportunity analysis",
      "Full data export (fair-use limits)",
      "Full Leads Provider Agent (fair-use limits)",
      "Decision-maker discovery & contact enrichment",
      "AI outreach assistance",
      "Full Opportunity CRM (coming soon)",
      "CRM integrations (coming soon)",
      "API access (fair-use limits)",
      "Client workspaces & multiple client pipelines",
      "White-label reports",
      "Up to 3 team members",
      "Priority support",
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
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`text-4xl font-bold ${tier.popular ? "text-white" : "text-slate-900"}`}>
                  ${billing === "annual" ? Math.round(tier.price * 0.8) : tier.price}
                </span>
                <span className={`text-sm ${tier.popular ? "text-slate-400" : "text-slate-400"}`}>
                  /month
                </span>
              </div>
              {billing === "annual" && (
                <p className={`text-xs mb-4 ${tier.popular ? "text-blue-400" : "text-blue-600"}`}>
                  Billed annually (${Math.round(tier.price * 0.8) * 12}/year)
                </p>
              )}
              {tier.teamSeats > 0 && (
                <div className={`flex items-center gap-1.5 mb-6 text-xs ${tier.popular ? "text-slate-400" : "text-slate-500"}`}>
                  <Users className="w-3.5 h-3.5" />
                  Up to {tier.teamSeats} team {tier.teamSeats === 1 ? "member" : "members"}
                </div>
              )}
              {tier.teamSeats === 0 && <div className="mb-6" />}
              <Link
                to="/register"
                className={`block w-full text-center py-3 rounded-full text-sm font-semibold transition-colors mb-8 ${
                  tier.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                Get Started
              </Link>
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

        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-400">
          <Zap className="w-4 h-4 text-blue-500" />
          <span>New users get a 30-minute trial with broad access to core features</span>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
          ScoutyGo is a market intelligence and research platform. Plans include access to signal
          data, confidence scoring, alerts, and export tools. Confidence scores represent the
          platform's analytical assessment of public data and do not guarantee business outcomes.
          Subscriptions renew automatically until cancelled. Conduct your own due diligence before
          making business or financial decisions.
        </p>
      </div>
    </section>
  );
}