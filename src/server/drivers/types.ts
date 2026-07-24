export type DriverStatus =
  | "AVAILABLE"
  | "DRIVING"
  | "OFF_DUTY"
  | "ON_LEAVE"
  | "SUSPENDED";

export type DriverRank =
  | "TRAINEE"
  | "JUNIOR"
  | "SENIOR"
  | "ELITE";

export type AccountRole =
  | "CEO"
  | "MANAGER"
  | "HR"
  | "DISPATCHER"
  | "FLEET_MANAGER"
  | "DRIVER"
  | "APPLICANT";

export interface DriverTruckDTO {
  id: string;
  fleetNumber: string;
  registration: string;
  manufacturer: string;
  model: string;
  status: string;
}

export interface DriverDTO {
  id: string;
  accountId: string;
  employeeNumber: string;
  callsign: string | null;
  rank: DriverRank;
  status: DriverStatus;
  reputation: number;
  totalDistanceKm: number;
  totalDeliveries: number;
  totalConvoys: number;
  favouriteTruck: string | null;
  joinedAt: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
  account: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: AccountRole;
    isActive: boolean;
    emailVerified: boolean;
    lastLogin: Date | null;
    archivedAt: Date | null;
  };
  trucks: DriverTruckDTO[];
}

export interface DriverFilters {
  search?: string;
  status?: DriverStatus;
  rank?: DriverRank;
  includeArchived?: boolean;
}

export interface DriverDashboardDTO {
  totalDrivers: number;
  activeDrivers: number;
  available: number;
  driving: number;
  offDuty: number;
  onLeave: number;
  suspended: number;
  archived: number;
  averageReputation: number;
  totalDistanceKm: number;
  totalDeliveries: number;
  totalConvoys: number;
}

export interface UpdateDriverInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  employeeNumber?: string;
  callsign?: string;
  rank?: DriverRank;
  status?: DriverStatus;
  reputation?: number;
  totalDistanceKm?: number;
  totalDeliveries?: number;
  totalConvoys?: number;
  favouriteTruck?: string;
  joinedAt?: Date;
  notes?: string;
  isActive?: boolean;
}
