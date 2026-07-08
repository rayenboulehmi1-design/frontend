import React from "react";

export default function PipelineStep({ number, title, icon: Icon, isLast = false, compact = false, children }) {
  if (compact) {
    return (
      <div className="relative flex gap-4">
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 z-10">
            {number}
          </div>
          {!isLast && <div className="w-px flex-1 bg-slate-200 min-h-[0.75rem] my-1" />}
        </div>
        <div className={`flex-1 flex items-center gap-2.5 ${isLast ? "pb-0" : "pb-3"}`}>
          {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0" />}
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide shrink-0">{title}</h3>
          <div className="flex-1 flex justify-end">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 z-10">
          {number}
        </div>
        {!isLast && <div className="w-px flex-1 bg-gradient-to-b from-slate-200 to-slate-100 min-h-[1.5rem] my-1" />}
      </div>
      <div className={`flex-1 ${isLast ? "pb-0" : "pb-6"}`}>
        <div className="flex items-center gap-2 mb-2.5">
          {Icon && <Icon className="w-4 h-4 text-slate-400" />}
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  );
}