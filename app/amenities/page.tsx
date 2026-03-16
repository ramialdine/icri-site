import Link from "next/link";
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
	return (
		<div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
			<main className="py-16 pt-8">
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
