import { createHmac } from "node:crypto";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { missingBotSettings } from "@/lib/whatsapp/config";
import { handleWebhookPayload } from "@/lib/whatsapp/handle";

import { GET, POST } from "./route";

vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/server")>()),
  after: (task: () => unknown) => task(),
}));

vi.mock("@/lib/whatsapp/config", () => ({ missingBotSettings: vi.fn() }));
vi.mock("@/lib/whatsapp/handle", () => ({ handleWebhookPayload: vi.fn() }));

const URL_BASE = "https://example.org/api/whatsapp/webhook";

function post(body: string, signature?: string) {
  return new Request(URL_BASE, {
    method: "POST",
    headers: signature ? { "x-hub-signature-256": signature } : {},
    body,
  });
}

describe("GET /api/whatsapp/webhook", () => {
  it("answers Meta's verification challenge with the right token", async () => {
    vi.stubEnv("WHATSAPP_VERIFY_TOKEN", "verify-me");

    const ok = await GET(new Request(`${URL_BASE}?hub.mode=subscribe&hub.verify_token=verify-me&hub.challenge=42`));
    const bad = await GET(new Request(`${URL_BASE}?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=42`));

    expect(ok.status).toBe(200);
    expect(await ok.text()).toBe("42");
    expect(bad.status).toBe(403);
  });
});

describe("POST /api/whatsapp/webhook", () => {
  const body = JSON.stringify({ object: "whatsapp_business_account", entry: [] });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("WHATSAPP_APP_SECRET", "app-secret");
    vi.mocked(missingBotSettings).mockReturnValue([]);
    vi.mocked(handleWebhookPayload).mockResolvedValue();
  });

  it("processes a correctly signed delivery", async () => {
    const signature = `sha256=${createHmac("sha256", "app-secret").update(body).digest("hex")}`;

    const response = await POST(post(body, signature));

    expect(response.status).toBe(200);
    expect(handleWebhookPayload).toHaveBeenCalledWith(JSON.parse(body));
  });

  it("rejects a delivery with a bad signature", async () => {
    const response = await POST(post(body, "sha256=00"));

    expect(response.status).toBe(401);
    expect(handleWebhookPayload).not.toHaveBeenCalled();
  });

  it("reports missing settings instead of processing", async () => {
    vi.mocked(missingBotSettings).mockReturnValue(["ANTHROPIC_API_KEY"]);

    const response = await POST(post(body));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "WhatsApp bot is not configured: ANTHROPIC_API_KEY" });
  });
});
