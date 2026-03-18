import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <main className="px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-14">
      <section className="mx-auto w-full">
        <Card className="overflow-hidden rounded-[32px] shadow-xl">
          <CardContent className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                Donate to Masjid Al Kareem
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
                Support the masjid mission 💚
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Every donation helps sustain worship, Islamic learning, and community support for families across Rhode Island.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
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

      <section id="donation-methods" className="py-8 lg:py-12">
        <div className="rounded-[32px] bg-emerald-800 p-6 text-white shadow-xl sm:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100">Contribution Options</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Choose the easiest way to contribute</h2>
          <p className="mt-3 max-w-3xl text-emerald-50/95">
            Pick the method that works best for you. Every contribution supports the masjid and our community programs.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur-sm">
              <div className="mb-3 inline-flex rounded-xl bg-white p-2 text-emerald-700 shadow-sm">
                <CreditCard className="h-5 w-5" />
              </div>
              <p className="font-semibold">Online Donation</p>
              <p className="mt-2 text-sm text-emerald-50/90">Secure one-time or recurring donations through the website payment form.</p>
              <Button asChild className="mt-4 w-full rounded-xl bg-white text-emerald-800 hover:bg-emerald-50">
                <a
                  href="https://www.paypal.com/donate/?hosted_button_id=F7245FEM2SAUE"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Donate Online
                </a>
              </Button>
            </div>

            <div className="rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur-sm">
              <div className="mb-3 inline-flex rounded-xl bg-white p-2 text-emerald-700 shadow-sm">
                <Landmark className="h-5 w-5" />
              </div>
              <p className="font-semibold">Zelle</p>
              <p className="mt-2 text-sm text-emerald-50/90">Send directly to: donations@icri.org (replace with your official address).</p>
              <p className="mt-4 rounded-lg bg-white/20 px-3 py-2 text-sm font-medium text-white">Memo: Sadaqah / Zakat / General Fund</p>
            </div>

            <div className="rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur-sm">
              <div className="mb-3 inline-flex rounded-xl bg-white p-2 text-emerald-700 shadow-sm">
                <Heart className="h-5 w-5" />
              </div>
              <p className="font-semibold">Venmo</p>
              <p className="mt-2 text-sm text-emerald-50/90">Send to: @MasjidAlKareem (replace with your official handle).</p>
              <p className="mt-4 rounded-lg bg-white/20 px-3 py-2 text-sm font-medium text-white">Include intention in the payment note</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl py-8 lg:py-10">
        <Card className="overflow-hidden rounded-[30px] shadow-sm">
          <CardContent className="grid gap-8 p-6 lg:grid-cols-[1fr_1fr] lg:gap-10 lg:p-8">
            <div className="relative min-h-[260px] overflow-hidden rounded-2xl">
              <Image
                src="/muslimsDonating.jpeg"
                alt="Community members giving charity together"
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-sm font-medium text-white">
                Charity strengthens our community and brings blessing to every home.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                Giving in Islam
              </p>
              <h2 className="mt-2 text-3xl font-bold">Qur’an and Hadith on charity</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                The reminders below are quoted with source references.
              </p>

              <div className="mt-6 space-y-4">
                <blockquote className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
                  <p className="text-sm leading-7">
                    “The example of those who spend their wealth in the way of Allāh is like a seed
                    [of grain] which grows seven spikes; in each spike is a hundred grains. And Allāh
                    multiplies [His reward] for whom He wills. And Allāh is all-Encompassing and Knowing.”
                  </p>
                  <footer className="mt-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    Qur’an 2:261 (Sahih International)
                  </footer>
                </blockquote>

                <blockquote className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
                  <p className="text-sm leading-7">
                    “And donate from what We have provided for you before death comes to one of you and
                    you cry, ‘My Lord! If only You delayed me for a short while, I would give in charity
                    and be one of the righteous.’”
                  </p>
                  <footer className="mt-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    Qur’an 63:10 (The Clear Quran)
                  </footer>
                </blockquote>

                <blockquote className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
                  <p className="text-sm leading-7">
                    “There is never a day wherein servants (of God) get up at morn, but are not visited by
                    two angels. One of them says: O Allah, give him more who spends (for the sake of Allah),
                    and the other says: O Allah, bring destruction to one who withholds.”
                  </p>
                  <footer className="mt-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    Sahih Muslim 1010
                  </footer>
                </blockquote>
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

      </main>
    </div>
  );
}
