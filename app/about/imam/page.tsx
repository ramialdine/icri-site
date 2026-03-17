"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";

export default function ImamPage() {
  const [aboutExpanded, setAboutExpanded] = useState(false);

  const revealInView = {
    initial: { opacity: 0, y: 34 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: "easeOut" as const },
    viewport: { once: true, amount: 0.14 },
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <section className="relative flex min-h-[60svh] items-center justify-center overflow-hidden pt-8">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_45%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative z-10 mx-auto max-w-2xl px-4 text-center text-white"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100">
            About ICRI
          </p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl md:text-6xl">
            The Masjid
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-emerald-50 sm:text-lg md:text-xl">
            Serving Providence since 1976
          </p>
        </motion.div>
      </section>

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
                  src="/ICRItunnel.jpg"
                  alt="Interior corridor of Masjid Al Kareem"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section {...revealInView} className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Card className="rounded-[32px] border-stone-200 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div className="ml-4 lg:ml-8 lg:self-center">
                <div className="relative h-80 min-h-[320px] overflow-hidden rounded-3xl lg:h-auto lg:min-h-[420px]">
                  <Image
                    src="/imamABLportrait.jpeg"
                    alt="The Imam"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 400px"
                  />
                </div>
              </div>
              <div className="pl-8 pr-8 py-8 lg:py-10 lg:pl-12">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                    Imam 
                  </p>
                  <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                    Imam Abudl Latif 
                  </h2>
                  <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                    Spiritual Guide, Khutbah Speaker, and an AWESOME GUY!
                  </p>
                </div>

                <div className="mt-6 space-y-4 text-base leading-7 text-stone-600 dark:text-stone-300">
                  <p>
                    Add info here about the Imams background etc.
                  </p>
                  <p>
                    The Imam is dedicated to fostering spiritual growth, providing counsel to community members, and ensuring that Masjid Al Kareem remains a welcoming space for all Muslims seeking to strengthen their faith and connection to Islam.
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-emerald-700" />
                    <span className="text-sm">imam@icri.org replace with actual email</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-emerald-700" />
                    <span className="text-sm">(401) 274-3986</span>
                  </div>
                </div>

                <Button asChild className="mt-8 rounded-2xl bg-emerald-700 hover:bg-emerald-800">
                  <Link href="/">Return to Home</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        {...revealInView}
        className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <Card className="rounded-[32px] border-stone-200 shadow-sm">
          <CardContent className="p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Role & Responsibilities
            </p>
            <h3 className="mt-3 text-3xl font-bold">
              Leadership at the Masjid
            </h3>
            <div className="mt-6 space-y-4 text-base leading-7 text-stone-600 dark:text-stone-300">
              <p>
                The Imam plays a central role in the spiritual and religious life of Masjid Al Kareem and the broader Islamic community in Rhode Island. Key responsibilities include:
              </p>
              <ul className="space-y-3 ml-6 list-disc">
                <li>Leading the five daily prayers and providing spiritual guidance</li>
                <li>Delivering khutbahs (sermons) during Friday Jumuah prayers</li>
                <li>Providing Islamic counseling to community members</li>
                <li>Teaching Islamic classes and facilitating Quranic study groups</li>
                <li>Overseeing religious events and ceremonies</li>
                <li>Supporting the communitys spiritual development and growth</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        {...revealInView}
        className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
      >
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
            Learn More
          </p>
          <h3 className="mt-3 text-3xl font-bold">
            Connect with Leadership
          </h3>
          <p className="mt-4 text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto mb-8">
            Have questions or would like to learn more about Islamic teachings? Contact the Imam or visit the masjid during prayer times.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild className="rounded-2xl bg-emerald-700 hover:bg-emerald-800">
              <Link href="/#contact">Contact Information</Link>
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
            <p className="font-semibold text-stone-900 dark:text-stone-100">
              Masjid Al Kareem · Islamic Center of Rhode Island
            </p>
            <p>Providence, Rhode Island</p>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-emerald-700">
              Home
            </Link>
            <a href="#" className="hover:text-emerald-700">
              Facebook
            </a>
            <a href="#" className="hover:text-emerald-700">
              YouTube
            </a>
          </div>
        </div>
      </motion.footer>
    </div>

  );
}
