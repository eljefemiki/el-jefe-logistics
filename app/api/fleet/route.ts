import { NextResponse } from "next/server";
import { getFleet } from "@/src/server/fleet/service";
import { getCurrentAccount } from "@/src/lib/session";
import { hasPermission } from "@/src/lib/permissions";

export async function GET() {
  try {
    const account = await getCurrentAccount();
    if (!account) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    if (!hasPermission(account.role, "fleet:view")) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    const trucks = await getFleet();

    return NextResponse.json(trucks);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to load fleet",
      },
      {
        status: 500,
      }
    );
  }
}
