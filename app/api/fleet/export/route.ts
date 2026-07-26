import { getCurrentAccount } from "@/src/lib/session";
import { hasPermission } from "@/src/lib/permissions";
import { getFleet } from "@/src/server/fleet/service";

function csv(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const account = await getCurrentAccount();
  if (!account) return new Response("Authentication required.", { status: 401 });
  if (!hasPermission(account.role, "fleet:view")) return new Response("Forbidden.", { status: 403 });
  const trucks = await getFleet({ includeArchived: true });
  const headers = ["fleetNumber", "registration", "manufacturer", "model", "type", "year", "colour", "odometerKm", "fuelLevel", "status", "depot", "driver", "ownershipType", "purchasePrice", "currentValue", "archivedAt"];
  const rows = trucks.map((truck) => [
    truck.fleetNumber, truck.registration, truck.manufacturer, truck.model, truck.type, truck.year,
    truck.colour, truck.mileage, truck.fuelLevel, truck.status, truck.depot?.name,
    truck.driver ? `${truck.driver.firstName} ${truck.driver.lastName}` : "", truck.ownershipType,
    truck.purchasePrice, truck.currentValue, truck.archivedAt?.toISOString(),
  ]);
  const body = [headers, ...rows].map((row) => row.map(csv).join(",")).join("\r\n");
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="fleet-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
