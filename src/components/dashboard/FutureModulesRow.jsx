import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Radar, ArrowRight, Clock, Plus } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import { useEntitlement } from "@/hooks/useEntitlement";
import LockedFeature from "@/components/entitlement/LockedFeature";

export default function FutureModulesRow() {
  const demoLink = useDemoLink();
  const { checkAccess } = useEntitlement();
  const leadsAccess = checkAccess("leadsProvider");
  const crmAccess = checkAccess("opportunityCRM");

  const modules = [
    {
      key: "leads",
      title: "Leads Provider Agent",
      description: "AI-powered discovery of potential buyers and decision makers for each opportunity.",
      locked: leadsAccess === "LOCKED",
      featureKey: "leadsProvider",
      link: demoLink("/leads"),
    },
    {
      key: "crm",
      title: "Opportunity CRM",
      description: "Manage your opportunity pipeline from discovery to close with full deal tracking.",
      locked: crmAccess === "LOCKED",
      featureKey: "opportunityCRM",
      link: demoLink("/crm"),
    },
    {
      key: "reports",
      title: "Intelligence Reports",
      description: "Export executive intelligence briefs and opportunity analyses as shareable reports.",
      locked: true,
      featureKey: "dataExport",
      link: demoLink("/data-export"),
    },
    {
      key: "team",
      title: "Team Workspace",
      description: "Collaborate with your team on missions, leads, and opportunities with shared access.",
      locked: true,
      featureKey: "teamMembers",
      link: demoLink("/account-overview"),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {modules.map((mod) => (
        <div key={mod.key} className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-5">
          {mod.locked ? (
            <LockedFeature featureKey={mod.featureKey} title={mod.title} description={mod.description}>
              <div className="h-8" />
            </LockedFeature>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Radar className="w-4 h-4 text-blue-600" />
                </div>
                <Link to={mod.link} className="text-blue-600 hover:text-blue-700">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="text-sm font-bold text-slate-900 mb-1">{mod.title}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{mod.description}</p>
            </>
          )}
        </div>
      ))}
    </motion.div>
  );
}