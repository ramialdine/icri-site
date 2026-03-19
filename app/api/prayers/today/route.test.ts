import { describe, expect, it, vi } from "vitest";

import { getTodayPrayerPayload } from "@/sanity/lib/prayer";

import { GET } from "./route";

vi.mock("@/sanity/lib/prayer", () => ({
  getTodayPrayerPayload: vi.fn(),
}));

describe("GET /api/prayers/today", () => {
  it("returns live payload with cache headers", async () => {
    const payload = {
      date: "2026-03-19",
      source: { adhan: "aladhan", iqamah: "weeklyDefault" },
      prayers: [{ name: "Fajr" as const, adhan: "5:24 AM", iqamah: "5:45 AM" }],
      jumuahSessions: [] as { label: string; khutbah: string; iqamah: string }[],
    };

    vi.mocked(getTodayPrayerPayload).mockResolvedValue(payload);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("s-maxage=300, stale-while-revalidate=86400");
    expect(body).toEqual(payload);
  });

  it("returns stable fallback payload on failure", async () => {
    vi.mocked(getTodayPrayerPayload).mockRejectedValue(new Error("upstream failed"));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.source).toEqual({ adhan: "fallback", iqamah: "fallback" });
    expect(Array.isArray(body.prayers)).toBe(true);
    expect(body.prayers.length).toBeGreaterThan(0);
    expect(Array.isArray(body.jumuahSessions)).toBe(true);
    expect(body.jumuahSessions.length).toBeGreaterThan(0);
  });
});
