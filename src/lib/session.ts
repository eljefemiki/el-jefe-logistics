import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";
export const sessionCookie = "jefecore_session";
const secret = () => {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET must be configured in production.");
  }
  return "development-only-change-me";
};
const signature = (id: string) => createHmac("sha256", secret()).update(id).digest("base64url");
export function createSessionToken(accountId: string) { return `${accountId}.${signature(accountId)}`; }
export function verifySessionToken(value?: string) {
  if (!value) return null; const separator = value.lastIndexOf("."); if (separator < 1) return null;
  const id = value.slice(0, separator); const supplied = Buffer.from(value.slice(separator + 1)); const expected = Buffer.from(signature(id));
  return supplied.length === expected.length && timingSafeEqual(supplied, expected) ? id : null;
}
export async function getCurrentAccount() {
  const store = await cookies(); const accountId = verifySessionToken(store.get(sessionCookie)?.value); if (!accountId) return null;
  return prisma.account.findFirst({ where: { id: accountId, isActive: true, archivedAt: null }, select: { id: true, firstName: true, lastName: true, email: true, role: true, driver: { select: { id: true } } } });
}
