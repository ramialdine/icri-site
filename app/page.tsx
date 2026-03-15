"use client";

import React from "react";
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
} from "lucide-react";

const prayerTimes = [
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

export default function Page() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
              ICRI
            </p>
            <h1 className="text-lg font-bold sm:text-xl">Masjid Al Kareem</h1>
          </div>
          <nav className="hidden gap-6 md:flex text-sm font-medium text-stone-700">
            <a href="#about" className="hover:text-emerald-700">
              About
            </a>
            <a href="#prayers" className="hover:text-emerald-700">
              Prayer Times
            </a>
            <a href="#programs" className="hover:text-emerald-700">
              Programs
            </a>
            <a href="#events" className="hover:text-emerald-700">
              Events
            </a>
            <a href="#contact" className="hover:text-emerald-700">
              Contact
            </a>
          </nav>
          <Button className="rounded-2xl">Donate</Button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_35%),radial-gradient(circle_at_left,rgba(20,184,166,0.12),transparent_30%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">
              Islamic Center of Rhode Island
            </p>
            <h2 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
              A clean, modern home online for Masjid Al Kareem in Providence.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
              Built for prayer times, announcements, donations, classes, and
              community connection without the usual clutter people keep putting
              on mosque websites like it is still 2009.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="rounded-2xl px-6">View Prayer Times</Button>
              <Button variant="outline" className="rounded-2xl px-6">
                Upcoming Events
              </Button>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-emerald-700" />
                  <div>
                    <p className="font-semibold">39 Haskins St, Providence, RI</p>
                    <p className="text-sm text-stone-600">
                      Serving the local Muslim community in Providence
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-5 w-5 text-emerald-700" />
                  <div>
                    <p className="font-semibold">(401) 274-3986</p>
                    <p className="text-sm text-stone-600">
                      Call for programs, events, and general questions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative z-10"
          >
            <Card className="overflow-hidden rounded-[28px] border-stone-200 shadow-xl">
              <CardContent className="p-0">
                <div className="bg-emerald-800 p-6 text-white">
                  <p className="text-sm uppercase tracking-[0.2em] text-emerald-100">
                    Today at the Masjid
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-2xl font-bold">
                    <Clock className="h-6 w-6" />
                    Prayer Schedule
                  </div>
                </div>
                <div className="grid divide-y divide-stone-200 bg-white">
                  {prayerTimes.map((prayer) => (
                    <div
                      key={prayer.name}
                      className="flex items-center justify-between px-6 py-4"
                    >
                      <div>
                        <p className="text-base font-semibold">{prayer.name}</p>
                        <p className="text-sm text-stone-500">
                          Adhan {prayer.adhan}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-stone-500">Iqamah</p>
                        <p className="text-base font-semibold text-emerald-700">
                          {prayer.iqamah}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-stone-200 bg-stone-50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Jumu&apos;ah</p>
                      <p className="text-sm text-stone-600">
                        1st Khutbah 12:30 PM · 2nd Khutbah 1:15 PM
                      </p>
                    </div>
                    <Button variant="outline" className="rounded-2xl">
                      Full Timetable
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section
        id="about"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-[28px] border-stone-200 shadow-sm">
            <CardContent className="p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                About the Masjid
              </p>
              <h3 className="mt-3 text-3xl font-bold">
                Simple, welcoming, and built for the community.
              </h3>
              <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
                This concept keeps the same general spirit as the reference
                site: a strong hero section, prayer times, donation CTA, program
                highlights, and clean contact details. The difference is that
                this version is more modern, easier to scan on mobile, and less
                likely to make visitors rage-quit after two clicks.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {quickLinks.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-stone-100 px-4 py-3 text-sm font-medium text-stone-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-stone-200 shadow-sm">
            <CardContent className="p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                Support the Mission
              </p>
              <h3 className="mt-3 text-2xl font-bold">
                Make donating ridiculously easy
              </h3>
              <p className="mt-4 text-base leading-7 text-stone-600">
                Add one-tap donations, Ramadan campaigns, sadaqah, zakat, and
                masjid expansion support with a clear payment flow.
              </p>
              <div className="mt-6 rounded-3xl bg-emerald-50 p-5">
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6 text-emerald-700" />
                  <div>
                    <p className="font-semibold">Featured appeal</p>
                    <p className="text-sm text-stone-600">
                      General masjid support and community programming
                    </p>
                  </div>
                </div>
                <Button className="mt-5 w-full rounded-2xl">
                  Donate Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section
        id="prayers"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Prayer Times
            </p>
            <h3 className="mt-2 text-3xl font-bold">
              Fast access to the info people actually came for
            </h3>
          </div>
          <Button variant="outline" className="hidden rounded-2xl md:inline-flex">
            Embed live timetable
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {prayerTimes.map((prayer) => (
            <Card
              key={prayer.name}
              className="rounded-[24px] border-stone-200 shadow-sm"
            >
              <CardContent className="p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-stone-500">
                  {prayer.name}
                </p>
                <p className="mt-4 text-3xl font-bold">{prayer.adhan}</p>
                <p className="mt-2 text-sm text-stone-600">
                  Iqamah: {prayer.iqamah}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="programs"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16"
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
      </section>

      <section id="events" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="rounded-[30px] border-stone-200 shadow-sm">
            <CardContent className="grid gap-8 p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  Events
                </p>
                <h3 className="mt-3 text-3xl font-bold">
                  Announcements and events without the chaos
                </h3>
                <p className="mt-4 leading-7 text-stone-600">
                  This section can be connected to a CMS, Google Calendar, or a
                  simple admin panel so the masjid can post Eid announcements,
                  fundraisers, classes, and youth events without needing to
                  summon the one cousin who knows web design.
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
      </section>

      <section
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
      </section>

      <footer className="border-t border-stone-200 bg-white">
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
            <a href="#" className="hover:text-emerald-700">
              Donate
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}