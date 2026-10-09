import { describe, expect, it } from "vitest";

import { daysInMonth, flyerTimeTo24, parseFlyerRow } from ".";
import { september2026 } from "./fixtures/september-2026";

describe("flyerTimeTo24", () => {
  it("converts flyer times to 24-hour format", () => {
    expect(flyerTimeTo24("4:33a")).toBe("04:33");
    expect(flyerTimeTo24("12:46p")).toBe("12:46");
    expect(flyerTimeTo24("12:05a")).toBe("00:05");
    expect(flyerTimeTo24("1:00p")).toBe("13:00");
    expect(flyerTimeTo24("9:00 PM")).toBe("21:00");
  });

  it("rejects malformed times", () => {
    expect(() => flyerTimeTo24("25:00")).toThrow();
    expect(() => flyerTimeTo24("13:00p")).toThrow();
    expect(() => flyerTimeTo24("5:3a")).toThrow();
  });
});

describe("parseFlyerRow", () => {
  it("parses a printed row into named 24-hour columns", () => {
    expect(parseFlyerRow(september2026[23])).toEqual({
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

  it("parses every row of the September 2026 flyer", () => {
    for (let day = 1; day <= 30; day += 1) {
      expect(() => parseFlyerRow(september2026[day])).not.toThrow();
    }
  });

  it("rejects rows with the wrong number of columns", () => {
    expect(() => parseFlyerRow("4:33a 4:51a")).toThrow(/expected 12/);
  });
});

describe("daysInMonth", () => {
  it("handles month lengths and leap years", () => {
    expect(daysInMonth("2026-09")).toBe(30);
    expect(daysInMonth("2026-10")).toBe(31);
    expect(daysInMonth("2028-02")).toBe(29);
  });
});
