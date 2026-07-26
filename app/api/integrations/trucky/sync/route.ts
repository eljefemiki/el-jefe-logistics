import { NextResponse } from "next/server";
import { getCurrentAccount } from "@/src/lib/session";
import { hasPermission } from "@/src/lib/permissions";
import { synchronizeJobs } from "@/src/server/trucky/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const automationSecret = process.env.TRUCKY_SYNC_SECRET;
  const supplied = request.headers.get("authorization");
  const automated = Boolean(automationSecret && supplied === `Bearer ${automationSecret}`);
  if (!automated) {
    const account = await getCurrentAccount();
    if (!account) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    if (!hasPermission(account.role, "dispatch:manage")) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  try {
    return NextResponse.json(await synchronizeJobs());
  } catch (error) {
    console.error("Trucky sync failed", {
      message: error instanceof Error ? error.message : "Unknown synchronization error",
    });
    return NextResponse.json({ error: "Synchronization failed." }, { status: 502 });
  }
}
