import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const tiers = [
  {
    name: "Scout",
    tagline: "For individual dealmakers testing the waters",
    price: 49,
    features: [
      "AI-assisted confidence scoring",
      "Company & entity tracking",
      "Signal summaries & market context",
      "Up to 2 active alerts",
      "Email support",
    ],
    popular: true,
  },
  {
    name: "Professional",
    tagline: "For teams actively closing new business",
    price: 149,
    features: [
      "Everything in Scout",
      "AI-generated outreach drafts (Coming Soon)",
      "Unlimited active alerts",
      "Priority instant alerts",
      "CRM export & integrations",
      "Priority support",
    ],
    popular: false,
    status: "coming_soon",
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
    status: "contact_us",
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
            className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground"
          >
            Transparent access.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-3 text-muted-foreground"
          >
            Choose the intelligence tier that fits your pipeline.
          </motion.p>

          <div className="inline-flex items-center gap-1 p-1 mt-6 rounded-full bg-muted">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                billing === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                billing === "annual" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Annual <span className="text-primary">-20%</span>
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
                  ? "bg-foreground text-background shadow-2xl scale-[1.02] border border-foreground"
                  : "bg-card border border-border hover:shadow-lg"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </div>
              )}
              <h3 className={`text-lg font-bold ${tier.popular ? "text-background" : "text-foreground"}`}>
                {tier.name}
              </h3>
              <p className={`text-sm mt-1 mb-6 ${tier.popular ? "text-background/60" : "text-muted-foreground"}`}>
                {tier.tagline}
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-4xl font-bold ${tier.popular ? "text-background" : "text-foreground"}`}>
                  ${billing === "annual" ? Math.round(tier.price * 0.8) : tier.price}
                </span>
                <span className={`text-sm ${tier.popular ? "text-background/60" : "text-muted-foreground/70"}`}>
                  /month
                </span>
              </div>
              {tier.status === "coming_soon" ? (
                <div className="block w-full text-center py-3 rounded-full text-sm font-semibold mb-8 border border-border text-muted-foreground/70 bg-muted cursor-not-allowed">
                  Coming Soon
                </div>
              ) : tier.status === "contact_us" ? (
                <div className="block w-full text-center py-3 rounded-full text-sm font-semibold mb-8 border border-border text-muted-foreground bg-card">
                  Contact Us
                </div>
              ) : (
                <Link
                  to="/register"
                  className={`block w-full text-center py-3 rounded-full text-sm font-semibold transition-colors mb-8 ${
                    tier.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  Get Started
                </Link>
              )}
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        tier.popular ? "text-primary" : "text-primary"
                      }`}
                    />
                    <span className={`text-sm ${tier.popular ? "text-background/80" : "text-muted-foreground"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground/70 max-w-2xl mx-auto leading-relaxed">
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