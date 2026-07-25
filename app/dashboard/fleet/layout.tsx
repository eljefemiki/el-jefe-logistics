import type { ReactNode } from "react";
import { requirePermission } from "@/src/lib/auth";

interface FleetLayoutProps {
  children: ReactNode;
}

export default async function FleetLayout({
  children,
}: FleetLayoutProps) {
  await requirePermission("fleet:view"); return children;
}
