import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-slate-950 px-8 py-16 sm:px-16 sm:py-24 text-center"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto leading-tight">
              Ready to uncover what's next?
            </h2>
            <p className="mt-5 text-slate-400 max-w-xl mx-auto leading-relaxed">
              Join professionals using ScoutyGo to monitor the market and discover opportunities earlier.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-xl shadow-blue-600/30 group">
                Get Access Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/intelligence-feed" className="text-slate-300 font-medium hover:text-white transition-colors">
                Browse Intelligence
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}