import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, Building2, ArrowRight } from "lucide-react";
import { useSavedOpportunities } from "@/hooks/useSavedOpportunities";
import { useDemoLink } from "@/lib/demoMode";
import ConfidenceBadge from "@/components/dashboard/ConfidenceBadge";
import { getTypeStyle } from "@/lib/dealUtils";

export default function WatchlistModule() {
  const { saved } = useSavedOpportunities();
  const demoLink = useDemoLink();

  if (saved.length === 0) return null;

  const topSaved = saved.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid lg:grid-cols-2 gap-4 mb-6"
    >
      {/* Saved Opportunities */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Saved Opportunities</h3>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">{saved.length}</span>
          </div>
          <Link to={demoLink("/saved")} className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:gap-2 transition-all">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {topSaved.map((deal) => {
            const typeStyle = getTypeStyle(deal.type || deal.category);
            return (
              <Link
                key={deal.id}
                to={demoLink(`/opportunities/${deal.id}`)}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
              >
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${typeStyle.badge} shrink-0`}>
                  {deal.type || deal.category}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {deal.company || deal.entity_name || deal.title}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{deal.country || deal.location}</p>
                </div>
                {deal.confidence != null && <ConfidenceBadge score={deal.confidence} size="sm" />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Followed Companies — Coming Soon */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900">Followed Companies</h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 text-xs font-bold">0</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Building2 className="w-8 h-8 text-slate-200 mb-2" />
          <p className="text-sm text-slate-400 mb-1">Company tracking coming soon</p>
          <p className="text-xs text-slate-300">Follow companies to monitor their latest activity</p>
        </div>
      </div>
    </motion.div>
  );
}