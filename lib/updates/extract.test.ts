import type Anthropic from "@anthropic-ai/sdk";
import { describe, expect, it, vi } from "vitest";

import { parseFlyerRow } from "@/lib/prayer-schedule";
import { september2026 } from "@/lib/prayer-schedule/fixtures/september-2026";

import { EXTRACTION_MODEL, extractUpdate, toDraftInput, type Extraction } from "./extract";
import { localTimeToUtcIso } from "./timezone";

function septemberExtraction(): Extraction {
  return {
    kind: "monthly_schedule",
    reason: "A monthly prayer timetable.",
    monthlySchedule: {
      month: "2026-09",
      rows: Array.from({ length: 30 }, (_, index) => ({
        day: index + 1,
        times: september2026[index + 1].split(" "),
      })),
    },
    event: null,
    announcement: null,
  };
}

describe("toDraftInput", () => {
  it("turns a transcribed flyer into the same rows as the hand-checked September 2026 timetable", () => {
    const result = toDraftInput(septemberExtraction());

    expect(result.ok).toBe(true);
    if (!result.ok || result.draft.kind !== "monthly_schedule") {
      throw new Error("expected a timetable draft");
    }
    expect(result.draft.month).toBe("2026-09");
    expect(result.draft.warnings).toEqual([]);
    expect(result.draft.days).toHaveLength(30);
    for (const day of result.draft.days) {
      expect(day).toEqual({ day: day.day, ...parseFlyerRow(september2026[day.day]) });
    }
  });

  it("rejects a timetable with missing days", () => {
    const extraction = septemberExtraction();
    extraction.monthlySchedule!.rows.pop();

    expect(toDraftInput(extraction)).toEqual({
      ok: false,
      reason: "The timetable has 29 rows but 2026-09 has 30 days.",
    });
  });

  it("rejects a timetable with an unreadable time", () => {
    const extraction = septemberExtraction();
    extraction.monthlySchedule!.rows[4].times[10] = "8:3?p";

    const result = toDraftInput(extraction);
    expect(result.ok).toBe(false);
    expect(!result.ok && result.reason).toMatch(/^Day 5: Invalid schedule time/);
  });

  it("flags a likely am/pm misread without rejecting the timetable", () => {
    const extraction = septemberExtraction();
    extraction.monthlySchedule!.rows[11].times[9] = "7:02a"; // Maghrib read as morning

    const result = toDraftInput(extraction);
    expect(result.ok && result.draft.kind === "monthly_schedule" && result.draft.warnings).toEqual([
      "Day 12 has times out of order",
    ]);
  });

  it("converts event times from masjid-local time to UTC", () => {
    const result = toDraftInput({
      kind: "event",
      reason: "An event flyer.",
      monthlySchedule: null,
      event: {
        title: " Halal Food Festival ",
        summary: "Food, vendors and henna art.",
        startLocal: "2026-09-12T13:00",
        endLocal: "2026-09-12T19:00",
        location: "",
      },
      announcement: null,
    });

    expect(result).toEqual({
      ok: true,
      draft: {
        kind: "event",
        title: "Halal Food Festival",
        summary: "Food, vendors and henna art.",
        startAt: "2026-09-12T17:00:00.000Z",
        endAt: "2026-09-12T23:00:00.000Z",
        location: undefined,
      },
    });
  });

  it("rejects an event that ends before it starts", () => {
    const result = toDraftInput({
      kind: "event",
      reason: "An event flyer.",
      monthlySchedule: null,
      event: { title: "Talk", summary: null, startLocal: "2026-11-01T19:00", endLocal: "2026-11-01T18:00", location: null },
      announcement: null,
    });

    expect(result.ok).toBe(false);
  });

  it("passes the model's reason through when the message is not an update", () => {
    expect(
      toDraftInput({ kind: "none", reason: "A greeting.", monthlySchedule: null, event: null, announcement: null })
    ).toEqual({ ok: false, reason: "A greeting." });
  });
});

describe("localTimeToUtcIso", () => {
  it("handles daylight saving and standard time", () => {
    expect(localTimeToUtcIso("2026-07-01T12:00")).toBe("2026-07-01T16:00:00.000Z");
    expect(localTimeToUtcIso("2026-12-01T12:00")).toBe("2026-12-01T17:00:00.000Z");
    expect(localTimeToUtcIso("2026-11-01T01:30")).toMatch(/^2026-11-01T0[56]:30:00.000Z$/);
  });

  it("rejects invalid values", () => {
    expect(localTimeToUtcIso("2026-02-30T12:00")).toBeNull();
    expect(localTimeToUtcIso("tomorrow at noon")).toBeNull();
  });
});

describe("extractUpdate", () => {
  it("sends the flyer and today's date to Claude and validates the answer", async () => {
    const parse = vi.fn().mockResolvedValue({ stop_reason: "end_turn", parsed_output: septemberExtraction() });
    const client = { messages: { parse } } as unknown as Anthropic;

    const result = await extractUpdate({
      text: "September schedule",
      media: { data: Buffer.from("fake-image"), mimeType: "image/jpeg" },
      now: new Date("2026-08-30T15:00:00Z"),
      client,
    });

    expect(result.ok).toBe(true);
    const request = parse.mock.calls[0][0];
    expect(EXTRACTION_MODEL).toBe("claude-sonnet-5-5");
    expect(request.model).toBe(EXTRACTION_MODEL);
    // No fallback, so a declined request is never re-run on another model.
    expect(request).not.toHaveProperty("fallbacks");
    expect(request).not.toHaveProperty("betas");
    expect(request.output_config.format).toBeDefined();
    expect(request.messages[0].content[0]).toMatchObject({
      type: "image",
      source: { type: "base64", media_type: "image/jpeg", data: Buffer.from("fake-image").toString("base64") },
    });
    expect(request.messages[0].content[1].text).toContain("Today is Sunday, 2026-08-30");
    expect(request.messages[0].content[1].text).toContain("September schedule");
  });

  it("reports a refusal instead of drafting anything", async () => {
    const parse = vi.fn().mockResolvedValue({ stop_reason: "refusal", parsed_output: null });
    const client = { messages: { parse } } as unknown as Anthropic;

    expect(await extractUpdate({ text: "hello", client })).toEqual({
      ok: false,
      reason: "The AI model declined to read this message.",
    });
  });
});
