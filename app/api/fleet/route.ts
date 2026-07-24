import { NextResponse } from "next/server";
import { getFleet } from "@/src/server/fleet/service";

export async function GET() {
  try {
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