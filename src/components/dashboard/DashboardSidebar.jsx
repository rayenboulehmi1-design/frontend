import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Radar, Bookmark, Bell, User, Settings, LogOut, Search, CreditCard, Download } from "lucide-react";
import { base44 } from "@/api/base44Client";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Intelligence Feed", path: "/intelligence-feed", icon: Search },
  { label: "Saved", path: "/saved", icon: Bookmark },
  { label: "Alerts", path: "/alerts", icon: Bell },
  { label: "Account", path: "/account-overview", icon: CreditCard },
  { label: "Data Export", path: "/data-export", icon: Download },
  { label: "Profile", path: "/profile", icon: User },
  { label: "Settings", path: "/settings", icon: Settings },
];

export default function DashboardSidebar({ onNavigate }) {
  const location = useLocation();

  const handleLogout = () => {
    base44.auth.logout("/");
  };

  return (
    <div className="flex flex-col h-full w-64 bg-white border-r border-slate-200">
      <Link to="/" className="flex items-center gap-2 px-6 h-16 border-b border-slate-100 shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <Radar className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-900">
          Scouty<span className="text-blue-600">Go</span>
        </span>
      </Link>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path ||
            (item.path === "/dashboard" && location.pathname.startsWith("/opportunities"));
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? "text-blue-600" : "text-slate-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-slate-100 shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 w-full transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          Sign Out
        </button>
      </div>
    </div>
  );
}