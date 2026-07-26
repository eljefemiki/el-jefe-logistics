import type { FleetTruckDTO } from "@/src/server/fleet/types";
import { calculateLeaseSummary } from "@/src/lib/fleet-finance";

interface TruckDetailsProps {
  truck: FleetTruckDTO;
}

function formatCurrency(value: number | null) {
  if (value === null) {
    return "Not set";
  }

  return value.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });
}

function formatDate(value: Date | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-slate-800 py-4 last:border-0">
      <dt className="text-sm text-slate-500">
        {label}
      </dt>

      <dd className="mt-1 font-medium text-slate-200">
        {value}
      </dd>
    </div>
  );
}

export default function TruckDetails({
  truck,
}: TruckDetailsProps) {
  const driver = truck.driver
    ? `${truck.driver.firstName} ${truck.driver.lastName}`
    : "Unassigned";

  const depot = truck.depot
    ? `${truck.depot.name}, ${truck.depot.city}`
    : "Unassigned";
  const lease =
    truck.ownershipType === "LEASED" &&
    truck.purchasePrice !== null &&
    truck.leaseTermMonths &&
    truck.leaseStartDate
      ? calculateLeaseSummary(
          truck.purchasePrice,
          truck.leaseTermMonths,
          truck.leaseStartDate,
        )
      : null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">
          Vehicle Details
        </h2>

        <dl className="mt-4">
          <DetailRow label="Registration" value={truck.registration} />
          <DetailRow label="Manufacturer" value={truck.manufacturer} />
          <DetailRow label="Model" value={truck.model} />
          <DetailRow label="Type" value={truck.type.replaceAll("_", " ")} />
          <DetailRow label="Colour" value={truck.colour ?? "Not set"} />
          <DetailRow label="Depot" value={depot} />
          <DetailRow label="Driver" value={driver} />
        </dl>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">
          Financial Information
        </h2>

        <dl className="mt-4">
          <DetailRow
            label="Financing"
            value={truck.ownershipType === "LEASED" ? "Lease to own" : "Owned outright"}
          />
          <DetailRow
            label="Purchase Date"
            value={formatDate(truck.purchaseDate)}
          />
          <DetailRow
            label="Purchase Price"
            value={formatCurrency(truck.purchasePrice)}
          />
          <DetailRow
            label="Current Value"
            value={formatCurrency(truck.currentValue)}
          />
          {lease && (
            <>
              <DetailRow
                label="Lease Period"
                value={`${truck.leaseTermMonths} months`}
              />
              <DetailRow
                label="Monthly Payment"
                value={formatCurrency(lease.monthlyPayment)}
              />
              <DetailRow
                label="Paid"
                value={`${formatCurrency(lease.amountPaid)} · ${lease.paymentsMade} of ${truck.leaseTermMonths} payments`}
              />
              <DetailRow
                label="Remaining Balance"
                value={formatCurrency(lease.remainingBalance)}
              />
              <DetailRow
                label="Pay-off Date"
                value={formatDate(lease.endDate)}
              />
            </>
          )}
          <DetailRow
            label="Created"
            value={formatDate(truck.createdAt)}
          />
          <DetailRow
            label="Last Updated"
            value={formatDate(truck.updatedAt)}
          />
        </dl>
        {lease && (
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-sm text-slate-400">
              <span>Lease progress</span>
              <span>{Math.round(lease.progressPercent)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${lease.progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
