import React from "react";
import { Database } from "lucide-react";

export default function EnginePlaceholder({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 p-5 text-center">
      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
        <Database className="w-5 h-5 text-slate-400 dark:text-slate-500" />
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        {message || "Available when supported by the ScoutyGo Intelligence Engine."}
      </p>
    </div>
  );
}