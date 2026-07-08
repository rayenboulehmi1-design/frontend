import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Radar, Radio, Building2, Landmark, Globe, Bookmark, Bell, Settings, ShieldCheck, LogOut, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import NotificationBell from "./NotificationBell";

const navGroups = [
  {
    label: "Intelligence",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "Missions", path: "/missions", icon: Radar },
      { label: "Intelligence Feed", path: "/intelligence-feed", icon: Radio },
    ],
  },
  {
    label: "Real Estate",
    items: [
      { label: "Off-Plan Intel", path: "/off-plan", icon: Building2 },
      { label: "Property Records", path: "/property-records", icon: Landmark },
      { label: "Developers", path: "/developers", icon: Building2 },
      { label: "Country & City", path: "/geo-intelligence", icon: Globe },
      { label: "Watchlist", path: "/watchlist", icon: Bookmark },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Saved Deals", path: "/saved", icon: Bookmark },
      { label: "Alerts", path: "/alerts", icon: Bell },
      { label: "Settings", path: "/settings", icon: Settings },
    ],
  },
];

export default function DashboardSidebar({ onNavigate }) {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleLogout = () => {
    base44.auth.logout("/");
  };

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard" || location.pathname.startsWith("/opportunities");
    return location.pathname === path;
  };

  const allGroups = user?.role === "admin"
    ? [...navGroups, { label: "Admin", items: [{ label: "Admin", path: "/admin", icon: ShieldCheck }] }]
    : navGroups;

  const initial = (user?.full_name || user?.email || "?")[0].toUpperCase();

  return (
    <div className="flex flex-col h-full w-64 bg-card border-r border-border">
      <div className="flex items-center justify-between px-5 h-16 border-b border-border shrink-0">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Radar className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Scouty<span className="text-primary">Go</span>
          </span>
        </Link>
        <NotificationBell />
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {allGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground/40">{group.label}</p>
            {group.items.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground/70"}`} />
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-primary" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-border shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">{initial}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground truncate">{user?.full_name || "User"}</p>
            <p className="text-xs text-muted-foreground/70 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors"
        >
          <LogOut className="w-4 h-4 text-muted-foreground/70" />
          Sign Out
        </button>
      </div>
    </div>
  );
}