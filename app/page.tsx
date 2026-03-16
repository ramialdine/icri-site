"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
import Map from "@/components/Map";

// Helpers for AlAdhan API
function to12Hour(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}
function addMinutes(time24: string, minutes: number): string {
  const [h, m] = time24.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
const IQAMAH_OFFSETS: Record<string, number> = {
  Fajr: 21,
  Dhuhr: 27,
  Asr: 32,
  Maghrib: 5,
  Isha: 18,
};
const PRAYER_CACHE_KEY = "icri_prayer_times";

const fallbackPrayerTimes = [
  { name: "Fajr", adhan: "5:24 AM", iqamah: "5:45 AM" },
  { name: "Dhuhr", adhan: "12:03 PM", iqamah: "12:30 PM" },
  { name: "Asr", adhan: "3:28 PM", iqamah: "4:00 PM" },
  { name: "Maghrib", adhan: "6:53 PM", iqamah: "6:58 PM" },
  { name: "Isha", adhan: "8:12 PM", iqamah: "8:30 PM" },
];

const programs = [
  {
    icon: BookOpen,
    title: "Qur'an & Islamic Learning",
    text: "Weekly classes, youth halaqas, beginner-friendly learning, and community reminders for every age group.",
  },
  {
    icon: Users,
    title: "Community Programs",
    text: "Family nights, sister and brother gatherings, service projects, and local support for Providence المسلمين.",
  },
  {
    icon: CalendarDays,
    title: "Ramadan & Special Events",
    text: "Iftar gatherings, taraweeh updates, Eid announcements, and important masjid events all in one place.",
  },
];

const quickLinks = [
  "Prayer Times",
  "Events",
  "Donate",
  "Programs",
  "Contact",
  "Volunteer",
];

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState(fallbackPrayerTimes);
  const heroRef = useRef<HTMLElement | null>(null);

  // Fetch Providence prayer times from AlAdhan, refresh once daily
  useEffect(() => {
    const today = new Date().toDateString();
    try {
      const cached = localStorage.getItem(PRAYER_CACHE_KEY);
      if (cached) {
        const { date, data } = JSON.parse(cached);
        if (date === today) {
          setPrayerTimes(data);
          return;
        }
      }
    } catch {}

    fetch(
      "https://api.aladhan.com/v1/timingsByCity?city=Providence&country=US&state=Rhode+Island&method=2"
    )
      .then((r) => r.json())
      .then((json) => {
        const t = json?.data?.timings;
        if (!t) return;
        const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map(
          (name) => ({
            name,
            adhan: to12Hour(t[name]),
            iqamah: to12Hour(addMinutes(t[name], IQAMAH_OFFSETS[name])),
          })
        );
        setPrayerTimes(prayers);
        try {
          localStorage.setItem(
            PRAYER_CACHE_KEY,
            JSON.stringify({ date: today, data: prayers })
          );
        } catch {}
      })
      .catch(() => {}); // silently keep fallback times
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) {
        setIsScrolled(false);
        return;
      }

      const heroBottom = heroRef.current.getBoundingClientRect().bottom;
      setIsScrolled(heroBottom <= 88);
    };

    const rafId = window.requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const revealInView = {
    initial: { opacity: 0, y: 34 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: "easeOut" as const },
    viewport: { once: true, amount: 0.14 },
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-stone-200/80 bg-white/90 backdrop-blur shadow-sm"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-[180px] overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm sm:h-16 sm:w-[220px]">
              <Image
                src="/ICRI_logo.jpeg"
                alt="Islamic Center of Rhode Island logo"
                fill
                sizes="(max-width: 640px) 180px, 220px"
                className="object-contain p-1"
                priority
              />
            </div>
            <div>
              <p
                className={`hidden text-xs font-semibold uppercase tracking-[0.2em] sm:block ${
                  isScrolled ? "text-emerald-700" : "text-emerald-100"
                }`}
              >
                ICRI
              </p>
              <h1
                className={`text-base font-bold sm:text-lg ${
                  isScrolled ? "text-stone-900" : "text-white"
                }`}
              >
                Masjid Al Kareem
              </h1>
            </div>
          </div>
          <nav
            className={`hidden gap-6 text-sm font-medium md:flex ${
              isScrolled ? "text-stone-700" : "text-white"
            }`}
          >
            <a href="#about" className={isScrolled ? "hover:text-emerald-700" : "hover:text-emerald-200"}>
              About
            </a>
            <a href="#prayers" className={isScrolled ? "hover:text-emerald-700" : "hover:text-emerald-200"}>
              Prayer Times
            </a>
            <a href="#programs" className={isScrolled ? "hover:text-emerald-700" : "hover:text-emerald-200"}>
              Programs
            </a>
            <a href="#events" className={isScrolled ? "hover:text-emerald-700" : "hover:text-emerald-200"}>
              Events
            </a>
            <a href="#contact" className={isScrolled ? "hover:text-emerald-700" : "hover:text-emerald-200"}>
              Contact
            </a>
          </nav>
          <Button asChild className="rounded-2xl bg-emerald-700 hover:bg-emerald-800">
            <Link href="/donate">Donate</Link>
          </Button>
        </div>
      </header>

      <section ref={heroRef} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        <Image
          src="/masjidExterior.png"
          alt="Masjid exterior background"
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
            <a href="#prayers">🕰️ View Prayer Schedule</a>
          </Button>
          <Button asChild variant="outline" className="h-16 rounded-2xl border-2 border-emerald-100/90 bg-white/95 px-9 text-lg font-semibold text-emerald-900 shadow-lg shadow-emerald-950/20 hover:bg-emerald-50 sm:h-20 sm:px-12 sm:text-2xl">
            <Link href="/donate">💚 Donate to the Masjid</Link>
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
              <div className="grid bg-white md:grid-cols-2 xl:grid-cols-5 xl:divide-x xl:divide-y-0">
                {prayerTimes.map((prayer, index) => (
                  (() => {
                    const visual = prayerVisuals[prayer.name as keyof typeof prayerVisuals];
                    const PrayerIcon = visual.icon;

                    return (
                      <div
                        key={prayer.name}
                        className={`px-6 py-7 md:px-7 md:py-8 xl:min-h-[220px] ${
                          index < prayerTimes.length - 1 ? "border-b border-stone-200 md:border-b md:border-stone-200 xl:border-b-0" : ""
                        }`}
                      >
                        <div className="flex h-full flex-col justify-between gap-6">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-lg font-semibold">{prayer.name}</p>
                              <p className="mt-1 text-sm text-stone-500">{visual.label}</p>
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
                              <p className="mt-2 text-3xl font-bold text-stone-900">{prayer.adhan}</p>
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
              <div className="border-t border-stone-200 bg-stone-50 px-6 py-5 md:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-base font-semibold">Jumu&apos;ah</p>
                    <p className="text-sm text-stone-600 md:text-base">
                      1st Khutbah 1:00 PM
                    </p>
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
        id="about"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16"
      >
        <Card className="rounded-[32px] border-stone-200 shadow-sm">
          <CardContent className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                About the Masjid
              </p>
              <h3 className="mt-3 text-3xl font-bold sm:text-4xl">
                A staple of the community; <br />
                serving Rhode Island since 1976.
              </h3>
              <div className="mt-6 space-y-5 text-base leading-8 text-stone-600">
                <p>
                  Masjid Al Kareem, also known as the Islamic Center of Rhode
                  Island, is a Sunni mosque that has been an integral part of
                  the Providence community since its establishment in 1976. This
                  welcoming Islamic center offers a range of services and
                  amenities for worshippers and community members.
                </p>

                {/* Expandable content */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    aboutExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="space-y-5">
                    <p>
                      One of the main highlights of Masjid Al Kareem is its
                      commitment to inclusivity. The mosque provides a kid-friendly
                      environment, ensuring that families can comfortably worship
                      together. Additionally, the presence of wheelchair amenities,
                      such as accessible prayer spaces and parking, ensures that
                      individuals with mobility needs can easily navigate the
                      premises.
                    </p>
                    <p>
                      The mosque offers a variety of services to cater to the needs
                      of the community. Five daily prayers are held, providing a
                      spiritual space for worshippers to connect with their faith
                      throughout the day. Jumu&apos;ah prayers, the congregational
                      Friday prayers, bring the community together in a special way.
                      The mosque also hosts a weekend school for children in a
                      dedicated classroom, providing an opportunity for them to
                      learn about Islam and their cultural heritage. During Ramadan,
                      the mosque organizes Iftar gatherings, which allow the
                      community to come together and break their fasts during the
                      holy month.
                    </p>
                    <p>
                      There is a spacious and dedicated women&apos;s section with a
                      separate entrance directly to it. The mosque also offers many
                      dedicated parking spaces close to the building for women.
                    </p>
                    <p>
                      Situated in the heart of Providence, Rhode Island, Masjid Al
                      Kareem is a vital hub for the Muslim community, offering a
                      peaceful and welcoming environment for worshippers of all ages
                      and backgrounds. With its long-standing presence and
                      commitment to providing necessary facilities and services,
                      this mosque plays a crucial role in fostering a strong and
                      unified community.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setAboutExpanded((prev) => !prev)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 hover:text-emerald-800 active:bg-emerald-200"
                >
                  {aboutExpanded ? "Read less ↑" : "Read more ↓"}
                </button>
              </div>
            </div>
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-stone-200">
                <Image
                  src="/masjidExterior.png"
                  alt="Exterior of Masjid Al Kareem"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        {...revealInView}
        id="support"
        className="bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/40 py-8 sm:py-10 lg:py-14"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="rounded-[32px] border-stone-200 shadow-sm">
            <CardContent className="grid gap-8 p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
              <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-stone-200">
                <Image
                  src="/masjidExterior.png"
                  alt="Exterior of Masjid Al Kareem"
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

      <motion.section {...revealInView} id="events" className="bg-gradient-to-b from-white to-emerald-50/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="rounded-[30px] border-stone-200 shadow-sm">
            <CardContent className="grid gap-8 p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
              <div>
                <div className="relative mb-5 aspect-[4/3] w-full max-w-xs overflow-hidden rounded-3xl border border-stone-200 shadow-sm">
                  <Image
                    src="/imamABL.jpeg"
                    alt="Imam ABL"
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
                  This section can be connected to a CMS, Google Calendar, or a
                  simple admin panel so the masjid can post Eid announcements,
                  fundraisers, classes, and youth events without needing to
                  summon the one cousin who knows web design.
                </p>
                <p className="mt-4 text-sm text-stone-500">
                  Weekly reflections and reminders from Imam ABL can also be
                  featured here.
                </p>
              </div>
              <div className="grid gap-4">
                {[
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
                ].map((event) => (
                  <div
                    key={event.title}
                    className="flex items-center justify-between rounded-2xl border border-stone-200 px-5 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-stone-100 px-3 py-2 text-sm font-semibold">
                        {event.date}
                      </div>
                      <div>
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-sm text-stone-600">{event.detail}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-stone-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      <motion.section
        {...revealInView}
        id="programs"
        className="mx-auto max-w-7xl bg-gradient-to-br from-stone-50 to-emerald-50/30 px-4 py-8 sm:px-6 lg:px-8 lg:py-16"
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
            const Icon = program.icon;
            return (
              <Card
                key={program.title}
                className="rounded-[28px] border-stone-200 shadow-sm transition hover:-translate-y-1"
              >
                <CardContent className="p-8">
                  <div className="mb-5 inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-xl font-bold">{program.title}</h4>
                  <p className="mt-3 leading-7 text-stone-600">
                    {program.text}
                  </p>
                  <button className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        {...revealInView}
        id="contact"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-[28px] border-stone-200 shadow-sm">
            <CardContent className="p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                Visit Us
              </p>
              <h3 className="mt-3 text-3xl font-bold">
                Easy to find. Easy to contact.
              </h3>
              <div className="mt-6 space-y-5 text-stone-700">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-emerald-700" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p>39 Haskins St, Providence, RI 02903</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 text-emerald-700" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p>(401) 274-3986</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 text-emerald-700" />
                  <div>
                    <p className="font-semibold">Open for daily prayers</p>
                    <p>Prayer access, Jumu&apos;ah, classes, and community events</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-stone-200 bg-emerald-900 text-white shadow-sm">
            <CardContent className="p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-200">
                Next Steps
              </p>
              <h3 className="mt-3 text-3xl font-bold">
                Turn this into a real site stack
              </h3>
              <div className="mt-6 space-y-4 text-emerald-50/90">
                <p>• Connect real prayer times API or manual admin updates</p>
                <p>• Add donation provider like LaunchGood, Stripe, or PayPal</p>
                <p>• Add events CMS for non-technical masjid admins</p>
                <p>• Add imam message, board members, classes, and announcements</p>
              </div>
              <Button variant="secondary" className="mt-8 rounded-2xl">
                Request Full Build Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      <section id="map" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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

      <motion.footer {...revealInView} className="border-t border-stone-200 bg-white">
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