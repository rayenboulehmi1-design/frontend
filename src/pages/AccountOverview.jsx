import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Crown, Receipt, Loader2, Check, AlertCircle, Lock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useEntitlement } from "@/hooks/useEntitlement";
import { useDemoMode, useDemoLink } from "@/lib/demoMode";
import { PLANS, PLAN_ORDER } from "@/lib/plans";
import { startCheckout, openSubscriptionManagement } from "@/lib/paymentService";

export default function AccountOverview() {
  const isDemo = useDemoMode();
  const demoLink = useDemoLink();
  const { user: entUser, tier, loading: entLoading } = useEntitlement();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    if (isDemo) { setUser(entUser); setLoading(false); return; }
    base44.auth.me()
      .then(setUser)
      .catch(() => {})
      .finally(() => setLoading(false));

    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (status === "success") {
      setStatusMsg({ type: "success", text: "Payment successful! Your subscription is now active." });
    } else if (status === "cancelled") {
      setStatusMsg({ type: "error", text: "Checkout was cancelled. You can try again anytime." });
    }
    window.history.replaceState({}, "", "/account-overview");
  }, [isDemo, entUser]);

  const handleCheckout = async (planName) => {
    setCheckoutLoading(true);
    try {
      const { url } = await startCheckout(planName);
      window.location.href = url;
    } catch (err) {
      setStatusMsg({ type: "error", text: err.message || "Checkout failed. Please try again." });
    }
    setCheckoutLoading(false);
  };

  const handleSubscriptionManagement = async () => {
    setCheckoutLoading(true);
    try {
      const { url } = await openSubscriptionManagement();
      window.location.href = url;
    } catch (err) {
      setStatusMsg({ type: "error", text: err.message || "Failed to open subscription management." });
    }
    setCheckoutLoading(false);
  };

  if (loading || entLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  const currentUser = user || entUser;
  const currentTier = currentUser?.subscription_tier || 'Free';
  const currentPlan = PLANS[currentTier] || PLANS.Free;
  const initial = (currentUser?.full_name || currentUser?.email || "?")[0].toUpperCase();
  const memberSince = currentUser?.created_date
    ? new Date(currentUser.created_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  return (
    <div className="p-5 sm:p-8 max-w-4xl mx-auto">
      <Link to={demoLink("/dashboard")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <CreditCard className="w-5 h-5 text-blue-600" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Account Overview</h1>
      </div>

      {statusMsg && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm ${
          statusMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
        }`}>
          {statusMsg.type === "success" ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {statusMsg.text}
        </div>
      )}

      {/* Profile summary */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 bg-white p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-blue-600">{initial}</span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 truncate">{currentUser?.full_name || "—"}</p>
            <p className="text-sm text-slate-500 truncate">{currentUser?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400">Member since {memberSince}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-400 capitalize">{currentUser?.role}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Current subscription */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl border border-slate-100 bg-white p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-4 h-4 text-slate-400" />
          <h2 className="font-semibold text-slate-900">Current Subscription</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900">{currentTier}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                currentTier === 'Free' ? "bg-slate-100 text-slate-600" :
                currentTier === 'Pro' ? "bg-blue-50 text-blue-700" :
                currentTier === 'Pro+' ? "bg-violet-50 text-violet-700" :
                "bg-amber-50 text-amber-700"
              }`}>
                {currentTier === 'Free' ? 'Free Plan' : 'Active'}
              </span>
            </div>
            <div className="mt-1">
              <p className="text-sm text-slate-400">
                {currentTier === 'Free'
                  ? 'Upgrade to unlock intelligence, missions, and business development tools.'
                  : currentPlan.tagline}
              </p>
              {currentTier !== 'Free' && (
                <p className="text-xs text-slate-400 mt-2">
                  ${currentPlan.price}/month · Billed monthly · Renews automatically · Cancel anytime
                </p>
              )}
            </div>
          </div>
          {currentTier !== 'Free' && !isDemo && (
            <button
              onClick={handleSubscriptionManagement}
              disabled={checkoutLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors"
            >
              Manage Plan
            </button>
          )}
        </div>
      </motion.div>

      {/* Available plans */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-slate-100 bg-white p-6 mb-6">
        <h2 className="font-semibold text-slate-900 mb-1">Available Plans</h2>
        <p className="text-xs text-slate-400 mb-5">Choose the plan that fits your pipeline</p>
        <div className="space-y-3">
          {PLAN_ORDER.filter(p => p !== 'Free').map((planName) => {
            const plan = PLANS[planName];
            const isCurrent = currentTier === planName;
            const isUpgrade = PLAN_ORDER.indexOf(planName) > PLAN_ORDER.indexOf(currentTier);
            return (
              <div key={planName} className={`rounded-xl border p-4 ${isCurrent ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{planName}</span>
                      <span className="text-sm font-medium text-slate-500">${plan.price}/mo</span>
                      {isCurrent && <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">Current</span>}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{plan.tagline}</p>
                    {plan.teamSeats > 0 && <p className="text-xs text-slate-400 mt-0.5">Up to {plan.teamSeats} team members</p>}
                  </div>
                  <div>
                    {isCurrent ? (
                      <span className="text-xs font-medium text-slate-400">Active</span>
                    ) : isDemo ? (
                      <button disabled className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed">
                        <Lock className="w-3.5 h-3.5" /> Demo
                      </button>
                    ) : isUpgrade ? (
                      <button
                        onClick={() => handleCheckout(planName)}
                        disabled={checkoutLoading}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {checkoutLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Upgrade
                      </button>
                    ) : (
                      <button
                        onClick={handleSubscriptionManagement}
                        disabled={checkoutLoading}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:border-slate-300 transition-colors"
                      >
                        Switch
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-slate-400 leading-relaxed">
          ScoutyGo is a market intelligence and research tool. Confidence scores represent
          analytical assessments of public data and do not guarantee business outcomes. Conduct
          your own due diligence before making business or financial decisions.
        </p>
      </motion.div>

      {/* Payment history */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-slate-100 bg-white p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Receipt className="w-4 h-4 text-slate-400" />
          <h2 className="font-semibold text-slate-900">Payment History</h2>
        </div>
        <div className="text-center py-10">
          <Receipt className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No payments yet.</p>
          <p className="text-xs text-slate-300 mt-1">Your payment history will appear here once you subscribe.</p>
        </div>
      </motion.div>

      {/* Billing details */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-slate-100 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-4 h-4 text-slate-400" />
          <h2 className="font-semibold text-slate-900">Billing Details</h2>
        </div>
        {currentTier !== 'Free' && !isDemo ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Manage your billing details, update payment method, or cancel your subscription via Whop's secure portal.</p>
            <button
              onClick={handleSubscriptionManagement}
              disabled={checkoutLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors"
            >
              <CreditCard className="w-4 h-4" /> Manage Subscription
            </button>
          </div>
        ) : (
          <div className="text-center py-10">
            <CreditCard className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400 mb-4">No billing details on file.</p>
            {isDemo && (
              <p className="text-xs text-slate-300">Billing is disabled in demo mode.</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}