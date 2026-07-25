export type FleetTruckStatus =
  | "AVAILABLE"
  | "DELIVERING"
  | "MAINTENANCE"
  | "OUT_OF_SERVICE";

export type FleetTruckManufacturer =
  | "VOLVO"
  | "SCANIA"
  | "DAF"
  | "MAN"
  | "MERCEDES"
  | "RENAULT"
  | "IVECO";

export type FleetTruckType =
  | "TRACTOR"
  | "RIGID";

export interface FleetTruckDTO {
  id: string;

  fleetNumber: string;
  registration: string;

  manufacturer: FleetTruckManufacturer;
  model: string;
  type: FleetTruckType;

  year: number;
  colour: string | null;

  mileage: number;
  fuelLevel: number;

  status: FleetTruckStatus;

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
    firstName: string;
    lastName: string;
  } | null;

  purchaseDate: Date | null;
  purchasePrice: number | null;
  currentValue: number | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface FleetFilters {
  search?: string;

  status?: FleetTruckStatus;

  manufacturer?: FleetTruckManufacturer;

  depotId?: string;

  driverId?: string;
}

export interface FleetDashboardDTO {
  totalFleet: number;

  available: number;

  delivering: number;

  maintenance: number;

  outOfService: number;

  fleetValue: number;

  averageMileage: number;

  averageAge: number;

  utilisation: number;

  healthScore: number;

  averageFuelLevel: number;

  alerts: FleetAlertDTO[];

  activities: FleetActivityDTO[];
}

export interface FleetAlertDTO {
  id: string;

  level:
    | "CRITICAL"
    | "WARNING"
    | "INFO";

  title: string;

  message: string;
}

export interface FleetActivityDTO {
  id: string;

  type:
    | "TRUCK_CREATED"
    | "TRUCK_UPDATED"
    | "TRUCK_ARCHIVED"
    | "DRIVER_ASSIGNED"
    | "MAINTENANCE"
    | "FUEL";

  title: string;

  description: string;

  createdAt: Date;
}

export interface CreateTruckInput {
  fleetNumber: string;

  registration: string;

  manufacturer: FleetTruckManufacturer;

  model: string;

  type: FleetTruckType;

  year: number;

  colour?: string;

  mileage?: number;

  fuelLevel?: number;

  status?: FleetTruckStatus;

  depotId?: string;

  driverId?: string;

  purchaseDate?: Date;

  purchasePrice?: number;

  currentValue?: number;
}

export type UpdateTruckInput = Partial<CreateTruckInput>;
