import { describeDraft } from "@/lib/updates/describe";
import { createDraft, discardDraft, publishDraft, uploadFlyer } from "@/lib/updates/drafts";
import { extractUpdate, SUPPORTED_MEDIA_TYPES, type UpdateMedia } from "@/lib/updates/extract";

import { downloadMedia, sendApprovalRequest, sendText } from "./client";
import { getBotConfig, normalizePhone } from "./config";
import { claimMessage, updateDraftLog, updateLog } from "./log";

export type WhatsAppMessage = {
  id: string;
  from: string;
  type: string;
  profileName?: string;
  text?: { body?: string };
  image?: { id: string; mime_type?: string; caption?: string };
  document?: { id: string; mime_type?: string; caption?: string; filename?: string };
  button?: { payload?: string; text?: string };
  interactive?: { type?: string; button_reply?: { id?: string; title?: string } };
};

type WebhookValue = {
  contacts?: { wa_id?: string; profile?: { name?: string } }[];
  messages?: Omit<WhatsAppMessage, "profileName">[];
};

type WebhookPayload = {
  entry?: { changes?: { field?: string; value?: WebhookValue }[] }[];
};

const DECISION_PATTERN = /^(approve|reject):(drafts\.[A-Za-z0-9._-]+):([A-Za-z0-9]+)$/;

/** Pulls the received messages (not delivery statuses) out of a webhook payload. */
export function collectMessages(payload: unknown): WhatsAppMessage[] {
  const messages: WhatsAppMessage[] = [];

  for (const entry of (payload as WebhookPayload)?.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") {
        continue;
      }

      const names = new Map(
        (change.value?.contacts ?? []).map((contact) => [contact.wa_id ?? "", contact.profile?.name])
      );
      for (const message of change.value?.messages ?? []) {
        if (message?.id && message.from) {
          messages.push({ ...message, profileName: names.get(message.from) });
        }
      }
    }
  }

  return messages;
}

/** The approve/reject payload of a tapped button, if this message is one. */
function decisionPayload(message: WhatsAppMessage): string | undefined {
  if (message.type === "button") {
    return message.button?.payload;
  }
  if (message.type === "interactive" && message.interactive?.type === "button_reply") {
    return message.interactive.button_reply?.id;
  }
  return undefined;
}

function displaySender(message: WhatsAppMessage, sender: string): string {
  return message.profileName ? `${message.profileName} (+${sender})` : `+${sender}`;
}

async function handleDecision(messageId: string, sender: string, payload: string): Promise<void> {
  const { approver, siteUrl } = getBotConfig();
  const match = DECISION_PATTERN.exec(payload);

  if (!match || sender !== approver) {
    await updateLog(messageId, {
      kind: "decision",
      status: "ignored",
      note: match ? "Button tapped by a number that is not the approver." : "Unrecognized button payload.",
    });
    return;
  }

  const [, action, draftId, rev] = match;
  const result = action === "approve" ? await publishDraft(draftId, rev) : await discardDraft(draftId, rev);

  switch (result.status) {
    case "published":
      await sendText(sender, `Published. It's live at ${siteUrl}${result.livePath}`);
      await updateDraftLog(draftId, "approved");
      break;
    case "discarded":
      await sendText(sender, "Rejected. The draft was deleted and nothing changed on the website.");
      await updateDraftLog(draftId, "rejected");
      break;
    case "missing":
      await sendText(sender, "That draft was already approved, rejected or deleted, so nothing changed.");
      break;
    case "stale":
      await sendText(
        sender,
        "That draft changed after this approval message was sent, so nothing changed. Use the newest approval message, or publish it from Sanity Studio."
      );
      break;
  }

  await updateLog(messageId, {
    kind: "decision",
    status: result.status === "published" ? "approved" : result.status === "discarded" ? "rejected" : "ignored",
    draftId,
    note: `${action}: ${result.status}`,
  });
}

async function handleUpdate(message: WhatsAppMessage, sender: string): Promise<void> {
  const { approver, allowedSenders, siteUrl } = getBotConfig();

  if (!allowedSenders.has(sender)) {
    await updateLog(message.id, { status: "ignored", note: "Sender is not on the allowlist." });
    return;
  }

  const attachment = message.image ?? message.document;
  const mimeType = attachment?.mime_type?.split(";")[0].trim();
  if (!["text", "image", "document"].includes(message.type) || (attachment && !SUPPORTED_MEDIA_TYPES.has(mimeType ?? ""))) {
    await sendText(sender, "I can only read text messages, photos and PDF files. Please send the flyer as a photo or PDF.");
    await updateLog(message.id, { kind: "none", status: "ignored", note: `Unsupported message type: ${mimeType ?? message.type}` });
    return;
  }

  const text = message.text?.body ?? attachment?.caption ?? "";
  let media: UpdateMedia | undefined;
  if (attachment) {
    media = await downloadMedia(attachment.id, message.document?.filename);
  }

  const result = await extractUpdate({ text, media });
  if (!result.ok) {
    await sendText(sender, `I couldn't turn that into a website update: ${result.reason}`);
    await updateLog(message.id, { kind: "none", status: "ignored", note: result.reason });
    return;
  }

  const { draft } = result;
  const flyerAssetId =
    draft.kind === "event" && media?.mimeType.startsWith("image/") ? await uploadFlyer(media, draft.title) : undefined;
  const created = await createDraft(draft, { flyerAssetId });
  const summary = describeDraft(draft);

  await sendApprovalRequest({
    to: approver,
    sender: displaySender(message, sender),
    summary,
    previewUrl: `${siteUrl}${created.previewPath}`,
    approveId: `approve:${created.draftId}:${created.rev}`,
    rejectId: `reject:${created.draftId}:${created.rev}`,
  });

  if (sender !== approver) {
    await sendText(sender, "Thanks. I drafted this update and sent it for approval.");
  }

  await updateLog(message.id, { kind: draft.kind, status: "drafted", draftId: created.draftId, note: summary });
}

async function handleMessage(message: WhatsAppMessage): Promise<void> {
  const sender = normalizePhone(message.from);

  if (!(await claimMessage(message.id, sender))) {
    return;
  }

  try {
    const decision = decisionPayload(message);
    if (decision !== undefined) {
      await handleDecision(message.id, sender, decision);
    } else {
      await handleUpdate(message, sender);
    }
  } catch (error) {
    console.error("WhatsApp bot failed to handle a message", error);
    await updateLog(message.id, { status: "failed", note: (error as Error).message }).catch(() => {});

    if (getBotConfig().allowedSenders.has(sender)) {
      await sendText(
        sender,
        "Sorry, something went wrong while handling that message. Please try again, or make the change in Sanity Studio."
      ).catch(() => {});
    }
  }
}

/** Handles every message in a verified webhook delivery, one at a time. */
export async function handleWebhookPayload(payload: unknown): Promise<void> {
  for (const message of collectMessages(payload)) {
    await handleMessage(message);
  }
}
