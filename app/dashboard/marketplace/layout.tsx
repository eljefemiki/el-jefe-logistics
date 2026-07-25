import type { ReactNode } from "react";
import { requirePermission } from "@/src/lib/auth";
export default async function MarketplaceLayout({ children }: { children: ReactNode }) {
  await requirePermission("marketplace:view");
  return children;
}
