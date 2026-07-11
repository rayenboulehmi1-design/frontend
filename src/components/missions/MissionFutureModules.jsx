import React from "react";
import { Link } from "react-router-dom";
import { Users, GitBranch, ArrowRight } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import { useEntitlement } from "@/hooks/useEntitlement";
import LockedFeature from "@/components/entitlement/LockedFeature";

export default function MissionFutureModules({ mission }) {
  const demoLink = useDemoLink();
  const { checkAccess } = useEntitlement();
  const leadsAccess = checkAccess("leadsProvider");
  const crmAccess = checkAccess("opportunityCRM");

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {/* Future Leads */}
      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-5">
        {leadsAccess === "FULL" || leadsAccess === "LIMITED" ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">
                <Users className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <Link to={demoLink("/leads")} className="text-violet-600 dark:text-violet-400 hover:text-violet-700">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Leads Pipeline</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed mb-3">
              Discover relevant companies and decision makers from matching opportunities
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-300 dark:text-slate-600">
              <span>Mission</span>
              <ArrowRight className="w-2.5 h-2.5" />
              <span>Opportunity</span>
              <ArrowRight className="w-2.5 h-2.5" />
              <span>Companies</span>
              <ArrowRight className="w-2.5 h-2.5" />
              <span>Leads</span>
            </div>
          </>
        ) : (
          <LockedFeature featureKey="leadsProvider" title="Leads Pipeline" description="Discover relevant companies and decision makers from matching opportunities. Available on Pro+ and higher.">
            <div className="h-8" />
          </LockedFeature>
        )}
      </div>

      {/* Future CRM */}
      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-5">
        {crmAccess === "FULL" || crmAccess === "LIMITED" ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center">
                <GitBranch className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Link to={demoLink("/crm")} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">CRM Pipeline</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed mb-3">
              Track matched opportunities from discovery through to outcome
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-300 dark:text-slate-600">
              <span>Opportunity</span>
              <ArrowRight className="w-2.5 h-2.5" />
              <span>Pipeline</span>
              <ArrowRight className="w-2.5 h-2.5" />
              <span>Tasks</span>
              <ArrowRight className="w-2.5 h-2.5" />
              <span>Outcome</span>
            </div>
          </>
        ) : (
          <LockedFeature featureKey="opportunityCRM" title="CRM Pipeline" description="Track matched opportunities from discovery through to outcome. Available on Pro+ and higher.">
            <div className="h-8" />
          </LockedFeature>
        )}
      </div>
    </div>
  );
}