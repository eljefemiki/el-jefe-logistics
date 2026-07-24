import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="flex">

        <Sidebar />

        <div className="flex flex-1 flex-col">

          <DashboardHeader />

          <main className="flex-1 p-8">
            {children}
          </main>

        </div>

      </div>

    </div>
  );
}