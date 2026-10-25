import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/card";
import { getDonationClicks, type DonationClickRow, type DonationMethod } from "@/lib/donations/clicks";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Donation Button Clicks | Islamic Center of Rhode Island",
  robots: { index: false, follow: false },
};

const LABELS: Record<DonationMethod, string> = { mohid: "Mohid", paypal: "PayPal" };
const METHODS = Object.keys(LABELS) as DonationMethod[];

function totalFor(rows: DonationClickRow[], method: DonationMethod): number {
  return rows.filter((row) => row.method === method).reduce((sum, row) => sum + row.count, 0);
}

export default async function DonationStatsPage() {
  let rows: DonationClickRow[] = [];
  let failed = false;

  try {
    rows = await getDonationClicks();
  } catch (error) {
    console.error("Could not load donation clicks", error);
    failed = true;
  }

  const dates = [...new Set(rows.map((row) => row.date))].slice(0, 30);
  const countOn = (method: DonationMethod, date: string) =>
    rows.find((row) => row.method === method && row.date === date)?.count ?? 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Staff only</p>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Donation button clicks</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          How many times visitors clicked the donate buttons on our website. This counts clicks only. Actual gifts are
          in the Mohid and PayPal accounts.
        </p>

        {failed ? (
          <p className="mt-8 rounded-2xl border p-4 text-sm">Could not load the click counts right now. Try again in a minute.</p>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {METHODS.map((method) => (
                <Card key={method} className="rounded-2xl">
                  <CardContent className="p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">{LABELS[method]}</p>
                    <p className="mt-2 text-4xl font-bold">{totalFor(rows, method)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">clicks since counting started</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2 className="mt-10 text-2xl font-bold">By day (last 30 days with clicks)</h2>
            {dates.length === 0 ? (
              <p className="mt-3 text-muted-foreground">No clicks recorded yet.</p>
            ) : (
              <table className="mt-4 w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 pr-4 font-semibold">Date</th>
                    {METHODS.map((method) => (
                      <th key={method} className="py-2 pr-4 font-semibold">
                        {LABELS[method]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dates.map((date) => (
                    <tr key={date} className="border-b">
                      <td className="py-2 pr-4">{date}</td>
                      {METHODS.map((method) => (
                        <td key={method} className="py-2 pr-4">
                          {countOn(method, date)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </main>
    </div>
  );
}
