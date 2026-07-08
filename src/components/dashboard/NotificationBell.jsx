import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Settings, Trash2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useDemoLink } from "@/lib/demoMode";
import ConfidenceBadge from "@/components/dashboard/ConfidenceBadge";

function formatNotifTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { notifications, dismiss, clearAll, markAllRead, unreadCount } = useNotifications();
  const demoLink = useDemoLink();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = (notif) => {
    setOpen(false);
    navigate(demoLink(`/opportunities/${notif.dealId}`));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen(!open); if (!open && unreadCount > 0) markAllRead(); }}
        className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900">Notifications</span>
              <Link to={demoLink("/settings")} onClick={() => setOpen(false)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600">
                <Settings className="w-3.5 h-3.5" /> Settings
              </Link>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No notifications yet.</p>
                  <p className="text-xs text-slate-300 mt-1">New deal alerts will appear here.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleClick(notif)}
                    className="relative flex items-start gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    {!notif.read && <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-600" />}
                    <div className="flex-1 min-w-0 pl-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px]">🚨</span>
                        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">New Deal</span>
                      </div>
                      <p className="text-sm font-medium text-slate-900 truncate">{notif.company}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                        <span className="truncate">{notif.country}</span>
                        <span>·</span>
                        <span>{notif.type}</span>
                        <span>·</span>
                        <span>{formatNotifTime(notif.receivedAt)}</span>
                      </div>
                    </div>
                    {notif.confidence != null && <ConfidenceBadge score={notif.confidence} size="sm" />}
                    <button
                      onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                      className="p-1 rounded hover:bg-slate-200 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-slate-100">
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear all
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}