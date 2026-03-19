"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Menu, Moon, Sun, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const SEGMENT_LABELS: Record<string, string> = {
  about: "About",
  announcements: "Announcements",
  donate: "Donate",
  events: "Events",
  leadership: "Leadership",
  programs: "Programs",
};

// Maps a full pathname to a fixed breadcrumb trail, overriding segment-based derivation.
const ROUTE_TRAIL_OVERRIDES: Record<string, string[]> = {
  "/about": ["About"],
  "/about/leadership": ["About"],
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

type ThemeMode = "light" | "dark";

function getThemeSnapshot(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribeTheme(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleChange = () => onStoreChange();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === "theme") {
      onStoreChange();
    }
  };

  mediaQuery.addEventListener("change", handleChange);
  window.addEventListener("storage", handleStorage);
  window.addEventListener("themechange", handleChange);

  return () => {
    mediaQuery.removeEventListener("change", handleChange);
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("themechange", handleChange);
  };
}

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomeRoute = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHomeScrolled, setIsHomeScrolled] = useState(false);
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => "light");

  const showSiteChrome = shouldShowSiteChrome(pathname);
  const trail = useMemo(() => deriveBreadcrumbTrail(pathname), [pathname]);
  const isTransparentHomeHeader = isHomeRoute && !isHomeScrolled;
  const isSolidHeader = !isTransparentHomeHeader || mobileMenuOpen;
  const isAboutPageRoute = pathname === "/about";
  const isLeadershipRoute = pathname === "/about/leadership";
  const isProgramsRoute = pathname.startsWith("/programs");
  const isEventsRoute = pathname.startsWith("/events");
  const isAnnouncementsRoute = pathname.startsWith("/announcements");

  const navLinkClass = (isActive: boolean) =>
    `inline-flex items-center border-b-2 pb-1 transition ${
      isTransparentHomeHeader
        ? isActive
          ? "border-white text-white"
          : "border-transparent hover:text-emerald-200"
        : isActive
          ? "border-emerald-600 text-emerald-800 dark:border-emerald-400 dark:text-emerald-300"
          : "border-transparent hover:text-emerald-700 dark:hover:text-emerald-300"
    }`;

  const mobileLinkClass = (isActive: boolean) =>
    `block rounded-xl px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
        : "text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800"
    }`;

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

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileMenuOpen]);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem("theme", nextTheme);
    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <>
      {showSiteChrome ? (
        <>
          <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
              isSolidHeader
                ? "border-b border-stone-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-stone-800/80 dark:bg-stone-950/90"
                : "border-b border-transparent bg-transparent"
            }`}
          >
            <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 sm:gap-4 sm:px-6 lg:px-8">
              <Link href="/" className="flex flex-shrink-0 items-center gap-4 transition hover:opacity-80">
                <div className="relative h-14 w-[150px] overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm sm:h-16 sm:w-[220px]">
                  <Image
                    src="/ICRI_logo.jpeg"
                    alt="Islamic Center of Rhode Island logo"
                    fill
                    sizes="(max-width: 640px) 150px, 220px"
                    className="object-contain p-1"
                    priority
                  />
                </div>
                <div className="hidden sm:block">
                </div>
              </Link>

              <Button
                asChild
                className="rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-semibold hover:bg-emerald-800 sm:px-8 sm:text-base"
              >
                <Link href="/donate">Donate</Link>
              </Button>

              <nav
                className={`hidden gap-6 text-sm font-medium lg:flex ${
                  isTransparentHomeHeader ? "text-white" : "text-stone-700 dark:text-stone-200"
                }`}
              >
                <Link
                  href="/#prayers"
                  className={navLinkClass(false)}
                >
                  Prayer Times
                </Link>
                <Link
                  href="/announcements"
                  className={navLinkClass(isAnnouncementsRoute)}
                  aria-current={isAnnouncementsRoute ? "page" : undefined}
                >
                  Announcements
                </Link>
                <Link
                  href="/events"
                  className={navLinkClass(isEventsRoute)}
                  aria-current={isEventsRoute ? "page" : undefined}
                >
                  Events
                </Link>
                <Link
                  href="/programs"
                  className={navLinkClass(isProgramsRoute)}
                  aria-current={isProgramsRoute ? "page" : undefined}
                >
                  Programs
                </Link>
                <Link
                  href="/about"
                  className={navLinkClass(isAboutPageRoute)}
                  aria-current={isAboutPageRoute ? "page" : undefined}
                >
                  About
                </Link>
                <Link
                  href="/about/leadership"
                  className={navLinkClass(isLeadershipRoute)}
                  aria-current={isLeadershipRoute ? "page" : undefined}
                >
                  Leadership
                </Link>
                <Link
                  href="/#contact"
                  className={navLinkClass(false)}
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

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  className={`rounded-xl lg:hidden ${
                    isSolidHeader
                      ? "border-stone-200 bg-white text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
                      : "border-white/60 bg-white/90 text-stone-900 hover:bg-white dark:border-stone-300/80 dark:bg-stone-100/95 dark:text-black dark:hover:bg-stone-100"
                  }`}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-site-menu"
                >
                  {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {mobileMenuOpen ? (
              <div
                id="mobile-site-menu"
                className="border-t border-stone-200/80 bg-white/95 px-4 pb-4 pt-3 shadow-sm backdrop-blur dark:border-stone-800 dark:bg-stone-950/95 lg:hidden"
              >
                <div className="space-y-1">
                  <Link
                    href="/#prayers"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileLinkClass(false)}
                  >
                    Prayer Times
                  </Link>
                  <Link
                    href="/announcements"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileLinkClass(isAnnouncementsRoute)}
                    aria-current={isAnnouncementsRoute ? "page" : undefined}
                  >
                    Announcements
                  </Link>
                  <Link
                    href="/events"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileLinkClass(isEventsRoute)}
                    aria-current={isEventsRoute ? "page" : undefined}
                  >
                    Events
                  </Link>
                  <Link
                    href="/programs"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileLinkClass(isProgramsRoute)}
                    aria-current={isProgramsRoute ? "page" : undefined}
                  >
                    Programs
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileLinkClass(pathname === "/about")}
                    aria-current={pathname === "/about" ? "page" : undefined}
                  >
                    About
                  </Link>
                  <Link
                    href="/about/leadership"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileLinkClass(isLeadershipRoute)}
                    aria-current={isLeadershipRoute ? "page" : undefined}
                  >
                    Leadership
                  </Link>
                  <Link
                    href="/#contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileLinkClass(false)}
                  >
                    Contact
                  </Link>
                </div>
              </div>
            ) : null}
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