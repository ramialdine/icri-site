import { describe, expect, it } from "vitest";

import { currentOccurrence, describeRecurrence, monthlyWeekOf, normalizeRecurrence, type EventRecurrence } from "./recurrence";

const iso = (ms: number) => new Date(ms).toISOString();
const at = (value: string) => new Date(value).getTime();

// First session: Saturday Oct 3, 2026, 7:00–8:30 PM EDT.
const FIRST_START = "2026-10-03T23:00:00.000Z";
const FIRST_END = "2026-10-04T00:30:00.000Z";

describe("currentOccurrence", () => {
  const weekly: EventRecurrence = { frequency: "weekly", interval: 1, weekdays: ["sat"] };

  it("returns the first session before the series starts", () => {
    const occurrence = currentOccurrence(FIRST_START, FIRST_END, weekly, at("2026-09-30T12:00:00Z"));
    expect(occurrence && iso(occurrence.startMs)).toBe(FIRST_START);
    expect(occurrence?.isPast).toBe(false);
  });

  it("keeps the same local time across the end of daylight saving time", () => {
    // Nov 1, 2026 clocks go back, so 7 PM is 00:00 UTC instead of 23:00 UTC.
    const occurrence = currentOccurrence(FIRST_START, FIRST_END, weekly, at("2026-11-02T12:00:00Z"));
    expect(occurrence && iso(occurrence.startMs)).toBe("2026-11-08T00:00:00.000Z");
    expect(occurrence && iso(occurrence.endMs)).toBe("2026-11-08T01:30:00.000Z");
  });

  it("returns the session in progress until it ends", () => {
    const occurrence = currentOccurrence(FIRST_START, FIRST_END, weekly, at("2026-10-10T23:30:00Z"));
    expect(occurrence && iso(occurrence.startMs)).toBe("2026-10-10T23:00:00.000Z");
  });

  it("handles every other week on several days", () => {
    const rule: EventRecurrence = { frequency: "weekly", interval: 2, weekdays: ["wed", "sat"] };
    // Sessions: Sat Oct 3, Wed Oct 14, Sat Oct 17, Wed Oct 28, ...
    const occurrence = currentOccurrence(FIRST_START, FIRST_END, rule, at("2026-10-05T12:00:00Z"));
    expect(occurrence && iso(occurrence.startMs)).toBe("2026-10-14T23:00:00.000Z");
  });

  it("marks the series past after the last session and returns that session", () => {
    const rule: EventRecurrence = { ...weekly, until: "2026-10-24" };
    const occurrence = currentOccurrence(FIRST_START, FIRST_END, rule, at("2026-11-20T12:00:00Z"));
    expect(occurrence).toEqual({ startMs: at("2026-10-24T23:00:00Z"), endMs: at("2026-10-25T00:30:00Z"), isPast: true });
  });

  it("finds the nth and last weekday of each month", () => {
    const firstSaturday: EventRecurrence = { frequency: "monthly", monthlyWeek: "1" };
    expect(iso(currentOccurrence(FIRST_START, FIRST_END, firstSaturday, at("2026-10-05T12:00:00Z"))!.startMs)).toBe(
      "2026-11-08T00:00:00.000Z" // Sat Nov 7, 7 PM EST
    );

    const lastFriday = "2026-10-30T23:00:00.000Z"; // Fri Oct 30, 7 PM EDT
    const lastRule: EventRecurrence = { frequency: "monthly", monthlyWeek: "last" };
    expect(iso(currentOccurrence(lastFriday, undefined, lastRule, at("2026-11-01T12:00:00Z"))!.startMs)).toBe(
      "2026-11-28T00:00:00.000Z" // Fri Nov 27, 7 PM EST
    );
  });
});

describe("normalizeRecurrence", () => {
  it("treats a missing or unknown frequency as a one-time event", () => {
    expect(normalizeRecurrence(null, FIRST_START)).toBeNull();
    expect(normalizeRecurrence({ frequency: "daily" }, FIRST_START)).toBeNull();
  });

  it("always includes the first session's weekday and clamps the interval", () => {
    expect(normalizeRecurrence({ frequency: "weekly", interval: 9, weekdays: ["wed"] }, FIRST_START)).toEqual({
      frequency: "weekly",
      interval: 1,
      weekdays: ["wed", "sat"],
    });
  });

  it("rejects a monthly rule without a week and an end date before the start", () => {
    expect(normalizeRecurrence({ frequency: "monthly" }, FIRST_START)).toBeNull();
    expect(normalizeRecurrence({ frequency: "weekly", until: "2026-09-01" }, FIRST_START)).toBeNull();
  });
});

describe("describeRecurrence", () => {
  it("describes weekly and monthly rules in plain language", () => {
    expect(describeRecurrence({ frequency: "weekly", interval: 1, weekdays: ["sat"] }, FIRST_START)).toBe("Every Saturday");
    expect(describeRecurrence({ frequency: "weekly", interval: 2, weekdays: ["mon", "wed", "sat"] }, FIRST_START)).toBe(
      "Every other Monday, Wednesday and Saturday"
    );
    expect(describeRecurrence({ frequency: "monthly", monthlyWeek: "1", until: "2027-06-05" }, FIRST_START)).toBe(
      "First Saturday of every month until Jun 5, 2027"
    );
  });
});

describe("monthlyWeekOf", () => {
  it("reports the week of the month and whether it is the last one", () => {
    expect(monthlyWeekOf("2026-10-03")).toEqual({ nth: 1, isLast: false });
    expect(monthlyWeekOf("2026-10-30")).toEqual({ nth: 5, isLast: true });
    expect(monthlyWeekOf("2026-10-24")).toEqual({ nth: 4, isLast: false });
  });
});
