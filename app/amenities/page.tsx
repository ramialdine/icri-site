"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type AmenitySection = {
	title: string;
	description: string;
};

const amenitySections: AmenitySection[] = [
	{
		title: "Parking",
		description:
			"Our masjid provides convenient on-site and nearby parking for daily prayers, Jumuah, and events. Please park only in designated areas, keep drive lanes clear, and follow posted signs to help ensure safe access for families, seniors, and emergency vehicles. There are 3 designated parking areas for our masjid - one in front of the building, a larger lot with dedicated parking for the sisters, one behind the building, a far smaller parking lot, and one across from the bulding.",
	},
	{
		title: "Bathrooms",
		description:
			"Restrooms are available for brothers and sisters and are cleaned regularly throughout the day. We kindly ask everyone to help keep the facilities clean and dry for the next person by using the bins provided and reporting any supply needs to the Imam or president.",
	},
	{
		title: "Wudu Area",
		description:
			"Dedicated wudu spaces are available in the bathrooms to support preparation for prayer in a comfortable and respectful setting. Please use water carefully, avoid splashing when possible, and leave the area tidy so that others can perform wudu with ease.",
	},
];

export default function AmenitiesPage() {
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

	return (
		<div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
			<header
				className="fixed inset-x-0 top-0 z-50 border-b border-stone-200/80 bg-white/90 shadow-sm backdrop-blur transition-all duration-300 dark:border-stone-800/80 dark:bg-stone-950/90"
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
						<div>
							<p
								className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 sm:block dark:text-emerald-300"
							>
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
								className="flex items-center gap-1.5 transition hover:text-emerald-700 dark:hover:text-emerald-300"
							>
								About
								<svg
									className={`h-4 w-4 transition-transform ${
										aboutDropdownOpen ? "rotate-180" : ""
									}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 14l-7 7m0 0l-7-7m7 7V3"
									/>
								</svg>
							</button>
							{aboutDropdownOpen && (
								<div
									className="absolute top-full left-0 mt-2 w-48 rounded-xl border border-stone-200 bg-white text-stone-700 shadow-lg dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
								>
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

			<main className="py-16 pt-32">
				<section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<div className="max-w-3xl">
					<p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
						Masjid Facilities
					</p>
					<h1 className="mt-3 text-4xl font-bold sm:text-5xl">Amenities</h1>
					<p className="mt-4 text-base leading-7 text-stone-600 dark:text-stone-300">
						Explore the various amenties offered by Masjid - Al Kareem.
					</p>
					<Button asChild className="mt-6 rounded-2xl bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200">
						<Link href="/">Back to Home</Link>
					</Button>
				</div>

				<div className="mt-10 space-y-6">
					{amenitySections.map((section) => (
						<Card key={section.title} className="overflow-hidden rounded-3xl border-stone-200 shadow-sm dark:border-stone-800">
							<CardContent className="p-0">
								<div className="grid gap-0 md:grid-cols-[280px_1fr]">
									<div className="flex min-h-[220px] items-center justify-center border-b border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-900/70 md:min-h-full md:border-r md:border-b-0">
										<div className="mx-6 flex h-[160px] w-full max-w-[220px] items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 bg-white text-center text-sm font-medium text-stone-500 dark:border-stone-600 dark:bg-stone-950 dark:text-stone-300">
											Picture Placeholder
										</div>
									</div>

									<div className="p-6 sm:p-8">
										<h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 sm:text-3xl">
											{section.title}
										</h2>
										<p className="mt-4 text-base leading-7 text-stone-600 dark:text-stone-300">
											{section.description}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
				</section>
			</main>
		</div>
	);
}
