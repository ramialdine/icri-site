import { beforeEach, describe, expect, it, vi } from "vitest";

import { sanityClient } from "./client";
import { formatAnnouncementWindow, getHomeContentPayload } from "./content";

vi.mock("./client", () => ({
  sanityClient: {
    fetch: vi.fn(),
  },
}));

type ChainedFetchMock = {
  mockReset: () => void;
  mockResolvedValueOnce: (value: unknown) => ChainedFetchMock;
};

describe("sanity/lib/content", () => {
  beforeEach(() => {
    (vi.mocked(sanityClient!.fetch) as unknown as ChainedFetchMock).mockReset();
  });

  it("returns only upcoming events for home payload", async () => {
    vi.spyOn(Date, "now").mockReturnValue(new Date("2026-03-19T12:00:00.000Z").getTime());

    const fetchMock = vi.mocked(sanityClient!.fetch) as unknown as ChainedFetchMock;

    fetchMock
      .mockResolvedValueOnce([{ title: "Notice", message: "Message", isPinned: false }])
      .mockResolvedValueOnce([
        {
          _id: "future-1",
          title: "Future Event",
          summary: "Future details",
          startAt: "2026-03-20T15:00:00.000Z",
          flyerImage: { alt: "Future flyer", url: "https://img/future.jpg" },
        },
        {
          _id: "past-older",
          title: "Older Past Event",
          summary: "Older details",
          startAt: "2026-03-10T15:00:00.000Z",
          flyerImage: { url: "https://img/older.jpg" },
        },
        {
          _id: "past-newer",
          title: "Newer Past Event",
          summary: "Newer details",
          startAt: "2026-03-18T15:00:00.000Z",
          flyerImage: { url: "https://img/newer.jpg" },
        },
      ])
      .mockResolvedValueOnce([
        {
          _id: "program-1",
          title: "Program Title",
          description: "Program Description",
        },
      ]);

    const payload = await getHomeContentPayload();

    expect(payload).not.toBeNull();
    expect(payload!.events.map((event) => event.title)).toEqual(["Future Event"]);
    expect(payload!.events[0].imageAlt).toBe("Future flyer");
    expect(payload!.programs[0].iconKey).toBe("book");
    expect(payload!.programs[0].imageAlt).toBe("Program Title image");
  });

  it("formats announcement windows with expected labels", () => {
    expect(formatAnnouncementWindow()).toBeUndefined();

    const fromOnly = formatAnnouncementWindow("2026-03-19T12:00:00.000Z");
    const untilOnly = formatAnnouncementWindow(undefined, "2026-03-20T12:00:00.000Z");
    const range = formatAnnouncementWindow("2026-03-19T12:00:00.000Z", "2026-03-20T12:00:00.000Z");

    expect(fromOnly).toContain("From");
    expect(untilOnly).toContain("Until");
    expect(range).toContain("→");
    expect(range).toContain("ET");
  });
});
