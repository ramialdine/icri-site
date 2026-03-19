import Link from "next/link";
import { Megaphone, Pin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAnnouncementsPagePayload, type AnnouncementListItem } from "@/sanity/lib/content";

const fallbackAnnouncements: AnnouncementListItem[] = [
  {
    id: "fallback-1",
    title: "Community Update",
    message: "Announcements from the masjid will appear here as updates are shared.",
    isPinned: true,
    statusLabel: "Pinned",
  },
];

export default async function AnnouncementsPage() {
  const payload = await getAnnouncementsPagePayload();
  const announcements = payload?.length ? payload : fallbackAnnouncements;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/40 text-stone-900 dark:from-stone-950 dark:to-stone-950 dark:text-stone-100">
      <main className="px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14">
        <section className="mx-auto max-w-6xl">
          <Card className="rounded-[30px] border-stone-200 shadow-sm dark:border-stone-800 dark:bg-stone-900/80">
            <CardContent className="p-8 lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
                ICRI Announcements
              </p>
              <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Masjid Announcements</h1>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="rounded-2xl bg-emerald-700 hover:bg-emerald-800">
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mx-auto mt-8 grid max-w-6xl gap-5">
          {announcements.map((announcement) => (
            <Card
              key={announcement.id}
              className="rounded-[24px] border-stone-200 shadow-sm dark:border-stone-800 dark:bg-stone-900/70"
            >
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em]">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                    <Megaphone className="h-3.5 w-3.5" />
                    {announcement.statusLabel}
                  </span>
                  {announcement.isPinned ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                      <Pin className="h-3.5 w-3.5" />
                      Top Priority
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-4 text-2xl font-bold">{announcement.title}</h2>
                <p className="mt-3 whitespace-pre-line leading-7 text-stone-700 dark:text-stone-300">
                  {announcement.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
