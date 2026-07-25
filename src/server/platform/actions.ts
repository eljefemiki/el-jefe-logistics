"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { authorize } from "@/src/lib/auth";
import { recordAudit } from "./audit";
import { notify } from "./notifications";

export async function markNotificationReadAction(id: string) {
  const actor = await authorize("notifications:view");
  const notification = await prisma.notification.findFirst({ where: { id, OR: [{ recipientId: actor.id }, { recipientId: null }] } });
  if (!notification) throw new Error("Notification not found.");
  await prisma.notification.update({ where: { id }, data: { readAt: new Date() } });
  revalidatePath("/dashboard/notifications");
}
export async function markAllNotificationsReadAction() {
  const actor = await authorize("notifications:view");
  await prisma.notification.updateMany({ where: { recipientId: actor.id, readAt: null }, data: { readAt: new Date() } });
  revalidatePath("/dashboard/notifications");
}

const documentSchema = z.object({
  name: z.string().trim().min(2).max(160), description: z.string().trim().max(1000).optional(),
  category: z.enum(["GENERAL","VEHICLE","DRIVER","CUSTOMER","JOB","INVOICE","MAINTENANCE","FUEL","COMPLIANCE"]),
  entityType: z.string().trim().max(60).optional(), entityId: z.string().trim().max(100).optional(),
  externalUrl: z.string().url().optional().or(z.literal("")),
});
export async function createDocumentAction(formData: FormData) {
  const actor = await authorize("documents:manage");
  const parsed = documentSchema.parse(Object.fromEntries(formData));
  const document = await prisma.document.create({ data: { ...parsed, externalUrl: parsed.externalUrl || undefined, uploadedById: actor.id } });
  await Promise.all([
    recordAudit({ action: "CREATE", entityType: "Document", entityId: document.id, summary: `Added document metadata: ${document.name}`, after: document }),
    notify({ title: "Document added", message: document.name, type: "DOCUMENT", severity: "SUCCESS", entityType: "Document", entityId: document.id, entityHref: "/dashboard/documents" }),
  ]);
  revalidatePath("/dashboard/documents");
}

const settingsSchema = z.object({
  legalName: z.string().trim().min(2), tradingName: z.string().trim().optional(), registrationNo: z.string().trim().optional(),
  vatNumber: z.string().trim().optional(), address: z.string().trim().optional(), phone: z.string().trim().optional(),
  email: z.string().email().optional().or(z.literal("")), website: z.string().url().optional().or(z.literal("")),
  primaryColour: z.string().regex(/^#[0-9a-fA-F]{6}$/), vatRate: z.coerce.number().min(0).max(100),
  invoicePrefix: z.string().trim().min(1).max(12),
});
export async function updateSettingsAction(formData: FormData) {
  await authorize("settings:manage");
  const companyId = String(formData.get("companyId") || "");
  const data = settingsSchema.parse(Object.fromEntries(formData));
  const before = await prisma.companySettings.findUnique({ where: { companyId } });
  const settings = await prisma.companySettings.upsert({
    where: { companyId }, create: { companyId, ...data, email: data.email || undefined, website: data.website || undefined },
    update: { ...data, email: data.email || null, website: data.website || null },
  });
  await recordAudit({ action: before ? "UPDATE" : "CREATE", entityType: "CompanySettings", entityId: settings.id, summary: "Updated company platform settings", before, after: settings });
  revalidatePath("/dashboard/settings");
}
