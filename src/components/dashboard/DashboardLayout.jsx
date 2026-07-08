import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu, Radar } from "lucide-react";
import { useDemoLink } from "@/lib/demoMode";
import TrialBanner from "@/components/entitlement/TrialBanner";
import DashboardSidebar from "./DashboardSidebar";
import NotificationBell from "./NotificationBell";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const demoLink = useDemoLink();

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col">
      <TrialBanner />
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30">
        <DashboardSidebar />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <DashboardSidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between h-16 px-4 bg-white border-b border-slate-200">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-600">
            <Menu className="w-5 h-5" />
          </button>
          <Link to={demoLink("/dashboard")} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
              <Radar className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-slate-900">ScoutyGo</span>
          </Link>
          <NotificationBell />
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}