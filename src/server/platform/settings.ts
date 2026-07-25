import "server-only";
import { prisma } from "@/src/lib/prisma";
export function getSettingsCentre() {
  return prisma.company.findFirst({ include: { settings: true, depots: { orderBy: { name: "asc" } } } });
}
