import { createHmac, timingSafeEqual } from "node:crypto";

import type { UpdateMedia } from "@/lib/updates/extract";

const MAX_MEDIA_BYTES = 20 * 1024 * 1024;

function graphUrl(path: string): string {
  return `https://graph.facebook.com/${process.env.WHATSAPP_GRAPH_VERSION || "v24.0"}/${path}`;
}

function authHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` };
}

/** Checks Meta's X-Hub-Signature-256 header (HMAC-SHA256 of the raw body with the app secret). */
export function verifySignature(rawBody: Buffer, signatureHeader: string | null, appSecret: string): boolean {
  if (!signatureHeader?.startsWith("sha256=")) {
    return false;
  }

  const expected = createHmac("sha256", appSecret).update(rawBody).digest();
  const given = Buffer.from(signatureHeader.slice("sha256=".length), "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

async function sendMessage(to: string, message: Record<string, unknown>): Promise<void> {
  const response = await fetch(graphUrl(`${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`), {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to, ...message }),
  });

  if (!response.ok) {
    throw new Error(`WhatsApp send failed (${response.status}): ${await response.text()}`);
  }
}

export function sendText(to: string, body: string): Promise<void> {
  return sendMessage(to, { type: "text", text: { body: body.slice(0, 4096), preview_url: true } });
}

/** Template parameters may not contain newlines, tabs or long runs of spaces. */
function templateParam(text: string, max: number): string {
  const flat = text.replace(/\s*\n+\s*/g, " · ").replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}

/**
 * Asks the approver to approve or reject a draft. Uses the approved message
 * template named in WHATSAPP_APPROVAL_TEMPLATE when set (works at any time);
 * otherwise sends reply buttons, which WhatsApp only delivers within 24 hours
 * of the approver's last message to the bot.
 */
export function sendApprovalRequest({
  to,
  sender,
  summary,
  previewUrl,
  approveId,
  rejectId,
}: {
  to: string;
  sender: string;
  summary: string;
  previewUrl: string;
  approveId: string;
  rejectId: string;
}): Promise<void> {
  const template = process.env.WHATSAPP_APPROVAL_TEMPLATE;

  if (template) {
    return sendMessage(to, {
      type: "template",
      template: {
        name: template,
        language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en_US" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: templateParam(sender, 60) },
              { type: "text", text: templateParam(summary, 700) },
              { type: "text", text: previewUrl },
            ],
          },
          { type: "button", sub_type: "quick_reply", index: "0", parameters: [{ type: "payload", payload: approveId }] },
          { type: "button", sub_type: "quick_reply", index: "1", parameters: [{ type: "payload", payload: rejectId }] },
        ],
      },
    });
  }

  const body = `New website update from ${sender}:\n\n${summary}\n\nPreview: ${previewUrl}`;
  return sendMessage(to, {
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: body.length > 1024 ? `${body.slice(0, 1023)}…` : body },
      action: {
        buttons: [
          { type: "reply", reply: { id: approveId, title: "Approve" } },
          { type: "reply", reply: { id: rejectId, title: "Reject" } },
        ],
      },
    },
  });
}

/** Downloads a media attachment (image, PDF) from a received message. */
export async function downloadMedia(mediaId: string, filename?: string): Promise<UpdateMedia> {
  const metaResponse = await fetch(graphUrl(mediaId), { headers: authHeaders() });
  if (!metaResponse.ok) {
    throw new Error(`WhatsApp media lookup failed (${metaResponse.status})`);
  }

  const meta = (await metaResponse.json()) as { url?: string; mime_type?: string; file_size?: number };
  if (!meta.url || !meta.mime_type) {
    throw new Error("WhatsApp media lookup returned no URL");
  }
  if ((meta.file_size ?? 0) > MAX_MEDIA_BYTES) {
    throw new Error("The attachment is larger than 20 MB");
  }

  const fileResponse = await fetch(meta.url, { headers: authHeaders() });
  if (!fileResponse.ok) {
    throw new Error(`WhatsApp media download failed (${fileResponse.status})`);
  }

  return {
    data: Buffer.from(await fileResponse.arrayBuffer()),
    mimeType: meta.mime_type.split(";")[0].trim(),
    filename,
  };
}
