"use client";
import { ReactNode, useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { useDashboardViewer } from "./DashboardContext";

export interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function DashboardLayout({
  children,
  title = "Dashboard",
  subtitle = "Welcome back!",
}: DashboardLayoutProps) {
  const { account, unreadNotifications } = useDashboardViewer();
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          role={account.role}
          mobileOpen={mobileNavigationOpen}
          onClose={() => setMobileNavigationOpen(false)}
        />

        {/* Main Content */}
        <div className="flex min-h-screen flex-1 flex-col">
          {/* Header */}
          <Header
            title={title}
            subtitle={subtitle}
            account={account}
            unreadNotifications={unreadNotifications}
            onMenuClick={() => setMobileNavigationOpen(true)}
          />

          {/* Main */}
          <main className="flex-1 bg-slate-950 p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-800 px-6 py-4">
            <div className="flex flex-col items-center justify-between gap-2 text-sm text-slate-500 md:flex-row">
              <span>
                © {new Date().getFullYear()} El Jefe Logistics
              </span>

              <span>
                Powered by JefeCore
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
