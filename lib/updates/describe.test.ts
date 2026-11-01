import { describe, expect, it } from "vitest";

import { describeDraft } from "./describe";

describe("describeDraft", () => {
  it("spells out how a repeating event repeats in the approval summary", () => {
    expect(
      describeDraft({
        kind: "event",
        title: "Youth Halaqa",
        startAt: "2026-11-08T00:00:00.000Z",
        endAt: "2026-11-08T01:30:00.000Z",
        location: "Multipurpose Hall",
        recurrence: { frequency: "weekly", interval: 1, weekdays: ["sat"], until: "2026-12-12" },
      })
    ).toBe(
      'Repeating event "Youth Halaqa": Every Saturday until Dec 12, 2026. First session Sat, Nov 7, 7:00 PM–8:30 PM at Multipurpose Hall.'
    );
  });

  it("keeps the one-time event summary unchanged", () => {
    expect(
      describeDraft({ kind: "event", title: "Open House", startAt: "2026-11-21T17:00:00.000Z" })
    ).toBe('Event "Open House", Sat, Nov 21, 12:00 PM.');
  });
});
