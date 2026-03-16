import Link from "next/link";
import { CalendarDays, Clock3, ExternalLink, MapPin } from "lucide-react";

import FlyerThumbnail from "@/components/FlyerThumbnail";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getEventsPagePayload, type EventListItem } from "@/sanity/lib/content";

const fallbackUpcomingEvents: EventListItem[] = [
  {
    id: "fallback-1",
    title: "Community Iftar",
    summary: "Open to families and students.",
    location: "Masjid Al Kareem, Providence",
    dateLabel: "Thu, Mar 20, 2026",
    timeLabel: "6:15 PM ET",
  },
  {
    id: "fallback-2",
    title: "Youth Halaqa",
    summary: "After Maghrib in the multipurpose hall.",
    location: "Masjid Al Kareem, Providence",
    dateLabel: "Sat, Mar 22, 2026",
    timeLabel: "7:30 PM ET",
  },
];

export default async function EventsPage() {
  const payload = await getEventsPagePayload();

  const upcomingEvents = payload?.upcomingEvents?.length
    ? payload.upcomingEvents
    : fallbackUpcomingEvents;
  const pastEvents = payload?.pastEvents || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/40 text-stone-900 dark:from-stone-950 dark:to-stone-950 dark:text-stone-100">
      <main className="px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14">
      <section className="mx-auto max-w-6xl">
        <Card className="rounded-[30px] border-stone-200 shadow-sm dark:border-stone-800 dark:bg-stone-900/80">
          <CardContent className="p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
              ICRI Events
            </p>
            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Upcoming Community Events</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600 dark:text-stone-300">
              This page is powered by Sanity. As new events are published in Studio, they appear here automatically.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="rounded-2xl bg-emerald-700 hover:bg-emerald-800">
                <Link href="/">Back to Home</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-2xl">
                <Link href="/studio">Manage in Studio</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-5">
        {upcomingEvents.map((event) => (
          <Card key={event.id} className="rounded-[24px] border-stone-200 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
            <CardContent className="p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="flex flex-1 gap-4">
                  {event.imageUrl ? (
                    <FlyerThumbnail
                      src={event.imageUrl}
                      alt={event.imageAlt || `${event.title} flyer`}
                      containerClassName="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-white p-0.5 dark:border-stone-700 dark:bg-stone-900 sm:h-24 sm:w-16"
                      imageClassName="object-cover object-center"
                    />
                  ) : null}
                  <div>
                  <div className="inline-flex items-center rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {event.dateLabel}
                  </div>
                  <h2 className="mt-3 text-2xl font-bold">{event.title}</h2>
                  <p className="mt-2 max-w-2xl leading-7 text-stone-600 dark:text-stone-300">{event.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-600 dark:text-stone-300">
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                      {event.timeLabel}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                      {event.location}
                    </span>
                  </div>
                </div>
                </div>

                {event.ctaUrl ? (
                  <Button asChild className="rounded-xl bg-emerald-700 hover:bg-emerald-800 md:self-start">
                    <a
                      href={event.ctaUrl}
                      target={event.ctaUrl.startsWith("http") ? "_blank" : undefined}
                      rel={event.ctaUrl.startsWith("http") ? "noreferrer" : undefined}
                    >
                      Learn more
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {pastEvents.length > 0 ? (
        <section className="mx-auto mt-10 max-w-6xl">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
            Past Events
          </h3>
          <div className="grid gap-4">
            {pastEvents.slice(0, 8).map((event) => (
              <Card key={event.id} className="rounded-2xl border-stone-200 dark:border-stone-800 dark:bg-stone-900/60">
                <CardContent className="p-5">
                  {event.imageUrl ? (
                    <FlyerThumbnail
                      src={event.imageUrl}
                      alt={event.imageAlt || `${event.title} flyer`}
                      containerClassName="relative mb-3 h-24 w-16 overflow-hidden rounded-lg border border-stone-200 bg-white p-0.5 dark:border-stone-700 dark:bg-stone-900"
                      imageClassName="object-cover object-center"
                    />
                  ) : null}
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{event.dateLabel}</p>
                  <p className="mt-1 text-lg font-semibold">{event.title}</p>
                  <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{event.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
      </main>
    </div>
  );
}
