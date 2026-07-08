import React from "react";
import { Link } from "react-router-dom";
import { Users, ArrowRight, Database } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import EnginePlaceholder from "@/components/opportunity/EnginePlaceholder";

export default function MissionLeadsSection({ mission, matchingSignals }) {
  const demoLink = useDemoLink();
  const opportunityCount = matchingSignals?.length || 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900">Leads from Mission Opportunities</h3>
        </div>
        <Link to={demoLink("/leads")} className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Relationship flow */}
      <div className="flex items-center gap-1 text-xs text-slate-400 mb-4 flex-wrap">
        <span className="font-medium text-slate-500">Mission</span>
        <ArrowRight className="w-2.5 h-2.5" />
        <span>Opportunities ({opportunityCount})</span>
        <ArrowRight className="w-2.5 h-2.5" />
        <span>Companies</span>
        <ArrowRight className="w-2.5 h-2.5" />
        <span>Decision Makers</span>
        <ArrowRight className="w-2.5 h-2.5" />
        <span>Leads</span>
      </div>

      <EnginePlaceholder message="Leads generated from this mission's matching opportunities will appear here when the Leads Intelligence Engine is connected. Each matching opportunity can produce relevant company matches and verified decision-maker leads." />
    </div>
  );
}