import React from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, CheckCircle2, RefreshCw, Clock, WifiOff } from "lucide-react";

const STATES = {
  loading: {
    icon: Loader2,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    label: "Connecting to Intelligence Engine...",
    dotClass: "bg-blue-400",
    spin: true,
  },
  success: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    label: "Live Intelligence Connected",
    dotClass: "bg-emerald-500",
    spin: false,
  },
  error: {
    icon: WifiOff,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
    label: "Intelligence Engine Unavailable",
    dotClass: "bg-rose-500",
    spin: false,
  },
  empty: {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    label: "No Intelligence Data Available",
    dotClass: "bg-amber-400",
    spin: false,
  },
};

export default function IntelligenceHealth({ status, lastUpdated, onRetry }) {
  const config = STATES[status] || STATES.loading;
  const Icon = config.icon;

  const updatedText = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border ${config.border} dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
    >
      <div className="flex items-center gap-3">
        <div className={`relative flex h-2.5 w-2.5 shrink-0`}>
          {status === "success" && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          )}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.dotClass}`} />
        </div>
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${config.color} ${config.spin ? "animate-spin" : ""}`} />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{config.label}</p>
            <p className="text-xs text-slate-400">
              {status === "success" && "Real-time intelligence stream active"}
              {status === "loading" && "Fetching latest opportunities and signals"}
              {status === "error" && (updatedText ? `Last successful update ${updatedText}` : "Connection failed — retrying available")}
              {status === "empty" && "Engine connected but no data returned"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {updatedText && status !== "error" && (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" /> Updated {updatedText}
          </span>
        )}
        {status === "error" && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        )}
      </div>
    </motion.div>
  );
}