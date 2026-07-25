"use client";
import { createContext, useContext } from "react";
import type { UserRole } from "@/src/generated/prisma/enums";
export interface DashboardViewer { firstName: string; lastName: string; role: UserRole }
const Context = createContext<{ account: DashboardViewer; unreadNotifications: number }>({ account: { firstName: "JefeCore", lastName: "User", role: "CEO" }, unreadNotifications: 0 });
export function DashboardProvider({ value, children }: { value: { account: DashboardViewer; unreadNotifications: number }; children: React.ReactNode }) { return <Context.Provider value={value}>{children}</Context.Provider>; }
export function useDashboardViewer() { return useContext(Context); }
