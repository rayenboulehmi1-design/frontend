import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Crown, Receipt, Check, Eye, Lock } from "lucide-react";
import { DEMO_USER } from "@/lib/demoData";
import { useDemoLink } from "@/lib/demoMode";

export default function DemoAccountOverview() {
  const demoLink = useDemoLink();
  const tier = DEMO_USER.subscription_tier || "Pro";
  const initial = DEMO_USER.full_name[0].toUpperCase();
  const memberSince = new Date(DEMO_USER.created_date).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="p-5 sm:p-8 max-w-4xl mx-auto">
      <Link to={demoLink("/dashboard")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      <div className="flex items-center gap-3 mb-8">
        <CreditCard className="w-5 h-5 text-blue-600" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Account Overview</h1>
      </div>

      <div className="mb-6 p-4 rounded-xl flex items-center gap-3 text-sm bg-amber-50 text-amber-700 border border-amber-100">
        <Eye className="w-4 h-4 shrink-0" />
        Demo mode — billing actions are disabled. No real charges or account changes will occur.
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 bg-white p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-blue-600">{initial}</span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 truncate">{DEMO_USER.full_name}</p>
            <p className="text-sm text-slate-500 truncate">{DEMO_USER.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400">Member since {memberSince}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-400 capitalize">{DEMO_USER.role}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl border border-slate-100 bg-white p-6 mb-6">
        <div className="flex items-center gap-2 mb-4"><Crown className="w-4 h-4 text-slate-400" /><h2 className="font-semibold text-slate-900">Subscription</h2></div>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900">{tier}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">Active</span>
            </div>
            <p className="text-sm text-slate-400 mt-1">You have access to all premium features.</p>
          </div>
          <button disabled className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-400 text-sm font-semibold cursor-not-allowed">
            <Lock className="w-4 h-4" /> Manage Plan
          </button>
        </div>
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
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-slate-100 bg-white p-6 mb-6">
        <div className="flex items-center gap-2 mb-4"><Receipt className="w-4 h-4 text-slate-400" /><h2 className="font-semibold text-slate-900">Payment History</h2></div>
        <div className="text-center py-10">
          <Receipt className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No payment history in demo mode.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-slate-100 bg-white p-6">
        <div className="flex items-center gap-2 mb-4"><CreditCard className="w-4 h-4 text-slate-400" /><h2 className="font-semibold text-slate-900">Billing Details</h2></div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Billing management is disabled in demo mode.</p>
          <button disabled className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-400 cursor-not-allowed">
            <Lock className="w-4 h-4" /> Manage Billing
          </button>
        </div>
      </motion.div>
    </div>
  );
}