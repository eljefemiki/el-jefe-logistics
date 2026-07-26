import { prisma } from "@/src/lib/prisma";

import type {
  CreateTruckInput,
  FleetFilters,
  UpdateTruckInput,
} from "./types";

const truckInclude = {
  depot: {
    select: {
      id: true,
      name: true,
      city: true,
      country: true,
    },
  },

  driver: {
    select: {
      id: true,
      employeeNumber: true,
      callsign: true,

      account: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  },
} as const;

export async function findAllTrucks(
  filters: FleetFilters = {},
) {
  const {
    search,
    status,
    manufacturer,
    depotId,
    driverId,
    includeArchived,
  } = filters;

  return prisma.truck.findMany({
    where: {
      ...(!includeArchived ? { archivedAt: null } : {}),
      ...(status
        ? {
            status,
          }
        : {}),

      ...(manufacturer
        ? {
            manufacturer,
          }
        : {}),

      ...(depotId
        ? {
            depotId,
          }
        : {}),

      ...(driverId
        ? {
            driverId,
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                fleetNumber: {
                  contains: search,
                  mode: "insensitive",
                },
              },

              {
                registration: {
                  contains: search,
                  mode: "insensitive",
                },
              },

              {
                model: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },

    include: truckInclude,

    orderBy: {
      fleetNumber: "asc",
    },
  });
}

export async function findTruckById(
  id: string,
) {
  return prisma.truck.findUnique({
    where: {
      id,
    },

    include: truckInclude,
  });
}

export async function findTruckByFleetNumber(
  fleetNumber: string,
) {
  return prisma.truck.findUnique({
    where: {
      fleetNumber,
    },
  });
}

export async function findTruckByRegistration(
  registration: string,
) {
  return prisma.truck.findUnique({
    where: {
      registration,
    },
  });
}

export async function createTruck(
  data: CreateTruckInput,
) {
  return prisma.truck.create({
    data: {
      fleetNumber:
        data.fleetNumber,

      registration:
        data.registration,

      manufacturer:
        data.manufacturer,

      model:
        data.model,

      type:
        data.type,

      year:
        data.year,

      colour:
        data.colour,

      mileage:
        data.mileage ?? 0,

      fuelLevel:
        data.fuelLevel ?? 100,

      status:
        data.status ?? "AVAILABLE",

      depotId:
        data.depotId || null,

      driverId:
        data.driverId || null,

      purchaseDate:
        data.purchaseDate,

      purchasePrice:
        data.purchasePrice,

      currentValue:
        data.currentValue,

      ownershipType:
        data.ownershipType ?? "OWNED",

      leaseStartDate:
        data.ownershipType === "LEASED" ? data.leaseStartDate : null,

      leaseTermMonths:
        data.ownershipType === "LEASED" ? data.leaseTermMonths : null,
    },

    include: truckInclude,
  });
}

export async function updateTruck(
  id: string,
  data: UpdateTruckInput,
) {
  return prisma.truck.update({
    where: {
      id,
    },

    data: {
      ...data,

      leaseStartDate:
        data.ownershipType === "OWNED"
          ? null
          : data.leaseStartDate,

      leaseTermMonths:
        data.ownershipType === "OWNED"
          ? null
          : data.leaseTermMonths,

      depotId:
        data.depotId === ""
          ? null
          : data.depotId,

      driverId:
        data.driverId === ""
          ? null
          : data.driverId,
    },

    include: truckInclude,
  });
}

export async function deleteTruck(
  id: string,
) {
  return prisma.truck.delete({
    where: {
      id,
    },
  });
}

export async function setTruckArchived(id: string, archived: boolean) {
  return prisma.truck.update({
    where: { id },
    data: {
      archivedAt: archived ? new Date() : null,
      ...(archived ? { status: "OUT_OF_SERVICE" as const, driverId: null } : {}),
    },
    include: truckInclude,
  });
}

export async function countAllTrucks() {
  return prisma.truck.count({ where: { archivedAt: null } });
}

export async function countTrucksByStatus(
  status:
    | "AVAILABLE"
    | "DELIVERING"
    | "MAINTENANCE"
    | "OUT_OF_SERVICE",
) {
  return prisma.truck.count({
    where: {
      status,
      archivedAt: null,
    },
  });
}

export async function getFleetAggregates() {
  return prisma.truck.aggregate({
    where: { archivedAt: null },
    _sum: {
      currentValue: true,
    },

    _avg: {
      mileage: true,
      fuelLevel: true,
      year: true,
    },
  });
}
