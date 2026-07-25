import type { ReactNode } from "react";
import { requirePermission } from "@/src/lib/auth";

interface DriversLayoutProps {
  children: ReactNode;
}

export default async function DriversLayout({
  children,
}: DriversLayoutProps) {
  await requirePermission("drivers:view"); return children;
}
