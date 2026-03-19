"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AmenitySection = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

const amenitySections: AmenitySection[] = [
  {
    title: "Parking",
    description:
      "Our masjid provides convenient on-site and nearby parking for daily prayers, Jumuah, and events. Please park only in designated areas, keep drive lanes clear, and follow posted signs to help ensure safe access for families, seniors, and emergency vehicles.",
    imageSrc: "/nightMasjidParking.jpeg",
    imageAlt: "Night view of the masjid parking area",
  },
  {
    title: "Dining Room",
    description:
      "A dedicated dining room supports community meals, iftar gatherings, and family events in a welcoming space for all ages.",
    imageSrc: "/ramadan2026/communityInDiningRoom.jpg",
    imageAlt: "Community gathered in the masjid dining room",
  },
  {
    title: "Wudu Area",
    description:
      "Dedicated wudu spaces are available to support preparation for prayer in a comfortable and respectful setting. Please use water carefully and leave the area tidy so that others can perform wudu with ease.",
    imageSrc: "/wuduStation.jpeg",
    imageAlt: "Wudu station at the masjid",
  },
];

export default function AboutPage() {
  const revealInView = {
    initial: { opacity: 0, y: 34 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: "easeOut" as const },
    viewport: { once: true, amount: 0.14 },
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <section className="relative flex min-h-[34svh] items-center justify-center overflow-hidden pt-8 sm:min-h-[40svh]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_45%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative z-10 mx-auto max-w-2xl px-4 text-center text-white"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100">About ICRI</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl md:text-6xl">The Masjid</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-emerald-50 sm:text-lg md:text-xl">Serving Providence since 1976</p>
        </motion.div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-6 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">About the Masjid</p>
          <h3 className="mt-3 text-3xl font-bold sm:text-4xl">A staple of the community, serving Rhode Island since 1976.</h3>
          <p className="mt-4 text-base leading-7 text-stone-600 dark:text-stone-300">
            Masjid Al Kareem (Islamic Center of Rhode Island) has long been a welcoming hub for worship,
            education, family life, and community care in Providence.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="rounded-[30px] border-stone-200 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
            <CardContent className="p-0">
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-[30px]">
                <Image src="/ICRItunnel.jpg" alt="Interior corridor and prayer access at Masjid Al Kareem" fill sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold">Welcoming & Accessible</h4>
                <p className="mt-3 leading-7 text-stone-600 dark:text-stone-300">
                  We strive to keep the masjid welcoming for everyone, with family-friendly spaces and accessibility-minded facilities.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[30px] border-stone-200 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
            <CardContent className="p-0">
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-[30px]">
                <Image src="/muslimsPraying.jpg" alt="Congregants standing in prayer at the masjid" fill sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold">Worship & Learning</h4>
                <p className="mt-3 leading-7 text-stone-600 dark:text-stone-300">
                  The masjid hosts five daily prayers, Jumu&apos;ah, classes, and programs that support spiritual growth.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[30px] border-stone-200 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
            <CardContent className="p-0">
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-[30px]">
                <Image src="/ICRIcommunity.jpg" alt="Community members gathered at Masjid Al Kareem" fill sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" />
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold">Community Support</h4>
                <p className="mt-3 leading-7 text-stone-600 dark:text-stone-300">
                  From Ramadan iftars to year-round family support and events, the masjid remains a central place of care.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 rounded-[32px] border-stone-200 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
          <CardContent className="grid gap-8 p-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">History & Community</p>
              <h4 className="mt-3 text-2xl font-bold sm:text-3xl">Rooted in Providence, built around worship, family, and service.</h4>
              <div className="mt-4 space-y-4 leading-7 text-stone-600 dark:text-stone-300">
                <p>
                  Since 1976, Masjid Al Kareem has served as a spiritual home for Muslims across Rhode Island.
                  Alongside daily prayers and Jumu&apos;ah, the masjid has supported generations through learning and community life.
                </p>
                <p>
                  The masjid includes dedicated women&apos;s space with nearby parking access, family-friendly facilities,
                  and practical amenities. Community support includes classes, youth activities, Ramadan iftars,
                  and programs that strengthen connection and care.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-stone-200 dark:border-stone-700">
              <Image src="/menEntranceAtNight.jpg" alt="Masjid Al Kareem exterior at night" fill sizes="(max-width: 1024px) 100vw, 420px" className="object-cover" />
            </div>
          </CardContent>
        </Card>
      </section>

      <motion.section {...revealInView} id="amenities" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Masjid Facilities</p>
          <h3 className="mt-3 text-3xl font-bold sm:text-4xl">Amenities</h3>
          <p className="mt-4 text-base leading-7 text-stone-600 dark:text-stone-300">Explore the amenities available at Masjid Al Kareem.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {amenitySections.map((section) => (
            <Card key={section.title} className="overflow-hidden rounded-[30px] border-stone-200 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
              <CardContent className="p-0">
                <div className="relative min-h-[180px] overflow-hidden border-b border-stone-200 dark:border-stone-800">
                  <Image
                    src={section.imageSrc}
                    alt={section.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold">{section.title}</h4>
                  <p className="mt-3 leading-7 text-stone-600 dark:text-stone-300">{section.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>

      <motion.section {...revealInView} className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Learn More</p>
          <h3 className="mt-3 text-3xl font-bold">Connect with Leadership</h3>
          <p className="mx-auto mb-8 mt-4 max-w-2xl text-base text-stone-600 dark:text-stone-300">
            Have questions or would like to learn more about community programs? Reach out through our contact section.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="rounded-2xl bg-emerald-700 hover:bg-emerald-800">
              <Link href="/#contact">Contact Information</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl">
              <Link href="/about/leadership">Leadership</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl">
              <Link href="/about/rules">Rules & Etiquette</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      <motion.footer {...revealInView} className="mt-16 border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-stone-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-semibold text-stone-900 dark:text-stone-100">Masjid Al Kareem · Islamic Center of Rhode Island</p>
            <p>Providence, Rhode Island</p>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-emerald-700">Home</Link>
            <a href="#" className="hover:text-emerald-700">Facebook</a>
            <a href="#" className="hover:text-emerald-700">YouTube</a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
