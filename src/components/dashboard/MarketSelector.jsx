import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Search, ChevronDown, Check } from "lucide-react";

const GCC_COUNTRIES = ["Qatar", "Saudi Arabia", "United Arab Emirates", "UAE", "Kuwait", "Bahrain", "Oman"];
const STORAGE_KEY = "scouty_selected_market_v1";

export function getStoredMarket() {
  try { return localStorage.getItem(STORAGE_KEY) || "Global"; } catch { return "Global"; }
}

export function setStoredMarket(market) {
  try { localStorage.setItem(STORAGE_KEY, market); } catch {}
}

export default function MarketSelector({ value, onChange, signals }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Derive all countries from signals
  const signalCountries = React.useMemo(() => {
    const set = new Set();
    (signals || []).forEach((s) => {
      if (s.country) set.add(s.country);
      else if (s.location) {
        const parts = s.location.split(",");
        const c = parts[parts.length - 1].trim();
        if (c && c !== "Global") set.add(c);
      }
    });
    return Array.from(set).sort();
  }, [signals]);

  const gcc = signalCountries.filter((c) => GCC_COUNTRIES.includes(c));
  const others = signalCountries.filter((c) => !GCC_COUNTRIES.includes(c));

  const filtered = (list) => search ? list.filter((c) => c.toLowerCase().includes(search.toLowerCase())) : list;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border whitespace-nowrap transition-colors ${
          value !== "Global" ? "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
        }`}
      >
        <Globe className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate max-w-[140px]">{value}</span>
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-1 left-0 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-30 overflow-hidden"
          >
            <div className="p-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search markets..."
                  className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto py-1">
              <MarketItem label="Global" value={value} onSelect={(v) => { onChange(v); setOpen(false); }} />
              {filtered(gcc).length > 0 && <GroupLabel label="GCC Countries" />}
              {filtered(gcc).map((c) => <MarketItem key={c} label={c} value={value} onSelect={(v) => { onChange(v); setOpen(false); }} />)}
              {filtered(others).length > 0 && <GroupLabel label="All Countries" />}
              {filtered(others).map((c) => <MarketItem key={c} label={c} value={value} onSelect={(v) => { onChange(v); setOpen(false); }} />)}
              {filtered(gcc).length === 0 && filtered(others).length === 0 && (
                <p className="px-3 py-4 text-sm text-slate-400 text-center">No markets found</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GroupLabel({ label }) {
  return <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-300 dark:text-slate-600">{label}</p>;
}

function MarketItem({ label, value, onSelect }) {
  return (
    <button
      onClick={() => onSelect(label)}
      className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
        value === label ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50/50 dark:bg-blue-950/30" : "text-slate-600 dark:text-slate-300"
      }`}
    >
      {label}
      {value === label && <Check className="w-3.5 h-3.5" />}
    </button>
  );
}