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

  it("maps and prioritizes upcoming events before recent past events", async () => {
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
        {
          _id: "in-progress",
          title: "In Progress Event",
          startAt: "2026-03-19T10:00:00.000Z",
          endAt: "2026-03-19T14:00:00.000Z",
        },
        {
          _id: "long-past",
          title: "Long Past Event",
          startAt: "2026-02-01T15:00:00.000Z",
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
    // Upcoming events run soonest first, past ones most recent first.
    expect(payload!.events.map((event) => [event.title, event.isPast])).toEqual([
      ["In Progress Event", false],
      ["Future Event", false],
      ["Newer Past Event", true],
      ["Older Past Event", true],
    ]);
    expect(payload!.events[2].imageAlt).toBe("Newer Past Event flyer");
    expect(vi.mocked(sanityClient!.fetch).mock.calls[1][1]).toEqual({
      since: "2026-02-17T12:00:00.000Z",
      sinceDate: "2026-02-17",
    });
    expect(payload!.programs[0].iconKey).toBe("book");
    expect(payload!.programs[0].imageAlt).toBe("Program Title image");
  });

  it("shows a repeating event's next session and keeps it upcoming until the series ends", async () => {
    vi.spyOn(Date, "now").mockReturnValue(new Date("2026-11-02T12:00:00.000Z").getTime());

    const fetchMock = vi.mocked(sanityClient!.fetch) as unknown as ChainedFetchMock;
    fetchMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          _id: "weekly-halaqa",
          title: "Youth Halaqa",
          // First session Sat Oct 3, 7:00-8:30 PM EDT.
          startAt: "2026-10-03T23:00:00.000Z",
          endAt: "2026-10-04T00:30:00.000Z",
          recurrence: { frequency: "weekly", interval: 1, weekdays: ["sat"] },
        },
        {
          _id: "ended-series",
          title: "Tajweed Series",
          startAt: "2026-09-05T23:00:00.000Z",
          recurrence: { frequency: "weekly", interval: 1, until: "2026-10-24" },
        },
        { _id: "one-off", title: "Open House", startAt: "2026-11-20T17:00:00.000Z" },
      ])
      .mockResolvedValueOnce([]);

    const payload = await getHomeContentPayload();

    expect(payload!.events).toEqual([
      expect.objectContaining({ title: "Youth Halaqa", date: "Nov 07", isPast: false, repeatLabel: "Every Saturday" }),
      expect.objectContaining({ title: "Open House", isPast: false }),
      expect.objectContaining({
        title: "Tajweed Series",
        date: "Oct 24",
        isPast: true,
        repeatLabel: "Every Saturday until Oct 24, 2026",
      }),
    ]);
    expect(payload!.events[1]).not.toHaveProperty("repeatLabel");
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
