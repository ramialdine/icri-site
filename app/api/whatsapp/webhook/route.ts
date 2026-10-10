import { after, NextResponse } from "next/server";

import { verifySignature } from "@/lib/whatsapp/client";
import { missingBotSettings } from "@/lib/whatsapp/config";
import { handleWebhookPayload } from "@/lib/whatsapp/handle";

export const runtime = "nodejs";
// Reading a full-month flyer with Claude can take a minute or more.
export const maxDuration = 300;

// Meta's one-time handshake when the webhook URL is registered.
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (verifyToken && params.get("hub.mode") === "subscribe" && params.get("hub.verify_token") === verifyToken) {
    return new Response(params.get("hub.challenge") ?? "", { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
  const missing = missingBotSettings();
  if (missing.length > 0) {
    return NextResponse.json({ error: `WhatsApp bot is not configured: ${missing.join(", ")}` }, { status: 503 });
  }

  const rawBody = Buffer.from(await request.arrayBuffer());
  if (!verifySignature(rawBody, request.headers.get("x-hub-signature-256"), process.env.WHATSAPP_APP_SECRET!)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Acknowledge right away: Meta re-sends deliveries that aren't answered quickly.
  after(() =>
    handleWebhookPayload(payload).catch((error) => {
      console.error("WhatsApp webhook processing failed", error);
    })
  );

  return NextResponse.json({ received: true });
}
