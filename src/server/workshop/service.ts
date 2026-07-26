import { findMaintenanceJob, findMaintenanceJobs, findVehicleIssues, findWorkshopTrucks, insertMaintenanceJob, reviseMaintenanceJob } from "./repository";
import type { MaintenanceJobInput, WorkshopFilters } from "./types";

export async function getWorkshopCentre(filters: WorkshopFilters = {}) {
  const [jobs, allJobs, vehicleIssues] = await Promise.all([
    findMaintenanceJobs(filters),
    findMaintenanceJobs(),
    findVehicleIssues(),
  ]);
  const active = allJobs.filter((job) => !["COMPLETED", "CANCELLED"].includes(job.status));
  return {
    jobs,
    vehicleIssues,
    stats: {
      active: active.length,
      critical: active.filter((job) => job.priority === "CRITICAL").length,
      waitingParts: active.filter((job) => job.status === "WAITING_PARTS").length,
      scheduled: active.filter((job) => job.status === "SCHEDULED").length,
      estimatedExposure: active.reduce((sum, job) => sum + (job.estimatedCost ?? 0), 0),
      telemetryIssues: vehicleIssues.length,
    },
  };
}

export { findMaintenanceJob as getMaintenanceJob, findWorkshopTrucks as getWorkshopTrucks };

function jobNumber() {
  const date = new Date();
  const day = date.toISOString().slice(0, 10).replaceAll("-", "");
  return `WO-${day}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

export function createMaintenanceJob(data: MaintenanceJobInput) {
  return insertMaintenanceJob(jobNumber(), data);
}

export function updateMaintenanceJob(id: string, data: MaintenanceJobInput) {
  return reviseMaintenanceJob(id, data);
}
