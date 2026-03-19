import { describe, expect, it, vi } from "vitest";

import { getHomeContentPayload } from "@/sanity/lib/content";

import { GET } from "./route";

vi.mock("@/sanity/lib/content", () => ({
  getHomeContentPayload: vi.fn(),
}));

describe("GET /api/content/home", () => {
  it("returns CMS payload when available", async () => {
    const payload = {
      announcements: [{ title: "A", message: "B", isPinned: true }],
      events: [{ date: "Mar 20", title: "Event", detail: "Details", imageUrl: undefined, imageAlt: "Event flyer" }],
      programs: [{ iconKey: "book", title: "Program", text: "Description", imageUrl: undefined, imageAlt: "Program image" }],
    };

    vi.mocked(getHomeContentPayload).mockResolvedValue(payload);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body).toEqual(payload);
  });

  it("returns fallback payload when CMS returns null", async () => {
    vi.mocked(getHomeContentPayload).mockResolvedValue(null);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(Array.isArray(body.announcements)).toBe(true);
    expect(Array.isArray(body.events)).toBe(true);
    expect(Array.isArray(body.programs)).toBe(true);
    expect(body.events.length).toBeGreaterThan(0);
    expect(body.programs.length).toBeGreaterThan(0);
  });
});
