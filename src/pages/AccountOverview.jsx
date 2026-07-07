import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Crown, Receipt, User, Loader2, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AccountOverview() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  const tier = user?.subscription_tier || "Free";
  const initial = (user?.full_name || user?.email || "?")[0].toUpperCase();
  const memberSince = user?.created_date
    ? new Date(user.created_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  return (
    <div className="p-5 sm:p-8 max-w-4xl mx-auto">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <CreditCard className="w-5 h-5 text-blue-600" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Account Overview</h1>
      </div>

      {/* Profile summary */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 bg-white p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-blue-600">{initial}</span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 truncate">{user?.full_name || "—"}</p>
            <p className="text-sm text-slate-500 truncate">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400">Member since {memberSince}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-400 capitalize">{user?.role}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Subscription tier */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl border border-slate-100 bg-white p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-4 h-4 text-slate-400" />
          <h2 className="font-semibold text-slate-900">Subscription</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900">{tier}</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">Current Plan</span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {tier === "Free"
                ? "Upgrade to unlock unlimited signals, advanced filters, and export."
                : "You have access to all premium features."}
            </p>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
            {tier === "Free" ? "Upgrade Plan" : "Manage Plan"}
          </button>
        </div>

        {tier === "Free" && (
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {[
              { label: "Unlimited Signals", free: false },
              { label: "Advanced Filters", free: false },
              { label: "CSV Export", free: false },
            ].map((feat) => (
              <div key={feat.label} className="flex items-center gap-2 text-sm">
                <Check className={`w-4 h-4 ${feat.free ? "text-emerald-500" : "text-slate-300"}`} />
                <span className={feat.free ? "text-slate-700" : "text-slate-400"}>{feat.label}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Payment history */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-slate-100 bg-white p-6 mb-6">
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
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-slate-100 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-4 h-4 text-slate-400" />
          <h2 className="font-semibold text-slate-900">Billing Details</h2>
        </div>
        <div className="text-center py-10">
          <CreditCard className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-4">No billing details on file.</p>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
            <CreditCard className="w-4 h-4" /> Update Billing Details
          </button>
        </div>
      </motion.div>

      <div className="mt-6 rounded-xl bg-slate-50 border border-slate-100 p-4">
        <p className="text-xs text-slate-400">
          Subscription management, payment history, and billing details require a payment integration.
          See the Stripe setup suggestion to enable live billing.
        </p>
      </div>
    </div>
  );
}