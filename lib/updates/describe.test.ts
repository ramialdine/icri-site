import { describe, expect, it } from "vitest";

import { describeDraft } from "./describe";

describe("describeDraft", () => {
  it("summarizes a program with its schedule and last date", () => {
    expect(
      describeDraft({
        kind: "program",
        title: "Youth Halaqa",
        description: "Weekly halaqa for ages 12-18.",
        scheduleText: "Every Saturday after Maghrib",
        iconKey: "users",
        endsOn: "2026-12-12",
      })
    ).toBe(
      'Program "Youth Halaqa" (Every Saturday after Maghrib): Weekly halaqa for ages 12-18. Shown on the website until Dec 12, 2026.'
    );
  });

  it("keeps the one-time event summary unchanged", () => {
    expect(describeDraft({ kind: "event", title: "Open House", startAt: "2026-11-21T17:00:00.000Z" })).toBe(
      'Event "Open House", Sat, Nov 21, 12:00 PM.'
    );
  });
});
