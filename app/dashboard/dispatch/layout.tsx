import type { ReactNode } from "react";
import { requirePermission } from "@/src/lib/auth";

interface DispatchLayoutProps {
  children: ReactNode;
}

export default async function DispatchLayout({
  children,
}: DispatchLayoutProps) {
  await requirePermission("dispatch:view"); return children;
}
