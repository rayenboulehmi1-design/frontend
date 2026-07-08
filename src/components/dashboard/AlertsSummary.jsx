import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Bell, ArrowRight, Clock } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import { useNotifications } from "@/hooks/useNotifications";
import { getTypeStyle } from "@/lib/dealUtils";

export default function AlertsSummary() {
  const demoLink = useDemoLink();
  const { notifications, unreadCount } = useNotifications();
  const recent = notifications.slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 bg-white p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-4 h-4 text-slate-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-slate-900">Alerts</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold">{unreadCount} unread</span>
          )}
        </div>
        <Link to={demoLink("/alerts")} className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:gap-2 transition-all">
          Manage <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      {recent.length > 0 ? (
        <div className="space-y-2">
          {recent.map((notif) => {
            const typeStyle = getTypeStyle(notif.type);
            return (
              <Link key={notif.id} to={demoLink(`/opportunities/${notif.dealId}`)} className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                {notif.read && <span className="w-2 h-2 rounded-full bg-slate-200 shrink-0" />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${typeStyle.badge}`}>{notif.type}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">{notif.company}</p>
                  <p className="text-xs text-slate-400 truncate">{notif.country}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(notif.receivedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Bell className="w-8 h-8 text-slate-200 mb-2" />
          <p className="text-sm text-slate-400 mb-1">No alerts yet</p>
          <p className="text-xs text-slate-300">Track opportunities to receive alerts when conditions change</p>
        </div>
      )}
    </motion.div>
  );
}