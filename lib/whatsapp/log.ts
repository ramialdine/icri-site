import { createHash } from "node:crypto";

import { sanityWriteClient } from "@/sanity/lib/writeClient";

export type BotLogFields = {
  kind?: "monthly_schedule" | "event" | "announcement" | "decision" | "none";
  status?: "received" | "drafted" | "approved" | "rejected" | "ignored" | "failed";
  draftId?: string;
  note?: string;
};

function requireClient() {
  if (!sanityWriteClient) {
    throw new Error("SANITY_API_WRITE_TOKEN is not configured");
  }
  return sanityWriteClient;
}

// The "." makes the ID a private path: these entries hold phone numbers, and
// documents under a path are only readable with a token.
function logId(messageId: string): string {
  return `botlog.${createHash("sha256").update(messageId).digest("hex").slice(0, 32)}`;
}

/**
 * Records a received message. Returns false if it was already recorded, since
 * Meta re-delivers webhooks it thinks failed.
 */
export async function claimMessage(messageId: string, sender: string): Promise<boolean> {
  try {
    await requireClient().create({
      _id: logId(messageId),
      _type: "botLog",
      messageId,
      sender,
      status: "received",
      receivedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode === 409) {
      return false;
    }
    throw error;
  }
}

export async function updateLog(messageId: string, fields: BotLogFields): Promise<void> {
  await requireClient().patch(logId(messageId)).set(fields).commit();
}

/** Marks the entry for the message that created a draft as approved or rejected. */
export async function updateDraftLog(draftId: string, status: "approved" | "rejected"): Promise<void> {
  const client = requireClient();
  const id = await client.fetch<string | null>(`*[_type == "botLog" && draftId == $draftId && status == "drafted"] | order(receivedAt desc)[0]._id`, { draftId });
  if (id) {
    await client.patch(id).set({ status }).commit();
  }
}
