import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FilterDropdown({ label, icon: Icon, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const active = value !== "All";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border whitespace-nowrap transition-colors ${
          active ? "bg-primary/10 border-primary/20 text-primary" : "bg-card border-border text-muted-foreground hover:border-primary/30"
        }`}
      >
        {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
        <span className="truncate max-w-[80px]">{label}</span>
        {active && <span className="text-xs truncate max-w-[60px]">: {value}</span>}
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-1 left-0 w-52 rounded-xl bg-popover border border-border shadow-2xl z-30 py-1 max-h-64 overflow-y-auto"
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors ${
                  value === opt ? "text-primary font-medium bg-primary/5" : "text-muted-foreground"
                }`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}