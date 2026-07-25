import type {
  AccountRole,
  DriverDTO,
  DriverRank,
  DriverStatus,
} from "./types";

interface DriverRecord {
  id: string;
  accountId: string;
  employeeNumber: string;
  callsign: string | null;
  rank: string;
  status: string;
  reputation: number;
  totalDistanceKm: number;
  totalDeliveries: number;
  totalConvoys: number;
  favouriteTruck: string | null;
  assignedTrailer: import("@/src/lib/ets2-trailers").Ets2TrailerType | null;
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
    role: string;
    isActive: boolean;
    emailVerified: boolean;
    lastLogin: Date | null;
    archivedAt: Date | null;
  };
  trucks: {
    id: string;
    fleetNumber: string;
    registration: string;
    manufacturer: string;
    model: string;
    status: string;
  }[];
}

export function mapDriverToDTO(
  driver: DriverRecord,
): DriverDTO {
  return {
    id: driver.id,
    accountId: driver.accountId,
    employeeNumber: driver.employeeNumber,
    callsign: driver.callsign,
    rank: driver.rank as DriverRank,
    status: driver.status as DriverStatus,
    reputation: driver.reputation,
    totalDistanceKm: driver.totalDistanceKm,
    totalDeliveries: driver.totalDeliveries,
    totalConvoys: driver.totalConvoys,
    favouriteTruck: driver.favouriteTruck,
    assignedTrailer: driver.assignedTrailer,
    joinedAt: driver.joinedAt,
    notes: driver.notes,
    createdAt: driver.createdAt,
    updatedAt: driver.updatedAt,
    archivedAt: driver.archivedAt,
    account: {
      ...driver.account,
      role: driver.account.role as AccountRole,
    },
    trucks: driver.trucks,
  };
}
