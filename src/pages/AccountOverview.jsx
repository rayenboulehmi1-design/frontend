import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Crown, Receipt, Loader2, Check, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const PRO_PRICE_ID = "price_1TqensROHfyHuQABkBuMWoWw";

export default function AccountOverview() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => {})
      .finally(() => setLoading(false));

    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (status === "success") {
      setStatusMsg({ type: "success", text: "Payment successful! Your Pro subscription is now active." });
    } else if (status === "cancelled") {
      setStatusMsg({ type: "error", text: "Checkout was cancelled. You can try again anytime." });
    }
    window.history.replaceState({}, "", "/account-overview");
  }, []);

  const handleCheckout = async () => {
    // Block checkout if running inside an iframe (e.g. Base44 preview)
    if (window.self !== window.top) {
      setStatusMsg({ type: "error", text: "Checkout works only from a published app. Please open the app in a new tab to subscribe." });
      return;
    }

    setCheckoutLoading(true);
    try {
      const res = await base44.functions.invoke("createCheckout", {
        priceId: PRO_PRICE_ID,
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setStatusMsg({ type: "error", text: "Could not start checkout. Please try again." });
      }
    } catch (err) {
      setStatusMsg({ type: "error", text: err.message || "Checkout failed. Please try again." });
    }
    setCheckoutLoading(false);
  };

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
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                tier === "Pro" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
              }`}>{tier === "Pro" ? "Active" : "Current Plan"}</span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {tier === "Free"
                ? "Upgrade to Pro for $49/mo — unlimited signals, advanced filters, and CSV export."
                : "You have access to all premium features."}
            </p>
          </div>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {checkoutLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {tier === "Free" ? "Upgrade to Pro" : "Manage Plan"}
          </button>
        </div>

        {tier === "Free" && (
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {[
              { label: "Unlimited Signals", pro: true },
              { label: "Advanced Filters", pro: true },
              { label: "CSV Export", pro: true },
            ].map((feat) => (
              <div key={feat.label} className="flex items-center gap-2 text-sm">
                <Check className={`w-4 h-4 ${feat.pro ? "text-emerald-500" : "text-slate-300"}`} />
                <span className={feat.pro ? "text-slate-700" : "text-slate-400"}>{feat.label}</span>
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
        {tier === "Pro" ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Manage your billing details, update payment method, or cancel your subscription via Stripe's secure portal.</p>
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors"
            >
              <CreditCard className="w-4 h-4" /> Manage Billing
            </button>
          </div>
        ) : (
          <div className="text-center py-10">
            <CreditCard className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400 mb-4">No billing details on file.</p>
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              Add Billing Details
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}