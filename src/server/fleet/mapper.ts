import type {
  FleetTruckDTO,
  FleetTruckManufacturer,
  FleetTruckStatus,
  FleetTruckType,
  LeaseTermMonths,
  TruckOwnershipType,
} from "./types";

interface TruckRecord {
  id: string;

  fleetNumber: string;
  registration: string;

  manufacturer: string;
  model: string;
  type: string;

  year: number;
  colour: string | null;

  mileage: number;
  fuelLevel: number;

  status: string;

  purchaseDate: Date | null;
  purchasePrice: number | null;
  currentValue: number | null;
  ownershipType: string;
  leaseStartDate: Date | null;
  leaseTermMonths: number | null;

  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;

  depot: {
    id: string;
    name: string;
    city: string;
    country: string;
  } | null;

  driver: {
    id: string;
    employeeNumber: string;
    callsign: string | null;

    account: {
      firstName: string;
      lastName: string;
    };
  } | null;
}

export function mapTruckToDTO(
  truck: TruckRecord,
): FleetTruckDTO {
  return {
    id: truck.id,

    fleetNumber: truck.fleetNumber,

    registration: truck.registration,

    manufacturer:
      truck.manufacturer as FleetTruckManufacturer,

    model: truck.model,

    type: truck.type as FleetTruckType,

    year: truck.year,

    colour: truck.colour,

    mileage: truck.mileage,

    fuelLevel: truck.fuelLevel,

    status: truck.status as FleetTruckStatus,

    depot: truck.depot
      ? {
          id: truck.depot.id,
          name: truck.depot.name,
          city: truck.depot.city,
          country: truck.depot.country,
        }
      : null,

    driver: truck.driver
      ? {
          id: truck.driver.id,

          employeeNumber:
            truck.driver.employeeNumber,

          callsign:
            truck.driver.callsign,

          firstName:
            truck.driver.account.firstName,

          lastName:
            truck.driver.account.lastName,
        }
      : null,

    purchaseDate:
      truck.purchaseDate,

    purchasePrice:
      truck.purchasePrice,

    currentValue:
      truck.currentValue,

    ownershipType:
      truck.ownershipType as TruckOwnershipType,

    leaseStartDate:
      truck.leaseStartDate,

    leaseTermMonths:
      truck.leaseTermMonths as LeaseTermMonths | null,

    createdAt:
      truck.createdAt,

    updatedAt:
      truck.updatedAt,
    archivedAt:
      truck.archivedAt,
  };
}
