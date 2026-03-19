import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

type RuleSection = {
  title: string;
  subtitle: string;
  points: ReactNode[];
};

const ruleSections: RuleSection[] = [
  {
    title: "General Masjid Rules",
    subtitle: "Shared guidelines to keep the masjid welcoming, safe, and focused on worship.",
    points: [
      "Keep voices low in prayer and Qur'an areas, especially before and after salah.",
      <>
        <strong className="font-semibold">Silence</strong> or switch phones to vibrate before
        entering the prayer hall.
      </>,
      "Dress modestly and respectfully while on masjid grounds.",
      "Keep children near you and help them remain safe and considerate of others.",
      "Running, rough play, and loud behavior are not permitted inside the masjid.",
      "Please dispose of trash properly and leave prayer and common spaces clean.",
      "Water bottles are allowed, but food and gum should be consumed outside of the prayer areas.",
      "Follow staff and volunteer guidance during busy events and Friday prayer.",
    ],
  },
  {
    title: "Parking Rules",
    subtitle: "Help everyone enter and leave safely, including families, elders, and neighbors.",
    points: [
      "Park only in marked and authorized spaces.",
      <>
        Do not block driveways, <strong className="font-semibold">entrances</strong>, sidewalks,
        other cars, or <strong className="font-semibold">emergency access lanes</strong>.
      </>,
      "Use accessible parking only when legally authorized.",
      "Carpool when possible for Jumu'ah and large events to reduce congestion.",
      "Please avoid idling, loud music, or unnecessary honking in the parking area.",
      "Observe traffic flow signs and volunteer directions at all times.",
      "If the lot is full, use overflow options as directed and park with courtesy for nearby residents.",
      "Please lock your vehicle and do not leave valuables visible. The masjid is not responsible for any damage or theft in the parking area."
    ],
  },
  {
    title: "General Masjid Etiquette",
    subtitle: "Adab and good character are part of worship and community life.",
    points: [
      "Greet others with kindness and make space for newcomers.",
      "Avoid cutting in front of people who are praying.",
      "Keep walkways clear of shoes, bags, and personal belongings.",
      "Use respectful language and avoid arguments inside the masjid.",
      "Be mindful of fragrance and cleanliness before attending prayers.",
      "In classes or khutbah, listen attentively and minimize side conversations.",
      "Offer help to elders, visitors, and families when needed.",
      "Photography and recording require prior permission from staff, especially in prayer areas."
    ],
  },
];

export default function RulesAndEtiquettePage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <section className="relative overflow-hidden pt-8">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_45%)]" />

        <div className="relative mx-auto max-w-6xl px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100">About ICRI</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Rules & Etiquette</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-emerald-50 sm:text-lg">
            These guidelines help preserve the sanctity of the masjid and ensure a respectful,
            welcoming environment for everyone.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-7">
          {ruleSections.map((section) => (
            <Card
              key={section.title}
              className="rounded-[30px] border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900/70"
            >
              <CardContent className="p-7 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                  Community Guidelines
                </p>
                <h2 className="mt-3 text-2xl font-bold">{section.title}</h2>
                <p className="mt-3 text-base leading-7 text-stone-600 dark:text-stone-300">{section.subtitle}</p>

                <ul className="mt-6 ml-6 list-disc space-y-3 text-base leading-7 text-stone-700 dark:text-stone-200">
                  {section.points.map((point, index) => (
                    <li key={`${section.title}-${index}`}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
