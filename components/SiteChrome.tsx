"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

const SEGMENT_LABELS: Record<string, string> = {
  about: "About",
  amenities: "Amenities",
  announcements: "Announcements",
  donate: "Donate",
  events: "Events",
  programs: "Programs",
};

// Maps a full pathname to a fixed breadcrumb trail, overriding segment-based derivation.
const ROUTE_TRAIL_OVERRIDES: Record<string, string[]> = {
  "/about/imam": ["About"],
};

function formatSegmentLabel(segment: string) {
  const normalized = segment.toLowerCase();
  if (SEGMENT_LABELS[normalized]) {
    return SEGMENT_LABELS[normalized];
  }

  return segment
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function deriveBreadcrumbTrail(pathname: string) {
  if (ROUTE_TRAIL_OVERRIDES[pathname]) {
    return ROUTE_TRAIL_OVERRIDES[pathname];
  }
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment) => formatSegmentLabel(segment));
}

function shouldShowSiteChrome(pathname: string) {
  if (!pathname) {
    return false;
  }

  if (pathname.startsWith("/preview") || pathname.startsWith("/studio")) {
    return false;
  }

  return true;
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomeRoute = pathname === "/";
  const [isHomeScrolled, setIsHomeScrolled] = useState(false);
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

  const showSiteChrome = shouldShowSiteChrome(pathname);
  const trail = useMemo(() => deriveBreadcrumbTrail(pathname), [pathname]);
  const isTransparentHomeHeader = isHomeRoute && !isHomeScrolled;

  useEffect(() => {
    if (!isHomeRoute) {
      return;
    }

    const handleScroll = () => {
      setIsHomeScrolled(window.scrollY > 16);
    };

    const rafId = window.requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isHomeRoute]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <>
      {showSiteChrome ? (
        <>
          <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
              isTransparentHomeHeader
                ? "border-b border-transparent bg-transparent"
                : "border-b border-stone-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-stone-800/80 dark:bg-stone-950/90"
            }`}
          >
            <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <Link href="/" className="flex flex-shrink-0 items-center gap-4 transition hover:opacity-80">
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
                </div>
              </Link>

              <Button
                asChild
                className="rounded-2xl bg-emerald-700 px-8 py-2 text-base font-semibold hover:bg-emerald-800"
              >
                <Link href="/donate">Donate</Link>
              </Button>

              <nav
                className={`hidden gap-6 text-sm font-medium lg:flex ${
                  isTransparentHomeHeader ? "text-white" : "text-stone-700 dark:text-stone-200"
                }`}
              >
                <Link
                  href="/about/imam"
                  className={isTransparentHomeHeader ? "hover:text-emerald-200" : "hover:text-emerald-700 dark:hover:text-emerald-300"}
                >
                  About
                </Link>
                <Link
                  href="/#prayers"
                  className={isTransparentHomeHeader ? "hover:text-emerald-200" : "hover:text-emerald-700 dark:hover:text-emerald-300"}
                >
                  Prayer Times
                </Link>
                <Link
                  href="/programs"
                  className={isTransparentHomeHeader ? "hover:text-emerald-200" : "hover:text-emerald-700 dark:hover:text-emerald-300"}
                >
                  Programs
                </Link>
                <Link
                  href="/events"
                  className={isTransparentHomeHeader ? "hover:text-emerald-200" : "hover:text-emerald-700 dark:hover:text-emerald-300"}
                >
                  Events
                </Link>
                <Link
                  href="/announcements"
                  className={isTransparentHomeHeader ? "hover:text-emerald-200" : "hover:text-emerald-700 dark:hover:text-emerald-300"}
                >
                  Announcements
                </Link>
                <Link
                  href="/amenities"
                  className={isTransparentHomeHeader ? "hover:text-emerald-200" : "hover:text-emerald-700 dark:hover:text-emerald-300"}
                >
                  Amenities
                </Link>
                <Link
                  href="/#contact"
                  className={isTransparentHomeHeader ? "hover:text-emerald-200" : "hover:text-emerald-700 dark:hover:text-emerald-300"}
                >
                  Contact
                </Link>
              </nav>

              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="flex-shrink-0 rounded-xl border-white/60 bg-white/90 text-stone-700 hover:bg-white dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
                  aria-label="Toggle dark mode"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </header>

          {trail.length > 0 ? (
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
          ) : null}
        </>
      ) : null}

      {children}
    </>
  );
}