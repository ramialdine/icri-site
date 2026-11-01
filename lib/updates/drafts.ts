import { randomUUID } from "node:crypto";

import { sanityWriteClient } from "@/sanity/lib/writeClient";

import type { DraftInput, UpdateMedia } from "./extract";

export type CreatedDraft = { draftId: string; rev: string; previewPath: string };

export type DecisionResult =
  | { status: "published"; livePath: string }
  | { status: "discarded" }
  | { status: "missing" }
  | { status: "stale" };

const LIVE_PATHS: Record<string, string> = {
  monthlySchedule: "/#prayers",
  event: "/events",
  announcement: "/announcements",
};

function requireClient() {
  if (!sanityWriteClient) {
    throw new Error("SANITY_API_WRITE_TOKEN is not configured");
  }
  return sanityWriteClient;
}

/** Uploads an event flyer image to Sanity and returns its asset ID. */
export async function uploadFlyer(media: UpdateMedia, title: string): Promise<string> {
  const asset = await requireClient().assets.upload("image", media.data, {
    contentType: media.mimeType,
    filename: media.filename || `${title.slice(0, 60)}.${media.mimeType.split("/")[1] ?? "jpg"}`,
  });
  return asset._id;
}

/** Saves an extracted update as an unpublished Sanity draft. */
export async function createDraft(input: DraftInput, options: { flyerAssetId?: string } = {}): Promise<CreatedDraft> {
  const client = requireClient();

  switch (input.kind) {
    case "monthly_schedule": {
      // One timetable per month: re-sending a month's flyer replaces its pending draft.
      const draftId = `drafts.monthlySchedule-${input.month}`;
      const doc = await client.createOrReplace({
        _id: draftId,
        _type: "monthlySchedule",
        month: input.month,
        days: input.days.map((day) => ({ _key: `day-${day.day}`, _type: "scheduleDay", ...day })),
      });
      return { draftId, rev: doc._rev, previewPath: `/preview/schedule?id=${draftId}` };
    }
    case "event": {
      const draftId = `drafts.wa-event-${randomUUID()}`;
      const doc = await client.createOrReplace({
        _id: draftId,
        _type: "event",
        title: input.title,
        summary: input.summary,
        startAt: input.startAt,
        endAt: input.endAt,
        location: input.location,
        isPublished: true,
        ...(options.flyerAssetId
          ? {
              flyerImage: {
                _type: "image",
                asset: { _type: "reference", _ref: options.flyerAssetId },
                alt: `${input.title} flyer`,
              },
            }
          : {}),
      });
      return { draftId, rev: doc._rev, previewPath: `/preview/events?id=${draftId}` };
    }
    case "announcement": {
      const draftId = `drafts.wa-announcement-${randomUUID()}`;
      const doc = await client.createOrReplace({
        _id: draftId,
        _type: "announcement",
        title: input.title,
        message: input.message,
        startAt: input.startAt,
        endAt: input.endAt,
        isPinned: false,
        isActive: true,
      });
      return { draftId, rev: doc._rev, previewPath: `/preview/announcements?id=${draftId}` };
    }
  }
}

/** Publishes a draft, but only if it is unchanged since the approval request was sent. */
export async function publishDraft(draftId: string, expectedRev: string): Promise<DecisionResult> {
  const client = requireClient();
  const draft = await client.getDocument(draftId);

  if (!draft) {
    return { status: "missing" };
  }
  if (draft._rev !== expectedRev) {
    return { status: "stale" };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _rev, _createdAt, _updatedAt, ...content } = draft;
  await client
    .transaction()
    .createOrReplace({ ...content, _id: draftId.replace(/^drafts\./, "") })
    .delete(draftId)
    .commit();

  return { status: "published", livePath: LIVE_PATHS[draft._type] ?? "/" };
}

/** Deletes a draft, but only if it is unchanged since the approval request was sent. */
export async function discardDraft(draftId: string, expectedRev: string): Promise<DecisionResult> {
  const client = requireClient();
  const draft = await client.getDocument(draftId);

  if (!draft) {
    return { status: "missing" };
  }
  if (draft._rev !== expectedRev) {
    return { status: "stale" };
  }

  await client.delete(draftId);
  return { status: "discarded" };
}
