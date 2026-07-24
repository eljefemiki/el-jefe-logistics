import { getDriverDashboard } from "@/src/server/drivers/service";
import { getFleetDashboard } from "@/src/server/fleet/dashboard";

import type {
  DispatchAlertDTO,
  DispatchCentreDTO,
  DispatchWorkflowStageDTO,
} from "./types";

function percentage(
  value: number,
  total: number,
) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

const workflow: DispatchWorkflowStageDTO[] = [
  {
    id: "customer",
    title: "Customer",
    description:
      "Customer and order intake is reserved for the Customer model.",
    status: "PENDING_SCHEMA",
  },
  {
    id: "dispatch",
    title: "Dispatch",
    description:
      "Dispatch can calculate capacity from live driver and truck availability today.",
    status: "LIVE",
  },
  {
    id: "driver",
    title: "Driver",
    description:
      "Driver availability comes from Driver Centre roster status.",
    status: "LIVE",
  },
  {
    id: "truck",
    title: "Truck",
    description:
      "Truck availability comes from Fleet Centre status.",
    status: "LIVE",
  },
  {
    id: "journey",
    title: "Journey",
    description:
      "Journey planning is pending a persisted journey or delivery model.",
    status: "PENDING_SCHEMA",
  },
  {
    id: "fuel",
    title: "Fuel",
    description:
      "Fuel events are pending a FuelLog model.",
    status: "PENDING_SCHEMA",
  },
  {
    id: "maintenance",
    title: "Maintenance",
    description:
      "Maintenance handoff is pending a MaintenanceJob model.",
    status: "PENDING_SCHEMA",
  },
  {
    id: "invoice",
    title: "Invoice",
    description:
      "Invoice generation is pending billing and customer models.",
    status: "PENDING_SCHEMA",
  },
];

export async function getDispatchCentre(): Promise<DispatchCentreDTO> {
  const [drivers, fleet] = await Promise.all([
    getDriverDashboard(),
    getFleetDashboard(),
  ]);

  const dispatchCapacity = Math.min(
    drivers.available,
    fleet.available,
  );

  const readinessScore = Math.min(
    percentage(
      dispatchCapacity,
      Math.max(drivers.totalDrivers, fleet.totalFleet),
    ),
    100,
  );

  const alerts: DispatchAlertDTO[] = [];

  if (dispatchCapacity === 0) {
    alerts.push({
      id: "no-dispatch-capacity",
      level: "CRITICAL",
      title: "No dispatch capacity",
      message:
        "There are no matched available driver and truck pairs ready for dispatch.",
    });
  }

  if (fleet.maintenance + fleet.outOfService > 0) {
    alerts.push({
      id: "fleet-attention",
      level: "WARNING",
      title: "Fleet attention required",
      message: `${fleet.maintenance + fleet.outOfService} ${
        fleet.maintenance + fleet.outOfService === 1
          ? "truck needs"
          : "trucks need"
      } maintenance or out-of-service attention before dispatch.`,
    });
  }

  if (drivers.onLeave + drivers.suspended > 0) {
    alerts.push({
      id: "driver-availability",
      level: "WARNING",
      title: "Driver availability reduced",
      message: `${drivers.onLeave + drivers.suspended} ${
        drivers.onLeave + drivers.suspended === 1
          ? "driver is"
          : "drivers are"
      } unavailable due to leave or suspension.`,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "dispatch-ready",
      level: "INFO",
      title: "Dispatch ready",
      message:
        "Live driver and truck availability are ready for dispatch planning.",
    });
  }

  return {
    readiness: {
      availableDrivers: drivers.available,
      availableTrucks: fleet.available,
      activeDrivers: drivers.activeDrivers,
      activeTrucks: fleet.delivering,
      maintenanceTrucks: fleet.maintenance,
      outOfServiceTrucks: fleet.outOfService,
      dispatchCapacity,
      readinessScore,
    },
    workflow,
    alerts,
  };
}
