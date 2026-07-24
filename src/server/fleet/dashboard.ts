import {
  countAllTrucks,
  countTrucksByStatus,
  getFleetAggregates,
} from "./repository";

import type {
  FleetAlertDTO,
  FleetDashboardDTO,
} from "./types";

function percentage(
  value: number,
  total: number,
) {
  if (total === 0) {
    return 0;
  }

  return Math.round(
    (value / total) * 100,
  );
}

export async function getFleetDashboard(): Promise<FleetDashboardDTO> {
  const [
    totalFleet,

    available,

    delivering,

    maintenance,

    outOfService,

    aggregates,
  ] = await Promise.all([
    countAllTrucks(),

    countTrucksByStatus(
      "AVAILABLE",
    ),

    countTrucksByStatus(
      "DELIVERING",
    ),

    countTrucksByStatus(
      "MAINTENANCE",
    ),

    countTrucksByStatus(
      "OUT_OF_SERVICE",
    ),

    getFleetAggregates(),
  ]);

  const fleetValue =
    aggregates._sum.currentValue ??
    0;

  const averageMileage =
    Math.round(
      aggregates._avg.mileage ??
        0,
    );

  const averageFuelLevel =
    Math.round(
      aggregates._avg.fuelLevel ??
        0,
    );

  const averageVehicleYear =
    aggregates._avg.year ??
    new Date().getFullYear();

  const averageAge =
    Math.max(
      0,
      Number(
        (
          new Date().getFullYear() -
          averageVehicleYear
        ).toFixed(1),
      ),
    );

  const activeFleet =
    delivering;

  const utilisation =
    percentage(
      activeFleet,
      totalFleet,
    );

  const healthyFleet =
    available + delivering;

  const healthScore =
    percentage(
      healthyFleet,
      totalFleet,
    );

  const alerts: FleetAlertDTO[] =
    [];

  if (outOfService > 0) {
    alerts.push({
      id: "out-of-service",

      level: "CRITICAL",

      title:
        "Vehicles out of service",

      message: `${outOfService} ${
        outOfService === 1
          ? "truck is"
          : "trucks are"
      } currently out of service.`,
    });
  }

  if (maintenance > 0) {
    alerts.push({
      id: "maintenance",

      level: "WARNING",

      title:
        "Fleet maintenance",

      message: `${maintenance} ${
        maintenance === 1
          ? "truck requires"
          : "trucks require"
      } maintenance attention.`,
    });
  }

  if (
    totalFleet > 0 &&
    averageFuelLevel < 25
  ) {
    alerts.push({
      id: "low-fuel",

      level: "WARNING",

      title:
        "Low average fuel level",

      message:
        "The average fleet fuel level is below 25%.",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "fleet-healthy",

      level: "INFO",

      title:
        "Fleet operating normally",

      message:
        "There are currently no critical fleet alerts.",
    });
  }

  return {
    totalFleet,

    available,

    delivering,

    maintenance,

    outOfService,

    fleetValue,

    averageMileage,

    averageAge,

    utilisation,

    healthScore,

    averageFuelLevel,

    alerts,

    // This becomes database-driven
    // when TruckActivity is added.
    activities: [],
  };
}