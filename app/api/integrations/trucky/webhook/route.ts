import { NextResponse } from "next/server";
import { processWebhook, verifyWebhook } from "@/src/server/trucky/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  try {
    if (!verifyWebhook(rawBody, request.headers.get("x-signature-sha256"))) {
      return NextResponse.json({ error: "Invalid Trucky signature." }, { status: 401 });
    }
    return NextResponse.json(await processWebhook(rawBody), { status: 202 });
  } catch (error) {
    console.error("Trucky webhook failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Webhook processing failed." }, { status: 400 });
  }
}
