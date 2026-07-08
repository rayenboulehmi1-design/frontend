import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu, Radar } from "lucide-react";
import DashboardSidebar from "./DashboardSidebar";
import NotificationBell from "./NotificationBell";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30">
        <DashboardSidebar />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <DashboardSidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between h-16 px-4 bg-card border-b border-border">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-muted-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <Radar className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-foreground">ScoutyGo</span>
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