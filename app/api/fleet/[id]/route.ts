import { NextResponse } from "next/server";
import { getCurrentAccount } from "@/src/lib/session";
import { hasPermission } from "@/src/lib/permissions";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  const account = await getCurrentAccount();
  if (!account) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!hasPermission(account.role, "fleet:view")) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  const { id } = await context.params;

  return NextResponse.json({
    id,
    message: "Fleet truck route ready.",
  });
}
