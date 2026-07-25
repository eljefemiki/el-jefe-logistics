import type { ReactNode } from "react";
import { requirePermission } from "@/src/lib/auth";
export default async function MaintenanceLayout({ children }: { children: ReactNode }) { await requirePermission("workshop:view"); return children; }
