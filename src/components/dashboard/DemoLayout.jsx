import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu, Radar, Eye } from "lucide-react";
import DashboardSidebar from "./DashboardSidebar";
import NotificationBell from "./NotificationBell";
import { DemoModeProvider } from "@/lib/demoMode";

export default function DemoLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DemoModeProvider value={true}>
      <div className="min-h-screen bg-[#fcfcfc]">
        {/* Fixed demo banner */}
        <div className="fixed top-0 left-0 right-0 z-[60] h-8 bg-amber-400 flex items-center justify-center gap-2 text-xs font-bold text-amber-950 px-4">
          <Eye className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">DEMO MODE — Sanitized sample data for UX review only. No real data is exposed.</span>
          <span className="sm:hidden">DEMO MODE</span>
          <Link to="/" className="underline hover:no-underline ml-2 shrink-0">Exit</Link>
        </div>

        <div className="flex pt-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block fixed top-8 bottom-0 left-0 z-30">
            <DashboardSidebar />
          </aside>

          {/* Mobile sidebar */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 top-8 z-50">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
              <div className="absolute inset-y-0 left-0">
                <DashboardSidebar onNavigate={() => setSidebarOpen(false)} />
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
            {/* Mobile top bar */}
            <header className="lg:hidden sticky top-8 z-20 flex items-center justify-between h-16 px-4 bg-white border-b border-slate-200">
              <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-600">
                <Menu className="w-5 h-5" />
              </button>
              <Link to="/demo-dashboard" className="flex items-center gap-2">
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
      </div>
    </DemoModeProvider>
  );
}