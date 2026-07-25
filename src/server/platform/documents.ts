import "server-only";
import { prisma } from "@/src/lib/prisma";
import type { DocumentCategory } from "@/src/generated/prisma/enums";
export function getDocuments(filters: { search?: string; category?: DocumentCategory; entityType?: string; entityId?: string } = {}) {
  return prisma.document.findMany({ where: {
    archivedAt: null, ...(filters.category ? { category: filters.category } : {}),
    ...(filters.entityType ? { entityType: filters.entityType } : {}), ...(filters.entityId ? { entityId: filters.entityId } : {}),
    ...(filters.search ? { OR: [{ name: { contains: filters.search, mode: "insensitive" } }, { description: { contains: filters.search, mode: "insensitive" } }, { originalName: { contains: filters.search, mode: "insensitive" } }] } : {}),
  }, include: { uploadedBy: { select: { firstName: true, lastName: true } } }, orderBy: { createdAt: "desc" } });
}
