import { groq } from "next-sanity";

import { sanityClient } from "./client";

type AnnouncementDoc = {
  title: string;
  message: string;
  isPinned?: boolean;
};

type EventDoc = {
  _id: string;
  title: string;
  summary?: string;
  startAt: string;
  endAt?: string;
  location?: string;
  ctaUrl?: string;
};

type ProgramDoc = {
  _id: string;
  title: string;
  description: string;
  iconKey?: string;
  scheduleText?: string;
  order?: number;
};

export type EventListItem = {
  id: string;
  title: string;
  summary: string;
  location: string;
  dateLabel: string;
  timeLabel: string;
  ctaUrl?: string;
};

export type ProgramListItem = {
  id: string;
  title: string;
  description: string;
  iconKey: "book" | "users" | "calendar";
  scheduleText?: string;
};

const announcementsQuery = groq`*[_type == "announcement" && isActive == true] | order(isPinned desc, startAt desc) {
  title,
  message,
  isPinned
}`;

const eventsQuery = groq`*[_type == "event" && isPublished == true] | order(startAt asc)[0...8] {
  _id,
  title,
  summary,
  startAt,
  endAt,
  location,
  ctaUrl
}`;

const allEventsQuery = groq`*[_type == "event" && isPublished == true] | order(startAt asc) {
  _id,
  title,
  summary,
  startAt,
  endAt,
  location,
  ctaUrl
}`;

const programsQuery = groq`*[_type == "program" && isActive == true] | order(order asc, _createdAt asc) {
  _id,
  title,
  description,
  iconKey,
  scheduleText,
  order
}`;

function formatEventDate(dateIso: string): string {
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) {
    return "TBA";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    timeZone: "America/New_York",
  })
    .format(d)
    .replace(" ", " ");
}

function formatEventDateTimeRange(startAt: string, endAt?: string) {
  const start = new Date(startAt);
  const end = endAt ? new Date(endAt) : null;

  if (Number.isNaN(start.getTime())) {
    return {
      dateLabel: "Date TBA",
      timeLabel: "Time TBA",
    };
  }

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });

  const startDate = dateFormatter.format(start);
  const startTime = timeFormatter.format(start);

  if (!end || Number.isNaN(end.getTime())) {
    return {
      dateLabel: startDate,
      timeLabel: `${startTime} ET`,
    };
  }

  const endDate = dateFormatter.format(end);
  const endTime = timeFormatter.format(end);

  if (startDate === endDate) {
    return {
      dateLabel: startDate,
      timeLabel: `${startTime} – ${endTime} ET`,
    };
  }

  return {
    dateLabel: `${startDate} → ${endDate}`,
    timeLabel: `${startTime} – ${endTime} ET`,
  };
}

function normalizeProgramIcon(iconKey?: string): "book" | "users" | "calendar" {
  if (iconKey === "users" || iconKey === "calendar") {
    return iconKey;
  }

  return "book";
}

export async function getHomeContentPayload() {
  if (!sanityClient) {
    return null;
  }

  const [announcements, events, programs] = await Promise.all([
    sanityClient.fetch<AnnouncementDoc[]>(announcementsQuery),
    sanityClient.fetch<EventDoc[]>(eventsQuery),
    sanityClient.fetch<ProgramDoc[]>(programsQuery),
  ]);

  return {
    announcements: announcements || [],
    events: (events || []).map((event) => ({
      date: formatEventDate(event.startAt),
      title: event.title,
      detail: event.summary || "",
    })),
    programs: (programs || []).map((program) => ({
      title: program.title,
      text: program.description,
      iconKey: program.iconKey || "book",
    })),
  };
}

export async function getEventsPagePayload(): Promise<{
  upcomingEvents: EventListItem[];
  pastEvents: EventListItem[];
} | null> {
  if (!sanityClient) {
    return null;
  }

  const events = await sanityClient.fetch<EventDoc[]>(allEventsQuery);
  const now = Date.now();

  const mapped = (events || []).map((event) => {
    const { dateLabel, timeLabel } = formatEventDateTimeRange(event.startAt, event.endAt);

    return {
      id: event._id,
      title: event.title,
      summary: event.summary || "Details coming soon.",
      location: event.location || "Masjid Al Kareem, Providence",
      dateLabel,
      timeLabel,
      ctaUrl: event.ctaUrl,
      startAtMs: Number.isNaN(new Date(event.startAt).getTime()) ? Number.MIN_SAFE_INTEGER : new Date(event.startAt).getTime(),
    };
  });

  const upcomingEvents = mapped
    .filter((event) => event.startAtMs >= now)
    .map(({ startAtMs: _startAtMs, ...event }) => event);

  const pastEvents = mapped
    .filter((event) => event.startAtMs < now)
    .sort((a, b) => b.startAtMs - a.startAtMs)
    .map(({ startAtMs: _startAtMs, ...event }) => event);

  return {
    upcomingEvents,
    pastEvents,
  };
}

export async function getProgramsPagePayload(): Promise<ProgramListItem[] | null> {
  if (!sanityClient) {
    return null;
  }

  const programs = await sanityClient.fetch<ProgramDoc[]>(programsQuery);

  return (programs || []).map((program) => ({
    id: program._id,
    title: program.title,
    description: program.description,
    iconKey: normalizeProgramIcon(program.iconKey),
    scheduleText: program.scheduleText,
  }));
}
