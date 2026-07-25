export const invoiceStatuses = ["DRAFT", "SENT", "PART_PAID", "PAID", "OVERDUE", "VOID"] as const;
export type InvoiceStatus = (typeof invoiceStatuses)[number];
export interface InvoiceInput { customerId: string; status: InvoiceStatus; description: string; issueDate: Date; dueDate: Date; subtotal: number; vatRate: number; amountPaid: number; paidAt?: Date; reference?: string; notes?: string; }
export interface FinanceFilters { search?: string; status?: InvoiceStatus; customerId?: string; }
