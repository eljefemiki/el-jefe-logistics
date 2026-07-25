import { NextResponse } from "next/server";

import { getDrivers } from "@/src/server/drivers/service";
import { getCurrentAccount } from "@/src/lib/session";
import { hasPermission } from "@/src/lib/permissions";

export async function GET() {
  try {
    const account = await getCurrentAccount();
    if (!account) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    if (!hasPermission(account.role, "drivers:view")) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    const drivers = await getDrivers();

    return NextResponse.json(drivers);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to load drivers",
      },
      {
        status: 500,
      },
    );
  }
}
