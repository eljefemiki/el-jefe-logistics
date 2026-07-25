import "server-only";
import { prisma } from "@/src/lib/prisma";

export function getNotifications(recipientId: string) {
  return prisma.notification.findMany({
    where: { OR: [{ recipientId }, { recipientId: null }], AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] }] },
    orderBy: { createdAt: "desc" }, take: 100,
  });
}
export function getUnreadNotificationCount(recipientId: string) {
  return prisma.notification.count({ where: { OR: [{ recipientId }, { recipientId: null }], readAt: null } });
}
export function notify(data: { recipientId?: string; title: string; message: string; type?: "SYSTEM"|"FLEET"|"DRIVER"|"DISPATCH"|"WORKSHOP"|"FUEL"|"CUSTOMER"|"FINANCE"|"DOCUMENT"; severity?: "INFO"|"SUCCESS"|"WARNING"|"CRITICAL"; entityType?: string; entityId?: string; entityHref?: string }) {
  return prisma.notification.create({ data });
}
