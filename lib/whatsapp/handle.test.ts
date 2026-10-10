import { beforeEach, describe, expect, it, vi } from "vitest";

import { createDraft, discardDraft, publishDraft } from "@/lib/updates/drafts";
import { extractUpdate } from "@/lib/updates/extract";

import { downloadMedia, sendApprovalRequest, sendText } from "./client";
import { handleWebhookPayload } from "./handle";
import { claimMessage, updateDraftLog, updateLog } from "./log";

vi.mock("./client", () => ({
  sendText: vi.fn(),
  sendApprovalRequest: vi.fn(),
  downloadMedia: vi.fn(),
}));

vi.mock("./log", () => ({
  claimMessage: vi.fn(),
  updateLog: vi.fn(),
  updateDraftLog: vi.fn(),
}));

vi.mock("@/lib/updates/extract", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/updates/extract")>()),
  extractUpdate: vi.fn(),
}));

vi.mock("@/lib/updates/drafts", () => ({
  createDraft: vi.fn(),
  publishDraft: vi.fn(),
  discardDraft: vi.fn(),
  uploadFlyer: vi.fn(),
}));

const APPROVER = "14015550100";
const ADMIN = "14015550111";
const STRANGER = "14015550199";

function payload(message: Record<string, unknown>, name = "Admin") {
  return {
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          {
            field: "messages",
            value: {
              contacts: [{ wa_id: message.from, profile: { name } }],
              messages: [message],
            },
          },
        ],
      },
    ],
  };
}

const textMessage = (from: string, body: string) => ({ id: `wamid.${from}.${body}`, from, type: "text", text: { body } });
const buttonTap = (from: string, buttonPayload: string) => ({
  id: `wamid.${from}.${buttonPayload}`,
  from,
  type: "button",
  button: { payload: buttonPayload, text: "Approve" },
});

describe("handleWebhookPayload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("WHATSAPP_APPROVER", `+1 (401) 555-0100`);
    vi.stubEnv("WHATSAPP_ALLOWED_SENDERS", `+1 401 555 0111`);
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.org/");
    vi.mocked(claimMessage).mockResolvedValue(true);
    vi.mocked(updateLog).mockResolvedValue();
    vi.mocked(sendText).mockResolvedValue();
  });

  it("drafts an update from an allowed sender and asks the approver", async () => {
    vi.mocked(extractUpdate).mockResolvedValue({
      ok: true,
      draft: { kind: "announcement", title: "Parking", message: "Use the back lot this Friday." },
    });
    vi.mocked(createDraft).mockResolvedValue({
      draftId: "drafts.wa-announcement-1",
      rev: "rev1",
      previewPath: "/preview/announcements?id=drafts.wa-announcement-1",
    });

    await handleWebhookPayload(payload(textMessage(ADMIN, "Parking notice")));

    expect(extractUpdate).toHaveBeenCalledWith({ text: "Parking notice", media: undefined });
    expect(sendApprovalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        to: APPROVER,
        sender: `Admin (+${ADMIN})`,
        previewUrl: "https://example.org/preview/announcements?id=drafts.wa-announcement-1",
        approveId: "approve:drafts.wa-announcement-1:rev1",
        rejectId: "reject:drafts.wa-announcement-1:rev1",
      })
    );
    expect(sendText).toHaveBeenCalledWith(ADMIN, expect.stringContaining("sent it for approval"));
    expect(updateLog).toHaveBeenLastCalledWith(
      `wamid.${ADMIN}.Parking notice`,
      expect.objectContaining({ status: "drafted", draftId: "drafts.wa-announcement-1" })
    );
  });

  it("downloads a forwarded flyer before extracting", async () => {
    const media = { data: Buffer.from("pdf"), mimeType: "application/pdf", filename: "october.pdf" };
    vi.mocked(downloadMedia).mockResolvedValue(media);
    vi.mocked(extractUpdate).mockResolvedValue({ ok: false, reason: "A greeting." });

    await handleWebhookPayload(
      payload({
        id: "wamid.doc",
        from: APPROVER,
        type: "document",
        document: { id: "media-1", mime_type: "application/pdf", filename: "october.pdf", caption: "October" },
      })
    );

    expect(downloadMedia).toHaveBeenCalledWith("media-1", "october.pdf");
    expect(extractUpdate).toHaveBeenCalledWith({ text: "October", media });
    expect(sendText).toHaveBeenCalledWith(APPROVER, "I couldn't turn that into a website update: A greeting.");
    expect(createDraft).not.toHaveBeenCalled();
  });

  it("ignores senders who are not on the allowlist", async () => {
    await handleWebhookPayload(payload(textMessage(STRANGER, "Change Isha to 9pm")));

    expect(extractUpdate).not.toHaveBeenCalled();
    expect(sendText).not.toHaveBeenCalled();
    expect(updateLog).toHaveBeenCalledWith(`wamid.${STRANGER}.Change Isha to 9pm`, {
      status: "ignored",
      note: "Sender is not on the allowlist.",
    });
  });

  it("skips a message Meta delivers twice", async () => {
    vi.mocked(claimMessage).mockResolvedValue(false);

    await handleWebhookPayload(payload(textMessage(ADMIN, "Parking notice")));

    expect(extractUpdate).not.toHaveBeenCalled();
    expect(updateLog).not.toHaveBeenCalled();
  });

  it("publishes when the approver taps Approve", async () => {
    vi.mocked(publishDraft).mockResolvedValue({ status: "published", livePath: "/announcements" });

    await handleWebhookPayload(payload(buttonTap(APPROVER, "approve:drafts.wa-announcement-1:rev1")));

    expect(publishDraft).toHaveBeenCalledWith("drafts.wa-announcement-1", "rev1");
    expect(sendText).toHaveBeenCalledWith(APPROVER, "Published. It's live at https://example.org/announcements");
    expect(updateDraftLog).toHaveBeenCalledWith("drafts.wa-announcement-1", "approved");
  });

  it("discards when the approver taps Reject", async () => {
    vi.mocked(discardDraft).mockResolvedValue({ status: "discarded" });

    await handleWebhookPayload(payload(buttonTap(APPROVER, "reject:drafts.monthlySchedule-2026-10:rev2")));

    expect(discardDraft).toHaveBeenCalledWith("drafts.monthlySchedule-2026-10", "rev2");
    expect(updateDraftLog).toHaveBeenCalledWith("drafts.monthlySchedule-2026-10", "rejected");
  });

  it("ignores Approve taps from anyone but the approver", async () => {
    await handleWebhookPayload(payload(buttonTap(ADMIN, "approve:drafts.wa-announcement-1:rev1")));

    expect(publishDraft).not.toHaveBeenCalled();
    expect(sendText).not.toHaveBeenCalled();
  });

  it("tells an allowed sender when something fails", async () => {
    vi.mocked(extractUpdate).mockRejectedValue(new Error("Anthropic is down"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    await handleWebhookPayload(payload(textMessage(ADMIN, "Parking notice")));

    expect(updateLog).toHaveBeenCalledWith(`wamid.${ADMIN}.Parking notice`, {
      status: "failed",
      note: "Anthropic is down",
    });
    expect(sendText).toHaveBeenCalledWith(ADMIN, expect.stringContaining("something went wrong"));
  });
});
