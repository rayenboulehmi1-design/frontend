import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Crown, ArrowRight, Eye } from "lucide-react";
import { useEntitlement } from "@/hooks/useEntitlement";
import { PLANS } from "@/lib/plans";

const ACCESS_CONFIG = {
  LOCKED: { icon: Lock, label: "Locked", color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-100" },
  PREVIEW: { icon: Eye, label: "Preview", color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
  LIMITED: { icon: Crown, label: "Limited", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100" },
  COMING_SOON: { icon: Eye, label: "Coming Soon", color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-100" },
  FULL: { icon: Crown, label: "Full Access", color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
};

export default function LockedFeature({ featureKey, title, description, children }) {
  const { tier, checkAccess, getUpgradePlan } = useEntitlement();
  const access = checkAccess(featureKey);
  const upgradePlan = getUpgradePlan(featureKey);
  const config = ACCESS_CONFIG[access] || ACCESS_CONFIG.LOCKED;
  const Icon = config.icon;

  // Full access — render children normally
  if (access === 'FULL') {
    return <>{children}</>;
  }

  // Limited access — render children with a subtle limit indicator
  if (access === 'LIMITED') {
    return (
      <div className="relative">
        {children}
        <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bg} ${config.color} border ${config.border}`}>
          <Icon className="w-3 h-3" />
          {config.label} on {tier}
          {upgradePlan && (
            <>
              <span className="text-slate-300">·</span>
              <Link to="/account-overview" className="underline hover:no-underline">Upgrade</Link>
            </>
          )}
        </div>
      </div>
    );
  }

  // Preview — show a blurred/teaser version with upgrade overlay
  if (access === 'PREVIEW') {
    return (
      <div className="relative">
        <div className="filter blur-[2px] pointer-events-none select-none opacity-60">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-slate-100 max-w-xs"
          >
            <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center mx-auto mb-3`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <p className="text-sm font-bold text-slate-900 mb-1">{title || 'Preview Mode'}</p>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              {description || `Your ${tier} plan includes a limited preview. Upgrade for full access.`}
            </p>
            {upgradePlan && (
              <Link
                to="/account-overview"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                Unlock with {upgradePlan} <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Locked or Coming Soon — show locked state
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border ${config.border} ${config.bg} p-6 text-center`}
    >
      <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center mx-auto mb-3 border ${config.border}`}>
        <Icon className={`w-6 h-6 ${config.color}`} />
      </div>
      <p className="text-sm font-bold text-slate-900 mb-1">{title || 'Premium Feature'}</p>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed max-w-sm mx-auto">
        {description || `This feature is available on higher plans. Upgrade to access it.`}
      </p>
      {access === 'COMING_SOON' ? (
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-medium">
          Coming Soon
        </span>
      ) : upgradePlan ? (
        <Link
          to="/account-overview"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
        >
          Unlock with {upgradePlan} <ArrowRight className="w-3 h-3" />
        </Link>
      ) : null}
    </motion.div>
  );
}