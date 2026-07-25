import { z } from "zod";
import { invoiceStatuses } from "./types.ts";
export const invoiceSchema = z.object({
  customerId: z.string().min(1, "Select a customer."),
  status: z.enum(invoiceStatuses),
  description: z.string().trim().min(2, "Enter a description.").max(240),
  issueDate: z.coerce.date(), dueDate: z.coerce.date(),
  subtotal: z.coerce.number().min(0.01, "Subtotal must be greater than zero."),
  vatRate: z.coerce.number().min(0).max(100), amountPaid: z.coerce.number().min(0),
  paidAt: z.coerce.date().optional(), reference: z.string().trim().max(100).optional(), notes: z.string().trim().max(2000).optional(),
}).refine((data) => data.dueDate >= data.issueDate, { message: "Due date cannot be before issue date.", path: ["dueDate"] })
  .refine((data) => data.amountPaid <= data.subtotal * (1 + data.vatRate / 100), { message: "Amount paid cannot exceed the invoice total.", path: ["amountPaid"] });
