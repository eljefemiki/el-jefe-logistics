import { NextResponse } from "next/server";

import { getDrivers } from "@/src/server/drivers/service";

export async function GET() {
  try {
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
