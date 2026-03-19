import Image from "next/image";
import Link from "next/link";
import { BookOpen, CalendarDays, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProgramsPagePayload, type ProgramListItem } from "@/sanity/lib/content";

const fallbackPrograms: ProgramListItem[] = [
  {
    id: "fallback-1",
    iconKey: "book",
    title: "Qur'an & Islamic Learning",
    description:
      "Weekly classes, youth halaqas, beginner-friendly learning, and community reminders for every age group.",
    scheduleText: "Weekly",
  },
  {
    id: "fallback-2",
    iconKey: "users",
    title: "Community Programs",
    description:
      "Family nights, sister and brother gatherings, service projects, and local support for Providence المسلمين.",
    scheduleText: "Ongoing",
  },
  {
    id: "fallback-3",
    iconKey: "calendar",
    title: "Ramadan & Special Events",
    description:
      "Iftar gatherings, taraweeh updates, Eid announcements, and important masjid events all in one place.",
    scheduleText: "Seasonal",
  },
];

const iconMap = {
  book: BookOpen,
  users: Users,
  calendar: CalendarDays,
} as const;

export default async function ProgramsPage() {
  const payload = await getProgramsPagePayload();
  const programs = payload?.length ? payload : fallbackPrograms;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/40 text-stone-900 dark:from-stone-950 dark:to-stone-950 dark:text-stone-100">
      <main className="px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14">
      <section className="mx-auto max-w-6xl">
        <Card className="rounded-[30px] border-stone-200 shadow-sm dark:border-stone-800 dark:bg-stone-900/80">
          <CardContent className="p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
              ICRI Programs
            </p>
            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Learning, Service, and Community</h1>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="rounded-2xl bg-emerald-700 hover:bg-emerald-800">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => {
          const Icon = iconMap[program.iconKey] || BookOpen;

          return (
            <Card key={program.id} className="rounded-[24px] border-stone-200 shadow-sm transition hover:-translate-y-1 dark:border-stone-800 dark:bg-stone-900/70">
              <CardContent className="p-6">
                {program.imageUrl ? (
                  <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-700">
                    <Image
                      src={program.imageUrl}
                      alt={program.imageAlt || `${program.title} image`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 360px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-300">
                    <Icon className="h-6 w-6" />
                  </div>
                )}
                <h2 className="mt-4 text-xl font-bold">{program.title}</h2>
                <p className="mt-3 leading-7 text-stone-600 dark:text-stone-300">{program.description}</p>
                {program.scheduleText ? (
                  <div className="mt-5 inline-flex items-center rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                    {program.scheduleText}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </section>
      </main>
    </div>
  );
}
