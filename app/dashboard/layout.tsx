import type { ReactNode } from "react";
import { requireAccount } from "@/src/lib/auth";
import { getUnreadNotificationCount } from "@/src/server/platform/notifications";
import { DashboardProvider } from "@/components/layout/DashboardContext";

export default async function DashboardRootLayout({ children }: { children: ReactNode }) {
  const account = await requireAccount();
  const unreadNotifications = await getUnreadNotificationCount(account.id);
  return <DashboardProvider value={{ account, unreadNotifications }}>{children}</DashboardProvider>;
}
