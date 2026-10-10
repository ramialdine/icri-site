import { beforeEach, describe, expect, it, vi } from "vitest";

import { parseFlyerRow } from "@/lib/prayer-schedule";
import { september2026 } from "@/lib/prayer-schedule/fixtures/september-2026";

import { sanityClient } from "./client";
import { getTodayPrayerPayload } from "./prayer";

vi.mock("./client", () => ({
  sanityClient: { fetch: vi.fn() },
}));

const aladhanTimings = {
  data: { timings: { Fajr: "05:10", Dhuhr: "12:36", Asr: "15:55", Maghrib: "18:31", Isha: "19:47" } },
};

function mockSanity(days: unknown) {
  vi.mocked(sanityClient!.fetch).mockImplementation((async (query: string) => {
    if (query.includes("monthlySchedule")) {
      return days;
    }
    return null; // no prayerConfig, no dateOverride
  }) as never);
}

describe("getTodayPrayerPayload", () => {
  beforeEach(() => {
    vi.mocked(sanityClient!.fetch).mockReset();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-09-23T16:00:00Z"));
  });

  it("uses the published monthly timetable when one exists for today", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    mockSanity([{ day: 23, ...parseFlyerRow(september2026[23]) }]);

    const payload = await getTodayPrayerPayload();

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(payload.source).toEqual({ adhan: "schedule", iqamah: "schedule" });
    expect(payload.prayers).toEqual([
      { name: "Fajr", adhan: "5:01 AM", iqamah: "5:30 AM" },
      { name: "Dhuhr", adhan: "12:39 PM", iqamah: "1:00 PM" },
      { name: "Asr", adhan: "4:04 PM", iqamah: "5:15 PM" },
      { name: "Maghrib", adhan: "6:43 PM", iqamah: "6:48 PM" },
      { name: "Isha", adhan: "8:00 PM", iqamah: "8:15 PM" },
    ]);
    vi.useRealTimers();
  });

  it("falls back to Aladhan when no timetable is published for the month", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(aladhanTimings));
    mockSanity(null);

    const payload = await getTodayPrayerPayload();

    expect(fetchSpy.mock.calls[0][0]).toContain("/timingsByCity/23-09-2026");
    expect(payload.source.adhan).toBe("aladhan");
    expect(payload.prayers[0]).toEqual({ name: "Fajr", adhan: "5:10 AM", iqamah: "5:25 AM" });
    vi.useRealTimers();
  });

  it("ignores a malformed timetable row", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(aladhanTimings));
    mockSanity([{ day: 23, ...parseFlyerRow(september2026[23]), isha: "8pm" }]);

    const payload = await getTodayPrayerPayload();

    expect(payload.source.adhan).toBe("aladhan");
    vi.useRealTimers();
  });
});
