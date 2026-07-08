import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Radar, Radio, Building2, Landmark, Globe, Bookmark, Bell, Settings, ShieldCheck, LogOut, ChevronRight, User, CreditCard, Users, GitBranch } from "lucide-react";
import { base44 } from "@/api/base44Client";
import NotificationBell from "./NotificationBell";
import { useDemoMode, useDemoLink } from "@/lib/demoMode";
import { DEMO_USER } from "@/lib/demoData";
import PlanBadge from "@/components/entitlement/PlanBadge";

const navGroups = [
  {
    label: "Intelligence",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "Missions", path: "/missions", icon: Radar, badge: "Core" },
      { label: "Intelligence Feed", path: "/intelligence-feed", icon: Radio },
      { label: "Watchlist", path: "/watchlist", icon: Bookmark },
    ],
  },
  {
    label: "Opportunities",
    items: [
      { label: "Saved Opportunities", path: "/saved", icon: Bookmark },
      { label: "Alerts", path: "/alerts", icon: Bell },
    ],
  },
  {
    label: "Intelligence Verticals",
    items: [
      { label: "Off-Plan Intel", path: "/off-plan", icon: Building2 },
      { label: "Property Records", path: "/property-records", icon: Landmark },
      { label: "Developers", path: "/developers", icon: Building2 },
      { label: "Country & City", path: "/geo-intelligence", icon: Globe },
    ],
  },
  {
    label: "Coming Soon",
    items: [
      { label: "Leads", path: "/leads", icon: Users, comingSoon: true },
      { label: "CRM Pipeline", path: "/crm", icon: GitBranch, comingSoon: true },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", path: "/profile", icon: User },
      { label: "Settings", path: "/settings", icon: Settings },
      { label: "Subscription", path: "/account-overview", icon: CreditCard },
    ],
  },
];

export default function DashboardSidebar({ onNavigate }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const isDemo = useDemoMode();
  const demoLink = useDemoLink();

  useEffect(() => {
    if (isDemo) { setUser(DEMO_USER); return; }
    base44.auth.me().then(setUser).catch(() => {});
  }, [isDemo]);

  const handleLogout = () => {
    base44.auth.logout("/");
  };

  const isActive = (path) => {
    const activePath = isDemo ? path.replace(/^\//, "/demo-") : path;
    if (path === "/dashboard") {
      return (
        location.pathname === activePath ||
        location.pathname.startsWith(isDemo ? "/demo-opportunities" : "/opportunities")
      );
    }
    return location.pathname === activePath;
  };

  const allGroups =
    !isDemo && user?.role === "admin"
      ? [...navGroups, { label: "Admin", items: [{ label: "Admin Panel", path: "/admin", icon: ShieldCheck }] }]
      : navGroups;

  const initial = (user?.full_name || user?.email || "?")[0].toUpperCase();

  return (
    <div className="flex flex-col h-full w-64 bg-white border-r border-slate-200">
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 shrink-0">
        <Link to={demoLink("/dashboard")} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <Radar className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Scouty<span className="text-blue-600">Go</span>
          </span>
        </Link>
        <NotificationBell />
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {allGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-300">{group.label}</p>
            {group.items.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              const demoPath = isDemo ? item.path.replace(/^\//, "/demo-") : item.path;
              return (
                <Link
                  key={item.path}
                  to={demoPath}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    active ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-blue-600" : "text-slate-400"}`} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[9px] font-bold uppercase tracking-wide">{item.badge}</span>
                  )}
                  {item.comingSoon && (
                    <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-400 text-[9px] font-medium">Soon</span>
                  )}
                  {active && !item.badge && !item.comingSoon && <ChevronRight className="w-3.5 h-3.5 text-blue-600" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-blue-600">{initial}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.full_name || "User"}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
          {!isDemo && user && <PlanBadge size="sm" />}
        </div>
        {isDemo ? (
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 w-full transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            Exit Demo
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 w-full transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}