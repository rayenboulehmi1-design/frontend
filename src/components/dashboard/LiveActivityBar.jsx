import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

export default function LiveActivityBar({ liveCount }) {
  const [counter, setCounter] = useState(() => 44000 + Math.floor(Math.random() * 2000));

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev + (3 + Math.floor(Math.random() * 15)));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3">
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Scouty is actively scanning global markets</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            AI engine online · {liveCount} live opportunities tracked · {counter.toLocaleString()} signals processed
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 self-start sm:self-auto">
        <Cpu className="w-3.5 h-3.5" />
        <span className="text-xs font-bold">Online</span>
      </div>
    </motion.div>
  );
}