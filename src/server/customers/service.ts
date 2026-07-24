import { findCustomer, findCustomers, insertCustomer, reviseCustomer, setCustomerArchived } from "./repository";
import type { CustomerFilters, CustomerInput } from "./types";

export async function getCustomerCRM(filters: CustomerFilters = {}) {
  const customers = await findCustomers(filters);
  const activeRecords = customers.filter((customer) => !customer.archivedAt);
  return {
    customers,
    stats: {
      total: activeRecords.length,
      active: activeRecords.filter((customer) => customer.status === "ACTIVE").length,
      leads: activeRecords.filter((customer) => customer.status === "LEAD").length,
      onHold: activeRecords.filter((customer) => customer.status === "ON_HOLD").length,
      totalCredit: activeRecords.reduce((sum, customer) => sum + (customer.creditLimit ?? 0), 0),
    },
  };
}

export { findCustomer as getCustomer };

function customerNumber() {
  return `CUS-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

export function createCustomer(data: CustomerInput) {
  return insertCustomer(customerNumber(), data);
}

export function updateCustomer(id: string, data: CustomerInput) {
  return reviseCustomer(id, data);
}

export function archiveCustomer(id: string) {
  return setCustomerArchived(id, true);
}

export function restoreCustomer(id: string) {
  return setCustomerArchived(id, false);
}
