export const maintenanceStatuses = [
  "REPORTED", "SCHEDULED", "IN_PROGRESS", "WAITING_PARTS", "COMPLETED", "CANCELLED",
] as const;
export const maintenancePriorities = ["LOW", "ROUTINE", "HIGH", "CRITICAL"] as const;
export const maintenanceTypes = [
  "INSPECTION", "PREVENTIVE_SERVICE", "REPAIR", "TYRES", "MOT", "BREAKDOWN", "OTHER",
] as const;

export type MaintenanceStatus = (typeof maintenanceStatuses)[number];
export type MaintenancePriority = (typeof maintenancePriorities)[number];
export type MaintenanceType = (typeof maintenanceTypes)[number];

export interface MaintenanceJobInput {
  truckId: string;
  title: string;
  description?: string;
  type: MaintenanceType;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  odometerKm?: number;
  technician?: string;
  vendor?: string;
  scheduledFor?: Date;
  estimatedCost?: number;
  actualCost?: number;
  notes?: string;
}

export interface WorkshopFilters {
  search?: string;
  status?: MaintenanceStatus;
  priority?: MaintenancePriority;
}
