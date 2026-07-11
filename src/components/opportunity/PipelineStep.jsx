import React from "react";

const ownerStyles = {
  engine: { label: "Intelligence Engine", className: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900" },
  ai: { label: "AI Assistant", className: "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-900" },
  future: { label: "Future Module", className: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700" },
  action: { label: "Action", className: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900" },
};

export default function PipelineStep({ number, title, icon: Icon, owner, isLast = false, compact = false, children }) {
  const ownerInfo = owner ? ownerStyles[owner] : null;

  if (compact) {
    return (
      <div className="relative flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center text-xs font-bold shrink-0 z-10">
            {number}
          </div>
          {!isLast && <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700 min-h-[0.75rem] my-1" />}
        </div>
        <div className={`flex-1 flex items-center gap-2.5 flex-wrap ${isLast ? "pb-0" : "pb-3"}`}>
          {Icon && <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />}
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide shrink-0">{title}</h3>
          {ownerInfo && (
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide border ${ownerInfo.className}`}>
              {ownerInfo.label}
            </span>
          )}
          <div className="flex-1 flex justify-end">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center text-xs font-bold shrink-0 z-10">
          {number}
        </div>
        {!isLast && <div className="w-px flex-1 bg-gradient-to-b from-slate-200 dark:from-slate-700 to-slate-100 dark:to-slate-800 min-h-[1.5rem] my-1" />}
      </div>
      <div className={`flex-1 ${isLast ? "pb-0" : "pb-6"}`}>
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          {Icon && <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />}
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">{title}</h3>
          {ownerInfo && (
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide border ${ownerInfo.className}`}>
              {ownerInfo.label}
            </span>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}