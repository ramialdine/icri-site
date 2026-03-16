import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StandardPageHeader from "@/components/StandardPageHeader";
import { Heart, GraduationCap, Wrench, HandHeart, CreditCard, Landmark } from "lucide-react";

const supportAreas = [
  {
    icon: Heart,
    title: "Daily Masjid Operations",
    description:
      "Utilities, cleaning, maintenance, and essential day-to-day masjid expenses.",
    emoji: "🕌",
  },
  {
    icon: GraduationCap,
    title: "Classes & Weekend School",
    description:
      "Qur'an classes, youth programming, and Islamic education for children and adults.",
    emoji: "📚",
  },
  {
    icon: HandHeart,
    title: "Community Care",
    description:
      "Iftar programs, family support, and community events throughout the year.",
    emoji: "🤝",
  },
  {
    icon: Wrench,
    title: "Facility Improvements",
    description:
      "Repairs, upgrades, and accessibility improvements for all worshippers.",
    emoji: "🔧",
  },
];

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StandardPageHeader currentPage="Donate" />

      <main className="px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14">
      <section className="mx-auto max-w-7xl">
        <Card className="overflow-hidden rounded-[32px] shadow-xl">
          <CardContent className="grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                Donate to Masjid Al Kareem
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
                Support the masjid mission 💚
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Every donation helps sustain worship, Islamic learning, and community support for families across Providence.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild className="rounded-2xl bg-emerald-700 px-6 hover:bg-emerald-800">
                  <a href="#donation-methods">Donate Now</a>
                </Button>
                <Button asChild variant="outline" className="rounded-2xl">
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </div>

            <div className="relative min-h-[260px] overflow-hidden rounded-[28px] shadow-sm">
              <Image
                src="/masjidExterior.png"
                alt="Masjid Al Kareem exterior"
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/65 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-sm uppercase tracking-[0.2em] text-emerald-100">Serving Providence Since 1976</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl py-4 lg:py-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">What your donation supports</p>
          <h2 className="mt-2 text-3xl font-bold">Where your sadaqah goes</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {supportAreas.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="rounded-[24px] shadow-sm">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-semibold">{item.emoji}</span>
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="donation-methods" className="mx-auto max-w-7xl py-8 lg:py-12">
        <Card className="rounded-[30px] shadow-sm">
          <CardContent className="p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Donation Methods</p>
            <h2 className="mt-2 text-3xl font-bold">Choose the easiest way to contribute</h2>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30 p-5">
                <div className="mb-3 inline-flex rounded-xl bg-white dark:bg-stone-900 p-2 text-emerald-700 dark:text-emerald-400 shadow-sm">
                  <CreditCard className="h-5 w-5" />
                </div>
                <p className="font-semibold">Online Donation</p>
                <p className="mt-2 text-sm text-muted-foreground">Secure one-time or recurring donations through the website payment form.</p>
                <Button className="mt-4 w-full rounded-xl bg-emerald-700 hover:bg-emerald-800">Donate Online</Button>
              </div>

              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30 p-5">
                <div className="mb-3 inline-flex rounded-xl bg-white dark:bg-stone-900 p-2 text-emerald-700 dark:text-emerald-400 shadow-sm">
                  <Landmark className="h-5 w-5" />
                </div>
                <p className="font-semibold">Zelle</p>
                <p className="mt-2 text-sm text-muted-foreground">Send directly to: donations@icri.org (replace with your official address).</p>
                <p className="mt-4 rounded-lg bg-card px-3 py-2 text-sm font-medium">Memo: Sadaqah / Zakat / General Fund</p>
              </div>

              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30 p-5">
                <div className="mb-3 inline-flex rounded-xl bg-white dark:bg-stone-900 p-2 text-emerald-700 dark:text-emerald-400 shadow-sm">
                  <Heart className="h-5 w-5" />
                </div>
                <p className="font-semibold">Venmo</p>
                <p className="mt-2 text-sm text-muted-foreground">Send to: @MasjidAlKareem (replace with your official handle).</p>
                <p className="mt-4 rounded-lg bg-card px-3 py-2 text-sm font-medium">Include intention in the payment note</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      </main>
    </div>
  );
}
