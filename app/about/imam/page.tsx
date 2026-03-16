"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Moon, Sun } from "lucide-react";

type ThemePreference = "system" | "light" | "dark";

export default function ImamPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [themePreference, setThemePreference] = useState<ThemePreference>("system");
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    
    setMounted(true);
    const savedTheme = localStorage.getItem("theme-preference") as ThemePreference | null;
    if (savedTheme) {
      setThemePreference(savedTheme);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      let newTheme: "light" | "dark" = "light";
      if (themePreference === "system") {
        newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } else {
        newTheme = themePreference;
      }
      setTheme(newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    updateTheme();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateTheme);
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [themePreference]);

  const toggleTheme = () => {
    const newTheme: ThemePreference = themePreference === "dark" ? "light" : "dark";
    setThemePreference(newTheme);
    localStorage.setItem("theme-preference", newTheme);
  };

  const revealInView = {
    initial: { opacity: 0, y: 34 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: "easeOut" as const },
    viewport: { once: true, amount: 0.14 },
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-stone-200/80 bg-white/90 backdrop-blur shadow-sm dark:border-stone-800/80 dark:bg-stone-950/90"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-4 transition hover:opacity-80">
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
            <div className="hidden sm:block">
              <p
                className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                  isScrolled ? "text-emerald-700" : "text-emerald-100"
                }`}
              >
                ICRI
              </p>
              <h1
                className={`text-base font-bold sm:text-lg ${
                  isScrolled ? "text-stone-900 dark:text-stone-100" : "text-white"
                }`}
              >
                Masjid Al Kareem
              </h1>
            </div>
          </Link>
          <nav
            className={`hidden gap-6 text-sm font-medium md:flex ${
              isScrolled ? "text-stone-700 dark:text-stone-200" : "text-white"
            }`}
          >
            <Link href="/#prayers" className={isScrolled ? "hover:text-emerald-700" : "hover:text-emerald-200"}>
              Prayer Times
            </Link>
            <Link href="/programs" className={isScrolled ? "hover:text-emerald-700" : "hover:text-emerald-200"}>
              Programs
            </Link>
            <Link href="/events" className={isScrolled ? "hover:text-emerald-700" : "hover:text-emerald-200"}>
              Events
            </Link>
            <Link href="/#contact" className={isScrolled ? "hover:text-emerald-700" : "hover:text-emerald-200"}>
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-xl border-white/60 bg-white/90 text-stone-700 hover:bg-white dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
              aria-label="Toggle dark mode"
            >
              {mounted ? (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : <Moon className="h-4 w-4" />}
            </Button>
            <Button asChild className="rounded-2xl bg-emerald-700 hover:bg-emerald-800">
              <Link href="/donate">Donate</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-[60svh] items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_45%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative z-10 text-center text-white px-4"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100">
            Leadership
          </p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl md:text-6xl">
            The Imam
          </h1>
          <p className="mt-4 text-base text-emerald-50 sm:text-lg md:text-xl max-w-2xl mx-auto">
            Spiritual leader and guide of Masjid Al Kareem
          </p>
        </motion.div>
      </section>

      <motion.section {...revealInView} className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Card className="rounded-[32px] border-stone-200 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
              <div className="relative aspect-square overflow-hidden lg:rounded-r-3xl lg:rounded-l-none rounded-t-3xl lg:rounded-t-none">
                <Image
                  src="/ICRI_logo.jpeg"
                  alt="The Imam"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
              </div>
              <div className="px-8 py-8 lg:py-10">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">
                    Imam
                  </p>
                  <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                    Imam Abudl Latif 
                  </h2>
                  <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                    Spiritual Guide, Khutbah Speaker
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

      <motion.footer {...revealInView} className="border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950 mt-16">
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
