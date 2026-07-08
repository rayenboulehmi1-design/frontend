import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X } from "lucide-react";
import { useEntitlement } from "@/hooks/useEntitlement";

/**
 * Trial banner component.
 * 
 * Frontend preview only. Secure trial enforcement requires:
 * - Server-side trial_start and trial_expiry on the User entity
 * - Server returns remaining time via authenticated API
 * - Browser time is NOT the source of truth
 * - One trial per email (enforced server-side)
 * - One trial per device fingerprint (enforced server-side where possible)
 * - Timer continues even if browser is closed (server-calculated on next API call)
 */
export default function TrialBanner() {
  const { trial, loading } = useEntitlement();
  const [dismissed, setDismissed] = useState(false);

  if (loading || !trial.isActive || dismissed) return null;

  const minutes = Math.floor(trial.secondsLeft / 60);
  const seconds = trial.secondsLeft % 60;
  const isExpiringSoon = minutes < 5;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`flex items-center justify-between gap-3 px-4 py-2.5 ${isExpiringSoon ? 'bg-rose-500' : 'bg-blue-600'} text-white`}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium">
            Trial active — {minutes}m {seconds}s remaining
          </span>
          {isExpiringSoon && (
            <span className="text-xs text-white/80 hidden sm:inline">Choose a plan to keep your access</span>
          )}
        </div>
        <button onClick={() => setDismissed(true)} className="p-1 rounded hover:bg-white/20 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}