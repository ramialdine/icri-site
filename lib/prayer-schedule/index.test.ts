import { describe, expect, it } from "vitest";

import { flyerTimeTo24, getScheduledDay } from ".";

describe("flyerTimeTo24", () => {
  it("converts flyer times to 24-hour format", () => {
    expect(flyerTimeTo24("4:33a")).toBe("04:33");
    expect(flyerTimeTo24("12:46p")).toBe("12:46");
    expect(flyerTimeTo24("1:00p")).toBe("13:00");
    expect(flyerTimeTo24("9:00p")).toBe("21:00");
  });

  it("rejects malformed times", () => {
    expect(() => flyerTimeTo24("25:00")).toThrow();
  });
});

describe("getScheduledDay", () => {
  it("returns the printed row for a scheduled date", () => {
    expect(getScheduledDay("2026-09-23")).toEqual({
      fajr18: "05:01",
      fajrNA: "05:18",
      fajrIqama: "05:30",
      sunrise: "06:33",
      dhuhr: "12:39",
      dhuhrIqama: "13:00",
      asrShafi: "16:04",
      asrHanafi: "16:55",
      asrIqama: "17:15",
      maghrib: "18:43",
      isha: "20:00",
      ishaIqama: "20:15",
    });
  });

  it("parses every day of every published month", () => {
    for (let day = 1; day <= 30; day += 1) {
      expect(getScheduledDay(`2026-09-${String(day).padStart(2, "0")}`)).not.toBeNull();
    }
  });

  it("returns null for dates without a published schedule", () => {
    expect(getScheduledDay("2026-10-01")).toBeNull();
    expect(getScheduledDay("not-a-date")).toBeNull();
  });
});
