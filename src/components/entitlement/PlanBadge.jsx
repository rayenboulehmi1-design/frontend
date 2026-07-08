import React from "react";
import { Link } from "react-router-dom";
import { Crown, ArrowRight } from "lucide-react";
import { useEntitlement } from "@/hooks/useEntitlement";
import { PLANS, PLAN_ORDER } from "@/lib/plans";

export default function PlanBadge({ size = "sm" }) {
  const { tier, plan } = useEntitlement();

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const colorClasses = {
    Free: "bg-slate-100 text-slate-600",
    Pro: "bg-blue-50 text-blue-700",
    'Pro+': "bg-violet-50 text-violet-700",
    Agency: "bg-amber-50 text-amber-700",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-bold ${sizeClasses[size]} ${colorClasses[tier] || colorClasses.Free}`}>
      {tier !== 'Free' && <Crown className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />}
      {tier}
    </span>
  );
}

export function UpgradeCard({ featureKey, title, description }) {
  const { tier, getUpgradePlan } = useEntitlement();
  const upgradePlan = getUpgradePlan(featureKey);

  if (!upgradePlan) return null;

  const upgradePlanConfig = PLANS[upgradePlan];

  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-violet-50 p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
          <Crown className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900">{title || `Upgrade to ${upgradePlan}`}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            {description || `Your ${tier} plan has limited access. ${upgradePlan} unlocks this feature and more.`}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Link
              to="/account-overview"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Upgrade to {upgradePlan} — ${upgradePlanConfig.price}/mo <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}