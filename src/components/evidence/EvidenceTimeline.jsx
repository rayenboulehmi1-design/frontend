import React, { useState } from "react";
import {
  FileSearch, ExternalLink, Calendar, ChevronDown, ShieldCheck,
} from "lucide-react";

const EVIDENCE_GROUP_ICONS = {
  "Commercial Trigger": "💼",
  Expansion: "📈",
  Tender: "📋",
  Investment: "💰",
  Hiring: "👥",
  Procurement: "🛒",
  Construction: "🏗️",
  Hospitality: "🏨",
  Technology: "💻",
  Regulatory: "📄",
  Partnership: "🤝",
  Default: "📌",
};

function EvidenceItem({ item }) {
  const sourceUrl = item.sourceUrl || item.url || null;
  const pubDate = item.publicationDate || item.publishedAt || item.date;
  const confidence = item.confidence || item.confidenceScore;

  return (
    <div className="relative pl-6 pb-4 border-l border-slate-100 dark:border-slate-800 last:border-l-transparent">
      <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-50 dark:ring-blue-950" />
      <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {item.type || item.evidenceType || "Evidence"}
          </span>
          {confidence != null && (
            <span className="flex items-center gap-0.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-2.5 h-2.5" /> {Math.round(confidence)}%
            </span>
          )}
        </div>
        {item.snippet && (
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">{item.snippet}</p>
        )}
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          {item.source && <span>{item.source}</span>}
          {pubDate && (
            <span className="flex items-center gap-0.5">
              <Calendar className="w-2.5 h-2.5" />
              {new Date(pubDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          )}
          {sourceUrl && (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-0.5 text-blue-500 hover:text-blue-700">
              <ExternalLink className="w-2.5 h-2.5" /> Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function EvidenceGroup({ groupType, items }) {
  const [expanded, setExpanded] = useState(true);
  const icon = EVIDENCE_GROUP_ICONS[groupType] || EVIDENCE_GROUP_ICONS.Default;

  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-2 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{groupType}</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-500">
            {items.length}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? "" : "-rotate-90"}`} />
      </button>
      {expanded && (
        <div className="px-4 pb-3">
          {items.map((item, i) => (
            <EvidenceItem key={i} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function EvidenceTimeline({ evidence }) {
  if (!evidence || evidence.length === 0) return null;

  // Group by evidence type
  const groups = {};
  evidence.forEach((item) => {
    const groupType = item.group || item.category || item.evidenceGroup || item.type || item.evidenceType || "Other";
    if (!groups[groupType]) groups[groupType] = [];
    groups[groupType].push(item);
  });

  // Sort items within each group by date (newest first)
  Object.keys(groups).forEach((key) => {
    groups[key].sort((a, b) => {
      const da = new Date(a.publicationDate || a.publishedAt || a.date || 0).getTime();
      const db = new Date(b.publicationDate || b.publishedAt || b.date || 0).getTime();
      return db - da;
    });
  });

  return (
    <div className="space-y-3">
      {Object.entries(groups).map(([groupType, items]) => (
        <EvidenceGroup key={groupType} groupType={groupType} items={items} />
      ))}
    </div>
  );
}