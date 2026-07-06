import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Scouty's signal clustering gave us a 3-week head start on a major industrial acquisition. It paid for itself in one deal.",
    name: "Marcus T.",
    role: "Director of Acquisitions, Apex Capital",
  },
  {
    quote:
      "It literally feels like having an analyst floor working 24/7. The dashboard is our morning ritual now.",
    name: "Sarah L.",
    role: "VP Expansion, Meridian Retail Group",
  },
  {
    quote:
      "We stopped cold calling. Now we only reach out when Scouty flags a high-confidence intent signal. Win rates doubled.",
    name: "David C.",
    role: "Managing Partner, Crestline Ventures",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-28 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 text-center mb-14"
        >
          Trusted by top dealmakers.
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-slate-100 bg-[#fcfcfc] p-7 hover:shadow-lg transition-all"
            >
              <Quote className="w-7 h-7 text-blue-200 mb-4" />
              <p className="text-slate-700 leading-relaxed mb-6">"{t.quote}"</p>
              <div>
                <div className="font-semibold text-slate-900">{t.name}</div>
                <div className="text-sm text-slate-400 mt-0.5">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}