import type { ReactNode } from "react";
import { requirePermission } from "@/src/lib/auth";
export default async function FuelLayout({ children }: { children: ReactNode }) { await requirePermission("fuel:view"); return children; }
