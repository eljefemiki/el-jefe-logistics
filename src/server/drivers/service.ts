import {
  driverRankSchema,
  driverStatusSchema,
  updateDriverSchema,
} from "./validation";

import {
  archiveDriverRecord,
  countAllDrivers,
  countArchivedDrivers,
  countDriversByStatus,
  findAccountByEmail,
  findAllDrivers,
  findDriverByEmployeeNumber,
  findDriverById,
  getDriverAggregates,
  restoreDriverRecord,
  updateDriverRecord,
} from "./repository";

import { mapDriverToDTO } from "./mapper";

import type {
  DriverDashboardDTO,
  DriverFilters,
  DriverRank,
  DriverStatus,
  UpdateDriverInput,
} from "./types";

export async function getDrivers(
  filters: DriverFilters = {},
) {
  const drivers = await findAllDrivers(filters);

  return drivers.map(mapDriverToDTO);
}

export async function getDriver(
  id: string,
) {
  const driver = await findDriverById(id);

  if (!driver) {
    return null;
  }

  return mapDriverToDTO(driver);
}

export async function updateDriver(
  id: string,
  input: UpdateDriverInput,
) {
  const existing = await findDriverById(id);

  if (!existing) {
    throw new Error("Driver not found.");
  }

  const data = updateDriverSchema.parse(input);

  if (
    data.employeeNumber &&
    data.employeeNumber !== existing.employeeNumber
  ) {
    const duplicate = await findDriverByEmployeeNumber(
      data.employeeNumber,
    );

    if (duplicate) {
      throw new Error(
        "A driver with this employee number already exists.",
      );
    }
  }

  if (
    data.email &&
    data.email !== existing.account.email
  ) {
    const duplicate = await findAccountByEmail(
      data.email,
    );

    if (duplicate) {
      throw new Error(
        "An account with this email already exists.",
      );
    }
  }

  const driver = await updateDriverRecord(
    id,
    data,
  );

  return mapDriverToDTO(driver);
}

export async function archiveDriver(
  id: string,
) {
  const existing = await findDriverById(id);

  if (!existing) {
    throw new Error("Driver not found.");
  }

  return mapDriverToDTO(
    await archiveDriverRecord(id),
  );
}

export async function restoreDriver(
  id: string,
) {
  const existing = await findDriverById(id);

  if (!existing) {
    throw new Error("Driver not found.");
  }

  return mapDriverToDTO(
    await restoreDriverRecord(id),
  );
}

export async function getDriverDashboard(): Promise<DriverDashboardDTO> {
  const [
    totalDrivers,
    available,
    driving,
    offDuty,
    onLeave,
    suspended,
    archived,
    aggregates,
  ] = await Promise.all([
    countAllDrivers(),
    countDriversByStatus("AVAILABLE"),
    countDriversByStatus("DRIVING"),
    countDriversByStatus("OFF_DUTY"),
    countDriversByStatus("ON_LEAVE"),
    countDriversByStatus("SUSPENDED"),
    countArchivedDrivers(),
    getDriverAggregates(),
  ]);

  return {
    totalDrivers,
    activeDrivers:
      available + driving,
    available,
    driving,
    offDuty,
    onLeave,
    suspended,
    archived,
    averageReputation: Math.round(
      aggregates._avg.reputation ?? 0,
    ),
    totalDistanceKm:
      aggregates._sum.totalDistanceKm ?? 0,
    totalDeliveries:
      aggregates._sum.totalDeliveries ?? 0,
    totalConvoys:
      aggregates._sum.totalConvoys ?? 0,
  };
}

export function isDriverStatus(
  value: string | undefined,
): value is DriverStatus {
  return (
    value !== undefined &&
    driverStatusSchema.safeParse(value).success
  );
}

export function isDriverRank(
  value: string | undefined,
): value is DriverRank {
  return (
    value !== undefined &&
    driverRankSchema.safeParse(value).success
  );
}
