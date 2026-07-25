import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/src/lib/prisma";
import { getCurrentAccount } from "@/src/lib/session";
import type { Prisma } from "@/src/generated/prisma/client";

const json = (value: unknown): Prisma.InputJsonValue | undefined =>
  value === undefined ? undefined : JSON.parse(JSON.stringify(value));

export async function recordAudit(input: { action: string; entityType: string; entityId?: string; summary: string; before?: unknown; after?: unknown }) {
  const [actor, requestHeaders] = await Promise.all([getCurrentAccount(), headers()]);
  return prisma.auditEvent.create({ data: {
    actorId: actor?.id, action: input.action, entityType: input.entityType, entityId: input.entityId,
    summary: input.summary, before: json(input.before), after: json(input.after),
    ipAddress: requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim(),
    userAgent: requestHeaders.get("user-agent"),
  } });
}

export function getAuditEvents(search?: string) {
  return prisma.auditEvent.findMany({
    where: search ? { OR: [
      { action: { contains: search, mode: "insensitive" } }, { summary: { contains: search, mode: "insensitive" } },
      { entityType: { contains: search, mode: "insensitive" } }, { entityId: { contains: search, mode: "insensitive" } },
    ] } : undefined,
    include: { actor: { select: { firstName: true, lastName: true, role: true } } },
    orderBy: { createdAt: "desc" }, take: 200,
  });
}
