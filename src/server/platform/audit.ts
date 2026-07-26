import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/src/lib/prisma";
import { getCurrentAccount } from "@/src/lib/session";
import type { Prisma } from "@/src/generated/prisma/client";
import { sanitizeAuditValue } from "@/src/lib/audit-sanitizer";

const json = (value: unknown): Prisma.InputJsonValue | undefined =>
  value === undefined ? undefined : JSON.parse(JSON.stringify(sanitizeAuditValue(value)));

export async function recordAudit(input: { action: string; entityType: string; entityId?: string; summary: string; before?: unknown; after?: unknown }) {
  const [actor, requestHeaders] = await Promise.all([getCurrentAccount(), headers()]);
  return prisma.auditEvent.create({ data: {
    actorId: actor?.id, action: input.action, entityType: input.entityType, entityId: input.entityId,
    summary: input.summary, before: json(input.before), after: json(input.after),
    ipAddress: requestHeaders.get("x-real-ip") ?? requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim(),
    userAgent: requestHeaders.get("user-agent"),
  } });
}

export async function getAuditEvents(filters: { search?: string; action?: string; entityType?: string; from?: Date; to?: Date; page?: number } = {}) {
  const pageSize = 50;
  const page = Math.max(1, filters.page ?? 1);
  const where = {
    ...(filters.action ? { action: filters.action } : {}),
    ...(filters.entityType ? { entityType: filters.entityType } : {}),
    ...((filters.from || filters.to) ? { createdAt: { ...(filters.from ? { gte: filters.from } : {}), ...(filters.to ? { lte: filters.to } : {}) } } : {}),
    ...(filters.search ? { OR: [
      { action: { contains: filters.search, mode: "insensitive" as const } }, { summary: { contains: filters.search, mode: "insensitive" as const } },
      { entityType: { contains: filters.search, mode: "insensitive" as const } }, { entityId: { contains: filters.search, mode: "insensitive" as const } },
      { actor: { OR: [{ firstName: { contains: filters.search, mode: "insensitive" as const } }, { lastName: { contains: filters.search, mode: "insensitive" as const } }] } },
    ] } : {}),
  };
  const [events, total] = await Promise.all([
    prisma.auditEvent.findMany({
      where,
      include: { actor: { select: { firstName: true, lastName: true, role: true } } },
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    prisma.auditEvent.count({ where }),
  ]);
  return {
    events: events.map((event) => ({
      ...event,
      before: sanitizeAuditValue(event.before),
      after: sanitizeAuditValue(event.after),
    })),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getAuditFilterOptions() {
  const [actions, entityTypes] = await Promise.all([
    prisma.auditEvent.findMany({ distinct: ["action"], select: { action: true }, orderBy: { action: "asc" } }),
    prisma.auditEvent.findMany({ distinct: ["entityType"], select: { entityType: true }, orderBy: { entityType: "asc" } }),
  ]);
  return { actions: actions.map(({ action }) => action), entityTypes: entityTypes.map(({ entityType }) => entityType) };
}
