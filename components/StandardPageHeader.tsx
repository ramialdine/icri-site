"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

type StandardPageHeaderProps = {
  currentPage: string;
  breadcrumbTrail?: string[];
};

export default function StandardPageHeader({ currentPage, breadcrumbTrail }: StandardPageHeaderProps) {
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  const trail = breadcrumbTrail && breadcrumbTrail.length > 0 ? breadcrumbTrail : [currentPage];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-stone-200/80 bg-white/90 shadow-sm backdrop-blur transition-all duration-300 dark:border-stone-800/80 dark:bg-stone-950/90">
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
            <div>
              <p className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 sm:block dark:text-emerald-300">
                ICRI
              </p>
              <h1 className="text-base font-bold text-stone-900 dark:text-stone-100 sm:text-lg">
                Masjid Al Kareem
              </h1>
            </div>
          </Link>
          <nav className="hidden gap-6 text-sm font-medium text-stone-700 dark:text-stone-200 md:flex">
            <div className="relative">
              <button
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className="flex items-center transition hover:text-emerald-700 dark:hover:text-emerald-300"
              >
                About
              </button>
              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 rounded-xl border border-stone-200 bg-white text-stone-700 shadow-lg dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200">
                  <Link
                    href="/about/imam"
                    className="block px-4 py-3 first:rounded-t-xl text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950"
                    onClick={() => setAboutDropdownOpen(false)}
                  >
                    The Imam
                  </Link>
                  <Link
                    href="/about/president"
                    className="block border-t border-stone-100 px-4 py-3 text-sm font-medium hover:bg-emerald-50 dark:border-stone-700 dark:hover:bg-emerald-950"
                    onClick={() => setAboutDropdownOpen(false)}
                  >
                    The President
                  </Link>
                </div>
              )}
            </div>
            <Link href="/#prayers" className="hover:text-emerald-700 dark:hover:text-emerald-300">
              Prayer Times
            </Link>
            <Link href="/programs" className="hover:text-emerald-700 dark:hover:text-emerald-300">
              Programs
            </Link>
            <Link href="/events" className="hover:text-emerald-700 dark:hover:text-emerald-300">
              Events
            </Link>
            <Link href="/amenities" className="hover:text-emerald-700 dark:hover:text-emerald-300">
              Amenities
            </Link>
            <Link href="/#contact" className="hover:text-emerald-700 dark:hover:text-emerald-300">
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
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button asChild className="rounded-2xl bg-emerald-700 hover:bg-emerald-800">
              <Link href="/donate">Donate</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-4 pb-2 pt-24 text-sm text-stone-600 dark:text-stone-300 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-medium text-emerald-700 transition hover:text-emerald-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
        <span>/</span>
        {trail.map((segment, index) => (
          <div key={`${segment}-${index}`} className="contents">
            {index > 0 ? <span>/</span> : null}
            <span className={index === trail.length - 1 ? "font-semibold text-stone-900 dark:text-stone-100" : ""}>
              {segment}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}