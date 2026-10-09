import { createHmac } from "node:crypto";

import { describe, expect, it, vi } from "vitest";

import { sendApprovalRequest, verifySignature } from "./client";

describe("verifySignature", () => {
  const body = Buffer.from(JSON.stringify({ object: "whatsapp_business_account", entry: [] }));
  const sign = (secret: string) => `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;

  it("accepts a body signed with the app secret", () => {
    expect(verifySignature(body, sign("app-secret"), "app-secret")).toBe(true);
  });

  it("rejects a wrong, missing or malformed signature", () => {
    expect(verifySignature(body, sign("other-secret"), "app-secret")).toBe(false);
    expect(verifySignature(body, null, "app-secret")).toBe(false);
    expect(verifySignature(body, "sha256=abc", "app-secret")).toBe(false);
    expect(verifySignature(Buffer.from(`${body} `), sign("app-secret"), "app-secret")).toBe(false);
  });
});

describe("sendApprovalRequest", () => {
  const request = {
    to: "14015550100",
    sender: "Admin (+14015550111)",
    summary: "Event \"Open House\".\nSaturday at noon.",
    previewUrl: "https://example.org/preview/events?id=drafts.wa-event-1",
    approveId: "approve:drafts.wa-event-1:rev1",
    rejectId: "reject:drafts.wa-event-1:rev1",
  };

  function stubSend() {
    vi.stubEnv("WHATSAPP_TOKEN", "token");
    vi.stubEnv("WHATSAPP_PHONE_NUMBER_ID", "12345");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 200 }));
    return () => JSON.parse(fetchMock.mock.calls[0][1]!.body as string);
  }

  it("sends reply buttons when no template is configured", async () => {
    vi.stubEnv("WHATSAPP_APPROVAL_TEMPLATE", "");
    const sentBody = stubSend();

    await sendApprovalRequest(request);

    expect(sentBody()).toMatchObject({
      to: "14015550100",
      type: "interactive",
      interactive: {
        action: {
          buttons: [
            { reply: { id: request.approveId, title: "Approve" } },
            { reply: { id: request.rejectId, title: "Reject" } },
          ],
        },
      },
    });
  });

  it("uses the approval template with single-line parameters when configured", async () => {
    vi.stubEnv("WHATSAPP_APPROVAL_TEMPLATE", "icri_update_approval");
    const sentBody = stubSend();

    await sendApprovalRequest(request);

    const body = sentBody();
    expect(body.template.name).toBe("icri_update_approval");
    expect(body.template.components[0].parameters[1].text).toBe('Event "Open House". · Saturday at noon.');
    expect(body.template.components[1].parameters[0].payload).toBe(request.approveId);
    expect(body.template.components[2].parameters[0].payload).toBe(request.rejectId);
  });
});
