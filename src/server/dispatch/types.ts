export type DispatchStageStatus =
  | "LIVE"
  | "READY"
  | "PENDING_SCHEMA";

export interface DispatchWorkflowStageDTO {
  id: string;
  title: string;
  description: string;
  status: DispatchStageStatus;
}

export interface DispatchReadinessDTO {
  availableDrivers: number;
  availableTrucks: number;
  activeDrivers: number;
  activeTrucks: number;
  maintenanceTrucks: number;
  outOfServiceTrucks: number;
  dispatchCapacity: number;
  readinessScore: number;
}

export interface DispatchAlertDTO {
  id: string;
  level: "INFO" | "WARNING" | "CRITICAL";
  title: string;
  message: string;
}

export interface DispatchCentreDTO {
  readiness: DispatchReadinessDTO;
  workflow: DispatchWorkflowStageDTO[];
  alerts: DispatchAlertDTO[];
}
