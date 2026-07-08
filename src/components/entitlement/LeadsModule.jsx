import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Building2, ArrowRight, Lock } from "lucide-react";
import { useEntitlement } from "@/hooks/useEntitlement";
import { useDemoLink } from "@/lib/demoMode";

export default function LeadsModule({ deal }) {
  const { tier, checkAccess } = useEntitlement();
  const demoLink = useDemoLink();
  const access = checkAccess('leadsProvider');

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-bold text-slate-900">Decision Makers & Leads</h3>
      </div>

      {access === 'FULL' || access === 'LIMITED' ? (
        <div className="text-center py-8">
          <Building2 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-1">No leads discovered yet</p>
          <p className="text-xs text-slate-300">Leads Provider Agent will find decision makers for this opportunity</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-sm font-semibold text-slate-700 mb-1">Leads Provider Agent</p>
          <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto leading-relaxed">
            Discover decision makers, verify contacts, and get AI-assisted outreach for this opportunity.
          </p>
          <Link
            to={demoLink("/account-overview")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            {tier === 'Pro' ? 'Unlock with Pro+' : 'Unlock with Agency'} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}