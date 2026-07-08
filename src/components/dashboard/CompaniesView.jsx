import React from "react";
import { Building2 } from "lucide-react";
import ConfidenceBadge from "@/components/dashboard/ConfidenceBadge";
import { getTypeStyle } from "@/lib/dealUtils";

export default function CompaniesView({ companies, onSelect }) {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {companies.map((co) => {
        const typeStyle = getTypeStyle(co.signals[0]?.type || co.signals[0]?.category);
        return (
          <div
            key={co.name}
            onClick={() => onSelect(co.name)}
            className="rounded-2xl border border-border bg-card p-5 hover:shadow-lg hover:border-primary/30 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-foreground truncate">{co.name}</p>
                <p className="text-xs text-muted-foreground/70 truncate">{co.location}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${typeStyle.badge}`}>
                {co.signals[0]?.type || co.signals[0]?.category}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground/70">{co.signals.length} signals</span>
                {co.signals[0]?.confidence != null && <ConfidenceBadge score={co.signals[0].confidence} size="sm" />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}