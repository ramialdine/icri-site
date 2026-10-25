import { groq } from "next-sanity";

import { sanityClient } from "./client";

type AnnouncementDoc = {
  _id?: string;
  title: string;
  message: string;
  isPinned?: boolean;
  startAt?: string;
  endAt?: string;
  isActive?: boolean;
};

type EventDoc = {
  _id: string;
  title: string;
  summary?: string;
  isPublished?: boolean;
  startAt: string;
  endAt?: string;
  location?: string;
  ctaUrl?: string;
  flyerImage?: {
    alt?: string;
    url?: string;
  };
};

type ProgramDoc = {
  _id: string;
  title: string;
  description: string;
  iconKey?: string;
  scheduleText?: string;
  order?: number;
  cardImage?: {
    alt?: string;
    url?: string;
  };
};

export type HomeAnnouncement = {
  id?: string;
  title: string;
  message: string;
  isPinned?: boolean;
};

export type HomeEvent = {
  date: string;
  title: string;
  detail: string;
  imageUrl?: string;
  imageAlt: string;
  isPast: boolean;
};

export type HomeProgram = {
  title: string;
  text: string;
  iconKey: string;
  imageUrl?: string;
  imageAlt: string;
};

export type HomeContentPayload = {
  announcements: HomeAnnouncement[];
  events: HomeEvent[];
  programs: HomeProgram[];
};

export type EventListItem = {
  id: string;
  isPast?: boolean;
  title: string;
  summary: string;
  location: string;
  dateLabel: string;
  timeLabel: string;
  ctaUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type ProgramListItem = {
  id: string;
  title: string;
  description: string;
  iconKey: "book" | "users" | "calendar";
  scheduleText?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type AnnouncementListItem = {
  id: string;
  title: string;
  message: string;
  isPinned: boolean;
  statusLabel: string;
  windowLabel?: string;
};

const announcementsQuery = groq`*[
  _type == "announcement" &&
  isActive == true &&
  coalesce(startAt <= $now, true) &&
  coalesce(endAt >= $now, true)
] | order(isPinned desc, startAt desc) {
  _id,
  title,
  message,
  isPinned
}`;

// Home page: upcoming events plus ones that ended within the last month.
const eventsQuery = groq`*[_type == "event" && coalesce(isPublished, true) == true && coalesce(endAt, startAt) >= $since] | order(startAt asc)[0...50] {
  _id,
  title,
  summary,
  isPublished,
  startAt,
  endAt,
  location,
  ctaUrl,
  flyerImage {
    alt,
    "url": asset->url
  }
}`;

const allEventsQuery = groq`*[_type == "event" && coalesce(isPublished, true) == true] | order(startAt asc) {
  _id,
  title,
  summary,
  isPublished,
  startAt,
  endAt,
  location,
  ctaUrl,
  flyerImage {
    alt,
    "url": asset->url
  }
}`;

const programsQuery = groq`*[_type == "program" && isActive == true] | order(order asc, _createdAt asc) {
  _id,
  title,
  description,
  iconKey,
  scheduleText,
  order,
  cardImage {
    alt,
    "url": asset->url
  }
}`;

const allAnnouncementsQuery = groq`*[
  _type == "announcement" &&
  isActive == true &&
  coalesce(startAt <= $now, true) &&
  coalesce(endAt >= $now, true)
] | order(isPinned desc, _updatedAt desc) {
  _id,
  title,
  message,
  isPinned,
  startAt,
  endAt,
  isActive
}`;

/** Past events stay on the home page (greyed out) for this long after they end. */
export const RECENT_PAST_EVENT_MS = 30 * 24 * 60 * 60 * 1000;

function toMs(iso?: string): number | undefined {
  if (!iso) {
    return undefined;
  }
  const ms = new Date(iso).getTime();
  return Number.isNaN(ms) ? undefined : ms;
}

/** An event is past once it has ended, or once it has started if it has no end time. */
function eventEndMs(event: Pick<EventDoc, "startAt" | "endAt">): number {
  return toMs(event.endAt) ?? toMs(event.startAt) ?? Number.MIN_SAFE_INTEGER;
}

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

export function formatAnnouncementWindow(startAt?: string, endAt?: string): string | undefined {
  if (!startAt && !endAt) {
    return undefined;
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });

  const start = startAt ? new Date(startAt) : null;
  const end = endAt ? new Date(endAt) : null;

  const validStart = start && !Number.isNaN(start.getTime()) ? formatter.format(start) : null;
  const validEnd = end && !Number.isNaN(end.getTime()) ? formatter.format(end) : null;

  if (validStart && validEnd) {
    return `${validStart} → ${validEnd} ET`;
  }

  if (validStart) {
    return `From ${validStart} ET`;
  }

  if (validEnd) {
    return `Until ${validEnd} ET`;
  }

  return undefined;
}

export async function getHomeContentPayload(): Promise<HomeContentPayload | null> {
  if (!sanityClient) {
    return null;
  }

  const now = Date.now();
  const nowIso = new Date(now).toISOString();
  const sinceIso = new Date(now - RECENT_PAST_EVENT_MS).toISOString();

  const [announcements, events, programs] = await Promise.all([
    sanityClient.fetch<AnnouncementDoc[]>(announcementsQuery, { now: nowIso }),
    sanityClient.fetch<EventDoc[]>(eventsQuery, { since: sinceIso }),
    sanityClient.fetch<ProgramDoc[]>(programsQuery),
  ]);

  const mappedEvents = (events || [])
    .filter((event) => event.isPublished !== false)
    .map((event) => {
      const endMs = eventEndMs(event);
      return {
        date: formatEventDate(event.startAt),
        title: event.title,
        detail: event.summary || "",
        imageUrl: event.flyerImage?.url,
        imageAlt: event.flyerImage?.alt || `${event.title} flyer`,
        isPast: endMs < now,
        endMs,
      };
    })
    // Events that ended more than a month ago only appear on /events.
    .filter((event) => event.endMs >= now - RECENT_PAST_EVENT_MS);

  const upcomingEvents = mappedEvents.filter((event) => !event.isPast);
  const pastEvents = mappedEvents.filter((event) => event.isPast).sort((a, b) => b.endMs - a.endMs);

  const selectedEvents: HomeEvent[] = [...upcomingEvents, ...pastEvents]
    .slice(0, 8)
    .map(({ endMs: _endMs, ...event }) => event);

  const mappedAnnouncements: HomeAnnouncement[] = (announcements || []).map((announcement) => ({
      id: announcement._id,
      title: announcement.title,
      message: announcement.message,
      isPinned: announcement.isPinned,
    }));

  return {
    announcements: mappedAnnouncements,
    events: selectedEvents,
    programs: (programs || []).map((program) => ({
      title: program.title,
      text: program.description,
      iconKey: program.iconKey || "book",
      imageUrl: program.cardImage?.url,
      imageAlt: program.cardImage?.alt || `${program.title} image`,
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

  const mapped = (events || [])
    .filter((event) => event.isPublished !== false)
    .map((event) => {
    const { dateLabel, timeLabel } = formatEventDateTimeRange(event.startAt, event.endAt);

    return {
      id: event._id,
      title: event.title,
      summary: event.summary || "Details coming soon.",
      location: event.location || "Masjid Al Kareem, Providence",
      dateLabel,
      timeLabel,
      ctaUrl: event.ctaUrl,
      imageUrl: event.flyerImage?.url,
      imageAlt: event.flyerImage?.alt || `${event.title} flyer`,
      endMs: eventEndMs(event),
    };
  });

  const upcomingEvents = mapped
    .filter((event) => event.endMs >= now)
    .map(({ endMs: _endMs, ...event }) => ({ ...event, isPast: false }));

  const pastEvents = mapped
    .filter((event) => event.endMs < now)
    .sort((a, b) => b.endMs - a.endMs)
    .map(({ endMs: _endMs, ...event }) => ({ ...event, isPast: true }));

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
    imageUrl: program.cardImage?.url,
    imageAlt: program.cardImage?.alt || `${program.title} image`,
  }));
}

export async function getAnnouncementsPagePayload(): Promise<AnnouncementListItem[] | null> {
  if (!sanityClient) {
    return null;
  }

  const nowIso = new Date().toISOString();

  const announcements = await sanityClient.fetch<AnnouncementDoc[]>(allAnnouncementsQuery, { now: nowIso });

  return (announcements || []).map((announcement, index) => ({
    id: announcement._id || `announcement-${index}`,
    title: announcement.title,
    message: announcement.message,
    isPinned: Boolean(announcement.isPinned),
    statusLabel: announcement.isPinned ? "Pinned" : "General",
    windowLabel: formatAnnouncementWindow(announcement.startAt, announcement.endAt),
  }));
}
