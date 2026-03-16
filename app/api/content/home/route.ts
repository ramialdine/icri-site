import { NextResponse } from "next/server";

import { getHomeContentPayload } from "@/sanity/lib/content";

const fallbackPayload = {
  announcements: [],
  events: [
    {
      date: "Mar 20",
      title: "Community Iftar",
      detail: "Open to families and students",
    },
    {
      date: "Mar 22",
      title: "Youth Halaqa",
      detail: "After Maghrib in the multipurpose hall",
    },
    {
      date: "Mar 29",
      title: "Weekend Tafsir",
      detail: "Guest speaker and Q&A session",
    },
  ],
  programs: [
    {
      iconKey: "book",
      title: "Qur'an & Islamic Learning",
      text: "Weekly classes, youth halaqas, beginner-friendly learning, and community reminders for every age group.",
    },
    {
      iconKey: "users",
      title: "Community Programs",
      text: "Family nights, sister and brother gatherings, service projects, and local support for Providence المسلمين.",
    },
    {
      iconKey: "calendar",
      title: "Ramadan & Special Events",
      text: "Iftar gatherings, taraweeh updates, Eid announcements, and important masjid events all in one place.",
    },
  ],
};

export async function GET() {
  try {
    const payload = await getHomeContentPayload();
    if (!payload) {
      return NextResponse.json(fallbackPayload);
    }

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json(fallbackPayload);
  }
}
