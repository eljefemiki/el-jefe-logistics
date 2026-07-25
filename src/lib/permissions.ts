import type { UserRole } from "@/src/generated/prisma/enums";
export const permissions = ["dashboard:view","fleet:view","fleet:manage","drivers:view","drivers:manage","dispatch:view","dispatch:manage","marketplace:view","marketplace:manage","customers:view","customers:manage","workshop:view","workshop:manage","fuel:view","fuel:manage","finance:view","finance:manage","documents:view","documents:manage","notifications:view","audit:view","settings:view","settings:manage"] as const;
export type Permission = (typeof permissions)[number];
const all: Permission[] = [...permissions];
const management: Permission[] = all.filter((permission) => permission !== "settings:manage");
export const rolePermissions: Record<UserRole, readonly Permission[]> = {
  CEO: all, MANAGER: management,
  HR: ["dashboard:view","drivers:view","drivers:manage","documents:view","documents:manage","notifications:view"],
  DISPATCHER: ["dashboard:view","fleet:view","drivers:view","dispatch:view","dispatch:manage","marketplace:view","marketplace:manage","customers:view","documents:view","notifications:view"],
  FLEET_MANAGER: ["dashboard:view","fleet:view","fleet:manage","drivers:view","workshop:view","workshop:manage","fuel:view","fuel:manage","documents:view","documents:manage","notifications:view"],
  FINANCE: ["dashboard:view","marketplace:view","customers:view","finance:view","finance:manage","documents:view","documents:manage","notifications:view"],
  WORKSHOP: ["dashboard:view","fleet:view","workshop:view","workshop:manage","documents:view","documents:manage","notifications:view"],
  DRIVER: ["dashboard:view","fleet:view","dispatch:view","marketplace:view","documents:view","notifications:view"], APPLICANT: [],
};
export function hasPermission(role: UserRole, permission: Permission) { return rolePermissions[role].includes(permission); }
