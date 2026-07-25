export const ets2TrailerTypes = [
  "DRY_FREIGHT", "INSULATED", "REFRIGERATED", "CURTAINSIDER", "FLATBED",
  "CONTAINER_CARRIER", "LOG_TRAILER", "FOOD_TANK", "FUEL_CISTERN",
  "CHEMICAL_TANK", "GAS_CISTERN", "SILO", "DUMPER", "MOVING_FLOOR",
  "LOW_BED", "LOW_LOADER", "LIVESTOCK",
] as const;

export const cargoCategories = [
  "GENERAL", "REFRIGERATED", "FROZEN", "LIQUID_FOOD", "FUEL", "CHEMICALS",
  "GASES", "DRY_BULK", "CONSTRUCTION", "CONTAINERS", "LOGS",
  "HEAVY_EQUIPMENT", "LIVESTOCK",
] as const;

export type Ets2TrailerType = (typeof ets2TrailerTypes)[number];
export type CargoCategory = (typeof cargoCategories)[number];

export const trailerLabels: Record<Ets2TrailerType, string> = {
  DRY_FREIGHT: "Dry Freight Box",
  INSULATED: "Insulated",
  REFRIGERATED: "Refrigerated",
  CURTAINSIDER: "Curtainsider",
  FLATBED: "Flatbed",
  CONTAINER_CARRIER: "Container Carrier",
  LOG_TRAILER: "Log Trailer",
  FOOD_TANK: "Food Tank",
  FUEL_CISTERN: "Fuel Cistern",
  CHEMICAL_TANK: "Chemical Tank",
  GAS_CISTERN: "Gas Cistern",
  SILO: "Silo",
  DUMPER: "Dumper",
  MOVING_FLOOR: "Moving Floor",
  LOW_BED: "Low Bed",
  LOW_LOADER: "Low Loader",
  LIVESTOCK: "Livestock",
};

export const cargoLabels: Record<CargoCategory, string> = {
  GENERAL: "General / Palletised",
  REFRIGERATED: "Refrigerated",
  FROZEN: "Frozen",
  LIQUID_FOOD: "Liquid Food",
  FUEL: "Fuel / Combustible Liquid",
  CHEMICALS: "Chemicals",
  GASES: "Gas",
  DRY_BULK: "Dry Bulk",
  CONSTRUCTION: "Construction Materials",
  CONTAINERS: "Containers",
  LOGS: "Logs / Timber",
  HEAVY_EQUIPMENT: "Heavy Equipment",
  LIVESTOCK: "Livestock",
};

export const compatibleTrailers: Record<CargoCategory, readonly Ets2TrailerType[]> = {
  GENERAL: ["DRY_FREIGHT", "INSULATED", "CURTAINSIDER", "MOVING_FLOOR"],
  REFRIGERATED: ["REFRIGERATED"],
  FROZEN: ["REFRIGERATED"],
  LIQUID_FOOD: ["FOOD_TANK"],
  FUEL: ["FUEL_CISTERN"],
  CHEMICALS: ["CHEMICAL_TANK"],
  GASES: ["GAS_CISTERN"],
  DRY_BULK: ["SILO", "DUMPER", "MOVING_FLOOR"],
  CONSTRUCTION: ["DUMPER", "FLATBED", "LOW_BED", "LOW_LOADER"],
  CONTAINERS: ["CONTAINER_CARRIER"],
  LOGS: ["LOG_TRAILER"],
  HEAVY_EQUIPMENT: ["LOW_BED", "LOW_LOADER", "FLATBED"],
  LIVESTOCK: ["LIVESTOCK"],
};

export function isTrailerCompatible(cargo: CargoCategory, trailer: Ets2TrailerType) {
  return compatibleTrailers[cargo].includes(trailer);
}
