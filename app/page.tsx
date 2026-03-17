"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import FlyerThumbnail from "@/components/FlyerThumbnail";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Clock,
  Heart,
  CalendarDays,
  BookOpen,
  Users,
  ChevronRight,
  Sunrise,
  Sun,
  Sunset,
  MoonStar,
} from "lucide-react";

type PrayerTime = {
  name: string;
  adhan: string;
  iqamah: string;
};

type JumuahSession = {
  label: string;
  khutbah: string;
  iqamah: string;
};

type ProgramCard = {
  iconKey: "book" | "users" | "calendar";
  title: string;
  text: string;
  imageUrl?: string;
  imageAlt?: string;
};

type EventCard = {
  date: string;
  title: string;
  detail: string;
  imageUrl?: string;
  imageAlt?: string;
};

type Announcement = {
  title: string;
  message: string;
  isPinned?: boolean;
};

const PRAYER_CACHE_KEY = "icri_prayer_times";

const fallbackPrayerTimes: PrayerTime[] = [
  { name: "Fajr", adhan: "5:24 AM", iqamah: "5:45 AM" },
  { name: "Dhuhr", adhan: "12:03 PM", iqamah: "12:30 PM" },
  { name: "Asr", adhan: "3:28 PM", iqamah: "4:00 PM" },
  { name: "Maghrib", adhan: "6:53 PM", iqamah: "6:58 PM" },
  { name: "Isha", adhan: "8:12 PM", iqamah: "8:30 PM" },
];

const fallbackJumuahSessions: JumuahSession[] = [
  { label: "1st Khutbah", khutbah: "1:00 PM", iqamah: "1:30 PM" },
];

const fallbackPrograms: ProgramCard[] = [
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
];

const fallbackEvents: EventCard[] = [
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
];

const fallbackAnnouncements: Announcement[] = [];

const programIconMap = {
  book: BookOpen,
  users: Users,
  calendar: CalendarDays,
} as const;

const prayerVisuals = {
  Fajr: {
    icon: Sunrise,
    label: "First light",
    iconClassName: "text-sky-600",
    backgroundClassName: "bg-sky-50",
  },
  Dhuhr: {
    icon: Sun,
    label: "Midday sun",
    iconClassName: "text-amber-500",
    backgroundClassName: "bg-amber-50",
  },
  Asr: {
    icon: Sun,
    label: "Afternoon light",
    iconClassName: "text-orange-500",
    backgroundClassName: "bg-orange-50",
  },
  Maghrib: {
    icon: Sunset,
    label: "Sunset glow",
    iconClassName: "text-rose-500",
    backgroundClassName: "bg-rose-50",
  },
  Isha: {
    icon: MoonStar,
    label: "Night prayer",
    iconClassName: "text-violet-500",
    backgroundClassName: "bg-violet-50",
  },
} as const;

export default function Page() {
  const [prayerTimes, setPrayerTimes] = useState(fallbackPrayerTimes);
  const [jumuahSessions, setJumuahSessions] = useState(fallbackJumuahSessions);
  const [programs, setPrograms] = useState(fallbackPrograms);
  const [events, setEvents] = useState(fallbackEvents);
  const [announcements, setAnnouncements] = useState(fallbackAnnouncements);

  // Fetch merged prayer payload (Adhan from API, Iqamah from CMS), refresh once daily
  useEffect(() => {
    const today = new Date().toDateString();
    fetch("/api/prayers/today")
      .then((r) => r.json())
      .then((json) => {
        const prayers = Array.isArray(json?.prayers) ? json.prayers : fallbackPrayerTimes;
        const jumuah = Array.isArray(json?.jumuahSessions) && json.jumuahSessions.length > 0
          ? json.jumuahSessions
          : fallbackJumuahSessions;

        setPrayerTimes(prayers);
        setJumuahSessions(jumuah);

        try {
          localStorage.setItem(
            PRAYER_CACHE_KEY,
            JSON.stringify({ date: today, data: prayers, jumuah })
          );
        } catch {}
      })
      .catch(() => {}); // silently keep fallback times
  }, []);

  useEffect(() => {
    fetch("/api/content/home", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (Array.isArray(json?.programs) && json.programs.length > 0) {
          setPrograms(
            json.programs.map((program: ProgramCard) => ({
              iconKey: program.iconKey,
              title: program.title,
              text: program.text,
              imageUrl: program.imageUrl,
              imageAlt: program.imageAlt,
            }))
          );
        }

        if (Array.isArray(json?.events) && json.events.length > 0) {
          setEvents(
            json.events.map((event: EventCard) => ({
              date: event.date,
              title: event.title,
              detail: event.detail,
              imageUrl: event.imageUrl,
              imageAlt: event.imageAlt,
            }))
          );
        }

        if (Array.isArray(json?.announcements)) {
          setAnnouncements(
            json.announcements.map((announcement: Announcement) => ({
              title: announcement.title,
              message: announcement.message,
              isPinned: announcement.isPinned,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const revealInView = {
    initial: { opacity: 0, y: 34 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: "easeOut" as const },
    viewport: { once: true, amount: 0.14 },
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-20">
        <Image
          src="/menEntranceAtNight.jpg"
          alt="Masjid Al Kareem entrance at night"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/55 via-emerald-900/45 to-emerald-950/65" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_45%),radial-gradient(circle_at_left,rgba(20,184,166,0.18),transparent_38%)]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center gap-5 px-4 py-12 sm:px-6 lg:px-8"
        >
          <div className="text-center text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100 sm:text-base">
              Islamic Center of Rhode Island
            </p>
            <h2 className="mt-3 text-4xl font-bold sm:text-5xl md:text-6xl">
              Masjid Al Kareem
            </h2>
            <p className="mt-3 text-base text-emerald-50 sm:text-lg md:text-xl">
              The staple of the Islamic community in Rhode Island.
            </p>
          </div>
          <Button asChild className="h-16 rounded-2xl bg-emerald-600 px-9 text-lg font-semibold shadow-lg shadow-emerald-900/25 hover:bg-emerald-700 sm:h-20 sm:px-12 sm:text-2xl">
            <a href="#prayers">View Prayer Schedule</a>
          </Button>
          <Button asChild variant="outline" className="h-16 rounded-2xl border-2 border-emerald-100/90 bg-white px-9 text-lg font-semibold text-emerald-900 shadow-lg shadow-emerald-950/20 hover:bg-emerald-50 dark:border-emerald-200 dark:bg-white dark:text-emerald-900 dark:hover:bg-emerald-50 sm:h-20 sm:px-12 sm:text-2xl">
            <Link href="/donate">Donate to the Masjid</Link>
          </Button>
        </motion.div>
      </section>

      <motion.section {...revealInView} id="prayers" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="relative z-10">
          <Card className="overflow-hidden rounded-[32px] border-stone-200 shadow-2xl">
            <CardContent className="p-0">
              <div className="flex flex-col gap-4 bg-emerald-800 px-6 py-8 text-white md:flex-row md:items-end md:justify-between md:px-8 md:py-10">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-emerald-100">
                    Today at the Masjid
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-3xl font-bold sm:text-4xl">
                    <Clock className="h-7 w-7" />
                    Prayer Schedule
                  </div>
                </div>

              </div>
              <div className="grid bg-white dark:bg-stone-900 md:grid-cols-2 xl:grid-cols-5 xl:divide-x xl:divide-y-0">
                {prayerTimes.map((prayer, index) => (
                  (() => {
                    const visual = prayerVisuals[prayer.name as keyof typeof prayerVisuals];
                    const PrayerIcon = visual.icon;

                    return (
                      <div
                        key={prayer.name}
                        className={`px-6 py-7 md:px-7 md:py-8 xl:min-h-[220px] ${
                          index < prayerTimes.length - 1 ? "border-b border-stone-200 dark:border-stone-800 md:border-b md:border-stone-200 xl:border-b-0" : ""
                        }`}
                      >
                        <div className="flex h-full flex-col justify-between gap-6">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-lg font-semibold">{prayer.name}</p>
                              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{visual.label}</p>
                            </div>
                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${visual.backgroundClassName}`}>
                              <PrayerIcon className={`h-7 w-7 ${visual.iconClassName}`} />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                                Adhan
                              </p>
                              <p className="mt-2 text-3xl font-bold text-stone-900 dark:text-stone-100">{prayer.adhan}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                                Iqamah
                              </p>
                              <p className="mt-1 text-lg font-semibold text-emerald-700">
                                {prayer.iqamah}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ))}
              </div>
              <div className="border-t border-stone-200 bg-stone-50 px-6 py-5 dark:border-stone-800 dark:bg-stone-900/70 md:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-base font-semibold">Jumu&apos;ah</p>
                    <div className="mt-1 space-y-1">
                      {jumuahSessions.map((session) => (
                        <p key={`${session.label}-${session.khutbah}`} className="text-sm text-stone-600 dark:text-stone-300 md:text-base">
                          {session.label} {session.khutbah} · Iqamah {session.iqamah}
                        </p>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-2xl md:self-auto self-start">
                    Full Timetable
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      <motion.section
        {...revealInView}
        id="support"
        className="bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/40 py-8 dark:from-stone-950 dark:via-stone-950 dark:to-stone-950 sm:py-10 lg:py-14"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="rounded-[32px] border-stone-200 shadow-sm">
            <CardContent className="grid gap-8 p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
              <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-stone-200">
                <Image
                  src="/ICRIcommunity.jpg"
                  alt="ICRI community members"
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  Support the Mission
                </p>
                <h3 className="mt-3 text-3xl font-bold">
                  Help sustain worship, learning, and community care.
                </h3>
                <p className="mt-4 text-base leading-7 text-stone-600">
                  Support daily operations, educational programming, Ramadan
                  iftars, youth development, and the ongoing needs of a masjid
                  that has served Providence for decades.
                </p>
                <div className="mt-6 rounded-3xl bg-emerald-50 p-6">
                  <div className="flex items-center gap-3">
                    <Heart className="h-6 w-6 text-emerald-700" />
                    <div>
                      <p className="font-semibold">Featured appeal</p>
                      <p className="text-sm text-stone-600">
                        General masjid support, classes, and community
                        programming
                      </p>
                    </div>
                  </div>
                  <Button asChild className="mt-5 w-full rounded-2xl bg-emerald-700 hover:bg-emerald-800 sm:w-auto">
                    <Link href="/donate">Donate Now</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      <motion.section
        {...revealInView}
        id="events"
        className="bg-gradient-to-b from-white to-emerald-50/30 py-16 dark:from-stone-950 dark:to-stone-950"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="rounded-[30px] border-stone-200 shadow-sm">
            <CardContent className="grid gap-8 p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
              <div>
                <div className="relative mb-5 aspect-[4/3] w-full max-w-xs overflow-hidden rounded-3xl border border-stone-200 shadow-sm">
                  <Image
                    src="/muslimsPraying.jpg"
                    alt="Muslims praying at the masjid"
                    fill
                    sizes="(max-width: 1024px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  Events
                </p>
                <h3 className="mt-3 text-3xl font-bold">
                  Masjid Al Kareem Announcements and Events
                </h3>
                <p className="mt-4 leading-7 text-stone-600">
                  {announcements[0]?.message ||
                    "Use Studio to post Eid announcements, fundraisers, classes, and youth events without touching code."}
                </p>
                <p className="mt-4 text-sm text-stone-500">
                  {announcements[0]?.title
                    ? `Pinned announcement: ${announcements[0].title}`
                    : "Weekly reflections and reminders from Imam ABL can also be featured here."}
                </p>
                <Link
                  href="/announcements"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  View all announcements <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-4">
                {events.map((event) => (
                  <Link
                    href="/events"
                    key={event.title}
                    className="flex items-center justify-between rounded-2xl border border-stone-200 px-5 py-4 transition hover:border-emerald-200 hover:bg-emerald-50/50 dark:border-stone-800 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/20"
                  >
                    <div className="flex items-center gap-4">
                      {event.imageUrl ? (
                        <FlyerThumbnail
                          src={event.imageUrl}
                          alt={event.imageAlt || `${event.title} flyer`}
                          containerClassName="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-white p-0.5 dark:border-stone-700 dark:bg-stone-900"
                          imageClassName="object-cover object-center"
                        />
                      ) : null}
                      <div className="rounded-2xl bg-stone-100 px-3 py-2 text-sm font-semibold text-stone-800 dark:bg-emerald-900/45 dark:text-emerald-200 dark:ring-1 dark:ring-emerald-700/40">
                        {event.date}
                      </div>
                      <div>
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-sm text-stone-600">{event.detail}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-stone-400" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      <motion.section
        {...revealInView}
        id="programs"
        className="mx-auto max-w-7xl bg-gradient-to-br from-stone-50 to-emerald-50/30 px-4 py-8 dark:from-stone-950 dark:to-stone-950 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
            Programs
          </p>
          <h3 className="mt-2 text-3xl font-bold">
            Show the masjid as a living community, not just a timetable.
          </h3>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {programs.map((program) => {
            const Icon = programIconMap[program.iconKey] || BookOpen;
            return (
              <Card
                key={program.title}
                className="rounded-[28px] border-stone-200 shadow-sm transition hover:-translate-y-1"
              >
                <CardContent className="p-8">
                  {program.imageUrl ? (
                    <div className="relative mb-5 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-stone-200">
                      <Image
                        src={program.imageUrl}
                        alt={program.imageAlt || `${program.title} image`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 360px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="mb-5 inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                      <Icon className="h-6 w-6" />
                    </div>
                  )}
                  <h4 className="text-xl font-bold">{program.title}</h4>
                  <p className="mt-3 leading-7 text-stone-600">
                    {program.text}
                  </p>
                  <Link href="/programs" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        {...revealInView}
        id="contact"
        className="mx-auto max-w-7xl px-4 py-16 dark:bg-stone-950 sm:px-6 lg:px-8"
      >
        <Card className="rounded-[28px] border-stone-200 bg-emerald-900 text-white shadow-sm">
          <CardContent className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-200">
                  Visit Us
                </p>
                <h3 className="mt-3 text-3xl font-bold">
                  Easy to find. Easy to contact.
                </h3>
              </div>

            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-700/60 bg-emerald-950/35 p-5">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-emerald-200" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="mt-1 text-emerald-50/90">39 Haskins St, Providence, RI 02903</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-700/60 bg-emerald-950/35 p-5">
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 text-emerald-200" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="mt-1 text-emerald-50/90">(401) 274-3986</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-700/60 bg-emerald-950/35 p-5">
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 text-emerald-200" />
                  <div>
                    <p className="font-semibold">Open for daily prayers</p>
                    <p className="mt-1 text-emerald-50/90">Prayer access, Jumu&apos;ah, classes, and community events</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <section id="map" className="mx-auto max-w-7xl px-4 py-8 dark:bg-stone-950 sm:px-6 lg:px-8">
        <Card className="rounded-[20px] border-stone-200 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-[320px] w-full sm:h-[420px]">
              <iframe
                title="Masjid Al Kareem — Google Maps"
                src="https://www.google.com/maps?q=39+Haskins+St,+Providence,+RI+02903&output=embed"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="border-t border-stone-200 bg-white px-6 py-4 text-sm text-stone-600">
              <p className="font-semibold">Visit Us</p>
              <p>39 Haskins St, Providence, RI 02903 — <a href="https://www.google.com/maps/search/?api=1&query=39+Haskins+St,+Providence,+RI+02903" className="text-emerald-700 underline">Open in Google Maps</a></p>
            </div>
          </CardContent>
        </Card>
      </section>

      <motion.footer {...revealInView} className="border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-stone-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-semibold text-stone-900">
              Masjid Al Kareem · Islamic Center of Rhode Island
            </p>
            <p>Providence, Rhode Island</p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-emerald-700">
              Facebook
            </a>
            <a href="#" className="hover:text-emerald-700">
              YouTube
            </a>
            <Link href="/donate" className="hover:text-emerald-700">
              Donate
            </Link>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}