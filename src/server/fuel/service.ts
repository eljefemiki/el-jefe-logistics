import { findFuelEntries, findFuelEntry, findFuelTrucks, insertFuelEntry, reviseFuelEntry } from "./repository";
import type { FuelEntryInput, FuelFilters } from "./types";

export async function getFuelCentre(filters: FuelFilters = {}) {
  const [entries, allEntries] = await Promise.all([
    findFuelEntries(filters),
    findFuelEntries(),
  ]);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthly = allEntries.filter((entry) => entry.purchasedAt >= monthStart);
  const litres = monthly.filter((entry) => entry.fuelType !== "ELECTRIC").reduce((sum, entry) => sum + entry.quantity, 0);
  const energyKwh = monthly.filter((entry) => entry.fuelType === "ELECTRIC").reduce((sum, entry) => sum + entry.quantity, 0);
  const spend = monthly.reduce((sum, entry) => sum + entry.totalCost, 0);
  return {
    entries,
    stats: {
      monthlySpend: spend,
      monthlyQuantity: litres,
      monthlyEnergyKwh: energyKwh,
      averageUnitPrice: litres ? monthly.filter((entry) => entry.fuelType !== "ELECTRIC").reduce((sum, entry) => sum + entry.unitPrice * entry.quantity, 0) / litres : 0,
      transactions: monthly.length,
    },
  };
}

export { findFuelEntry as getFuelEntry, findFuelTrucks as getFuelTrucks };

function reference() {
  return `FUEL-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

export function createFuelEntry(data: FuelEntryInput) {
  return insertFuelEntry(reference(), data);
}

export function updateFuelEntry(id: string, data: FuelEntryInput) {
  return reviseFuelEntry(id, data);
}
