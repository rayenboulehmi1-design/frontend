import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What exactly is Scouty?",
    a: "Scouty is a market intelligence platform that scans millions of public data points across global markets — real estate filings, business registrations, contract awards, press releases and more — then clusters them into actionable opportunities before they become widely known.",
  },
  {
    q: "How do the confidence scores work?",
    a: "Every signal is graded by our AI based on the number and quality of corroborating data points, the recency of activity, and historical patterns. A 75% confidence score means our system has identified multiple independent signals pointing to the same corporate intent.",
  },
  {
    q: "Where do you get your data?",
    a: "We aggregate exclusively from public sources: government registries, planning portals, procurement databases, company filings, job boards, and press releases. No private or confidential data is ever used.",
  },
  {
    q: "How does billing work?",
    a: "Plans are billed monthly or annually. You can upgrade, downgrade, or cancel at any time. Annual plans receive a 20% discount. All plans include a full-feature trial period so you can evaluate the platform before committing.",
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-slate-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
          {faq.q}
        </span>
        <div className="shrink-0 ml-4 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
          {isOpen ? (
            <Minus className="w-4 h-4 text-slate-500" />
          ) : (
            <Plus className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-12 text-sm text-slate-500 leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-20 sm:py-28 bg-white border-y border-slate-100">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-center mb-12"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="border-t border-slate-100">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}