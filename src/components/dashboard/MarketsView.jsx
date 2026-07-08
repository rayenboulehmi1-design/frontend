import React from "react";
import { Globe } from "lucide-react";

export default function MarketsView({ markets, onSelect }) {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {markets.map((m) => (
        <div
          key={m.name}
          onClick={() => onSelect(m.name)}
          className="rounded-2xl border border-border bg-card p-5 hover:shadow-lg hover:border-primary/30 cursor-pointer transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-teal-600" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-foreground truncate">{m.name}</p>
              <p className="text-xs text-muted-foreground/70">{m.signals.length} signals tracked</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(m.categories).slice(0, 3).map(([cat, count]) => (
              <span key={cat} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground">
                {cat}: {count}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}