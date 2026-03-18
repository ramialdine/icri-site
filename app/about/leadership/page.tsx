import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LeadershipPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <section className="relative flex min-h-[44svh] items-center justify-center overflow-hidden pt-8">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_45%)]" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100">About ICRI</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl md:text-6xl">Leadership</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-emerald-50 sm:text-lg">
            Spiritual guidance, service, and stewardship for the Providence community.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <Card className="rounded-[32px] border-stone-200 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
          <CardContent className="grid gap-8 p-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:p-10">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-stone-200 dark:border-stone-700">
              <Image
                src="/imamABLportrait1.jpeg"
                alt="Imam of Masjid Al Kareem"
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover"
              />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Imam</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Imam Abdul Latif</h2>
              <p className="mt-4 leading-7 text-stone-600 dark:text-stone-300">
                The Imam provides spiritual leadership, teaches, counsels families, and helps guide the
                community through worship, service, and Islamic learning.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="rounded-[30px] border-stone-200 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
            <CardContent className="p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Responsibilities</p>
              <h3 className="mt-3 text-2xl font-bold">Core leadership duties</h3>
              <ul className="mt-5 ml-6 list-disc space-y-3 leading-7 text-stone-600 dark:text-stone-300">
                <li>Leading daily prayers and delivering Jumu&apos;ah khutbah</li>
                <li>Providing Islamic counseling and pastoral support</li>
                <li>Teaching classes and facilitating Qur&apos;an study</li>
                <li>Supporting youth and family development programs</li>
                <li>Guiding religious events and major observances</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-[30px] border-stone-200 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
            <CardContent className="p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Service</p>
              <h3 className="mt-3 text-2xl font-bold">Community-centered leadership</h3>
              <p className="mt-5 leading-7 text-stone-600 dark:text-stone-300">
                Leadership at Masjid Al Kareem is rooted in care, accessibility, and collaboration.
                We aim to serve the spiritual and practical needs of congregants while fostering unity,
                education, and compassion.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="rounded-2xl bg-emerald-700 hover:bg-emerald-800">
                  <Link href="/#contact">Contact the Masjid</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-2xl">
                  <Link href="/about/imam">Back to About</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Additional Positions</p>
          <h3 className="mt-2 text-2xl font-bold">Leadership team (placeholders)</h3>

          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <Card className="rounded-[30px] border-stone-200 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
              <CardContent className="p-8">
                <div className="mb-4 flex h-28 items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 text-sm text-stone-500 dark:border-stone-700 dark:text-stone-300">
                  Photo Placeholder
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Position 1</p>
                <h4 className="mt-2 text-xl font-bold">Board President (Placeholder)</h4>
                <p className="mt-3 leading-7 text-stone-600 dark:text-stone-300">
                  Add profile, responsibilities, and contact information for this role.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[30px] border-stone-200 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
              <CardContent className="p-8">
                <div className="mb-4 flex h-28 items-center justify-center rounded-2xl border-2 border-dashed border-stone-300 text-sm text-stone-500 dark:border-stone-700 dark:text-stone-300">
                  Photo Placeholder
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Position 2</p>
                <h4 className="mt-2 text-xl font-bold">Youth Director (Placeholder)</h4>
                <p className="mt-3 leading-7 text-stone-600 dark:text-stone-300">
                  Add profile, responsibilities, and contact information for this role.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
