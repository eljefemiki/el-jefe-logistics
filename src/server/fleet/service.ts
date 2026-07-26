import {
  createTruckSchema,
  updateTruckSchema,
} from "./validation";

import {
  createTruck as createTruckRecord,
  deleteTruck as deleteTruckRecord,
  findAllTrucks,
  findTruckByFleetNumber,
  findTruckById,
  findTruckByRegistration,
  updateTruck as updateTruckRecord,
  setTruckArchived,
} from "./repository";

import {
  mapTruckToDTO,
} from "./mapper";

import type {
  CreateTruckInput,
  FleetFilters,
  UpdateTruckInput,
} from "./types";

export async function getFleet(
  filters: FleetFilters = {},
) {
  const trucks =
    await findAllTrucks(filters);

  return trucks.map(
    mapTruckToDTO,
  );
}

export async function getTruck(
  id: string,
) {
  const truck =
    await findTruckById(id);

  if (!truck) {
    return null;
  }

  return mapTruckToDTO(truck);
}

export async function createTruck(
  input: CreateTruckInput,
) {
  const data =
    createTruckSchema.parse(input);

  const existingFleetNumber =
    await findTruckByFleetNumber(
      data.fleetNumber,
    );

  if (existingFleetNumber) {
    throw new Error(
      "A truck with this fleet number already exists.",
    );
  }

  const existingRegistration =
    await findTruckByRegistration(
      data.registration,
    );

  if (existingRegistration) {
    throw new Error(
      "A truck with this registration already exists.",
    );
  }

  const truck =
    await createTruckRecord(data);

  return mapTruckToDTO(truck);
}

export async function updateTruck(
  id: string,
  input: UpdateTruckInput,
) {
  const existing =
    await findTruckById(id);

  if (!existing) {
    throw new Error(
      "Truck not found.",
    );
  }

  const data =
    updateTruckSchema.parse(input);

  if (
    data.fleetNumber &&
    data.fleetNumber !==
      existing.fleetNumber
  ) {
    const duplicate =
      await findTruckByFleetNumber(
        data.fleetNumber,
      );

    if (duplicate) {
      throw new Error(
        "A truck with this fleet number already exists.",
      );
    }
  }

  if (
    data.registration &&
    data.registration !==
      existing.registration
  ) {
    const duplicate =
      await findTruckByRegistration(
        data.registration,
      );

    if (duplicate) {
      throw new Error(
        "A truck with this registration already exists.",
      );
    }
  }

  const truck =
    await updateTruckRecord(
      id,
      data,
    );

  return mapTruckToDTO(truck);
}

export async function removeTruck(
  id: string,
) {
  const existing =
    await findTruckById(id);

  if (!existing) {
    throw new Error(
      "Truck not found.",
    );
  }

  await deleteTruckRecord(id);

  return {
    success: true,
  };
}

export async function archiveTruck(id: string, archived: boolean) {
  const existing = await findTruckById(id);
  if (!existing) throw new Error("Truck not found.");
  return mapTruckToDTO(await setTruckArchived(id, archived));
}
