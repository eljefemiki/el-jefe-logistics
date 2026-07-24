"use client";

import { Bell, Menu, Search, Sun } from "lucide-react";
import Avatar from "@/components/ui/Avatar";

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export default function Header({
  title = "Dashboard",
  subtitle = "Welcome back!",
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="flex h-20 items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-white">
              {title}
            </h1>

            <p className="text-sm text-slate-400">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2">
            <Search
              size={18}
              className="text-slate-500"
            />

            <input
              type="text"
              placeholder="Search..."
              className="w-64 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Weather */}
          <button className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-slate-400 transition hover:bg-slate-800 hover:text-white">
            <Sun size={20} />
          </button>

          {/* Notifications */}
          <button className="relative rounded-xl border border-slate-800 bg-slate-900 p-3 text-slate-400 transition hover:bg-slate-800 hover:text-white">
            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">
            <Avatar
              name="Mike Collis"
              size="sm"
              status="online"
            />

            <div className="hidden lg:block">
              <p className="font-semibold text-white">
                Mike Collis
              </p>

              <p className="text-xs text-slate-400">
                Chief Executive Officer
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}