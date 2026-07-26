import { prisma } from "@/src/lib/prisma";

import type {
  DriverFilters,
  DriverStatus,
  UpdateDriverInput,
} from "./types";

const driverInclude = {
  account: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isActive: true,
      emailVerified: true,
      lastLogin: true,
      archivedAt: true,
    },
  },

  trucks: {
    select: {
      id: true,
      fleetNumber: true,
      registration: true,
      manufacturer: true,
      model: true,
      status: true,
    },

    orderBy: {
      fleetNumber: "asc",
    },
  },
  transportJobs: {
    where: { status: "COMPLETED" },
    select: {
      id: true, truckyJobId: true, cargo: true, sourceCity: true, destinationCity: true,
      drivenDistanceKm: true, revenue: true, profit: true, currency: true, completedAt: true,
    },
    orderBy: { completedAt: "desc" as const },
    take: 25,
  },
} as const;

export async function findAllDrivers(
  filters: DriverFilters = {},
) {
  const {
    search,
    status,
    rank,
    includeArchived,
  } = filters;

  return prisma.driver.findMany({
    where: {
      ...(includeArchived
        ? {}
        : {
            archivedAt: null,
          }),

      ...(status ? { status } : {}),
      ...(rank ? { rank } : {}),

      ...(search
        ? {
            OR: [
              {
                employeeNumber: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                callsign: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                account: {
                  firstName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
              {
                account: {
                  lastName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
              {
                account: {
                  email: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {}),
    },

    include: driverInclude,

    orderBy: [
      {
        archivedAt: "asc",
      },
      {
        employeeNumber: "asc",
      },
    ],
  });
}

export async function findDriverById(
  id: string,
) {
  return prisma.driver.findUnique({
    where: {
      id,
    },

    include: driverInclude,
  });
}

export async function findDriverByEmployeeNumber(
  employeeNumber: string,
) {
  return prisma.driver.findUnique({
    where: {
      employeeNumber,
    },
  });
}

export async function findAccountByEmail(
  email: string,
) {
  return prisma.account.findUnique({
    where: {
      email,
    },
  });
}

export async function updateDriverRecord(
  id: string,
  data: UpdateDriverInput,
) {
  const {
    firstName,
    lastName,
    email,
    isActive,
    ...driverData
  } = data;

  return prisma.$transaction(async (tx) => {
    const existing = await tx.driver.findUnique({
      where: {
        id,
      },
      select: {
        accountId: true,
      },
    });

    if (!existing) {
      throw new Error("Driver not found.");
    }

    if (
      firstName !== undefined ||
      lastName !== undefined ||
      email !== undefined ||
      isActive !== undefined
    ) {
      await tx.account.update({
        where: {
          id: existing.accountId,
        },
        data: {
          ...(firstName !== undefined ? { firstName } : {}),
          ...(lastName !== undefined ? { lastName } : {}),
          ...(email !== undefined ? { email } : {}),
          ...(isActive !== undefined ? { isActive } : {}),
        },
      });
    }

    return tx.driver.update({
      where: {
        id,
      },

      data: driverData,

      include: driverInclude,
    });
  });
}

export async function archiveDriverRecord(
  id: string,
) {
  return prisma.$transaction(async (tx) => {
    const driver = await tx.driver.update({
      where: {
        id,
      },

      data: {
        archivedAt: new Date(),
        status: "SUSPENDED",
      },

      include: driverInclude,
    });

    await tx.account.update({
      where: {
        id: driver.accountId,
      },

      data: {
        isActive: false,
        archivedAt: new Date(),
      },
    });

    return driver;
  });
}

export async function restoreDriverRecord(
  id: string,
) {
  return prisma.$transaction(async (tx) => {
    const driver = await tx.driver.update({
      where: {
        id,
      },

      data: {
        archivedAt: null,
        status: "AVAILABLE",
      },

      include: driverInclude,
    });

    await tx.account.update({
      where: {
        id: driver.accountId,
      },

      data: {
        isActive: true,
        archivedAt: null,
      },
    });

    return driver;
  });
}

export async function countAllDrivers(
  includeArchived = false,
) {
  return prisma.driver.count({
    where: includeArchived
      ? {}
      : {
          archivedAt: null,
        },
  });
}

export async function countDriversByStatus(
  status: DriverStatus,
) {
  return prisma.driver.count({
    where: {
      status,
      archivedAt: null,
    },
  });
}

export async function countArchivedDrivers() {
  return prisma.driver.count({
    where: {
      archivedAt: {
        not: null,
      },
    },
  });
}

export async function getDriverAggregates() {
  return prisma.driver.aggregate({
    where: {
      archivedAt: null,
    },

    _avg: {
      reputation: true,
    },

    _sum: {
      totalDistanceKm: true,
      totalDeliveries: true,
      totalConvoys: true,
    },
  });
}
