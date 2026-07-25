import type { ReactNode } from "react";
import { requirePermission } from "@/src/lib/auth";
export default async function FinanceLayout({ children }: { children: ReactNode }) { await requirePermission("finance:view"); return children; }
