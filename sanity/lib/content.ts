import { groq } from "next-sanity";

import { sanityClient } from "./client";

type AnnouncementDoc = {
  title: string;
  message: string;
  isPinned?: boolean;
};

type EventDoc = {
  title: string;
  summary?: string;
  startAt: string;
};

type ProgramDoc = {
  title: string;
  description: string;
  iconKey?: string;
  order?: number;
};

const announcementsQuery = groq`*[_type == "announcement" && isActive == true] | order(isPinned desc, startAt desc) {
  title,
  message,
  isPinned
}`;

const eventsQuery = groq`*[_type == "event" && isPublished == true] | order(startAt asc)[0...8] {
  title,
  summary,
  startAt
}`;

const programsQuery = groq`*[_type == "program" && isActive == true] | order(order asc, _createdAt asc) {
  title,
  description,
  iconKey,
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
