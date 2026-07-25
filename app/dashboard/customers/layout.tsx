import type { ReactNode } from "react";
import { requirePermission } from "@/src/lib/auth";
export default async function CustomersLayout({ children }: { children: ReactNode }) { await requirePermission("customers:view"); return children; }
