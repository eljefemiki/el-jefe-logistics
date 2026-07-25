import "server-only";
import { redirect } from "next/navigation";
import { getCurrentAccount } from "./session";
import { hasPermission, type Permission } from "./permissions";
export async function requireAccount(nextPath = "/dashboard") { const account = await getCurrentAccount(); if (!account) redirect(`/login?next=${encodeURIComponent(nextPath)}`); return account; }
export async function requirePermission(permission: Permission) { const account = await requireAccount(); if (!hasPermission(account.role, permission)) redirect("/?forbidden=1"); return account; }
export async function authorize(permission: Permission) { const account = await getCurrentAccount(); if (!account) throw new Error("Authentication required."); if (!hasPermission(account.role, permission)) throw new Error("You do not have permission to perform this action."); return account; }
