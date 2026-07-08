import React from "react";
import { motion } from "framer-motion";

export default function UsageMeter({ label, used, limit, icon: Icon }) {
  if (limit == null) {
    return (
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 border border-slate-100">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
          <span className="text-sm font-medium text-slate-600">{label}</span>
        </div>
        <span className="text-xs font-medium text-slate-400">Unlimited</span>
      </div>
    );
  }

  const percentage = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = used >= limit;

  return (
    <div className={`px-4 py-3 rounded-xl border ${isAtLimit ? 'bg-rose-50 border-rose-100' : isNearLimit ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`w-3.5 h-3.5 ${isAtLimit ? 'text-rose-500' : isNearLimit ? 'text-amber-500' : 'text-slate-400'}`} />}
          <span className="text-sm font-medium text-slate-600">{label}</span>
        </div>
        <span className={`text-xs font-semibold ${isAtLimit ? 'text-rose-600' : isNearLimit ? 'text-amber-600' : 'text-slate-500'}`}>
          {used} / {limit}
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4 }}
          className={`h-full rounded-full ${isAtLimit ? 'bg-rose-500' : isNearLimit ? 'bg-amber-500' : 'bg-blue-500'}`}
        />
      </div>
    </div>
  );
}