import { masjidToday } from "@/lib/updates/timezone";
import { sanityWriteClient } from "@/sanity/lib/writeClient";

// Where each donate button on /donate really goes. The buttons link to
// /go/<method> so every click can be counted before the visitor is redirected.
export const DONATION_DESTINATIONS = {
  mohid: "https://us.mohid.co/ri/providence/icri/masjid/online/donation",
  paypal: "https://www.paypal.com/donate/?hosted_button_id=F7245FEM2SAUE",
} as const;

export type DonationMethod = keyof typeof DONATION_DESTINATIONS;

export function isDonationMethod(value: string): value is DonationMethod {
  return Object.hasOwn(DONATION_DESTINATIONS, value);
}

// Link previews, crawlers and scripts follow links too. Only real browsers count.
const AUTOMATED_USER_AGENT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|curl|wget|python|node-fetch/i;

export function isCountableClick(request: Request): boolean {
  if (request.method !== "GET") {
    return false;
  }

  const purpose = (request.headers.get("purpose") ?? request.headers.get("sec-purpose") ?? "").toLowerCase();
  if (purpose.includes("prefetch") || purpose.includes("preview") || request.headers.get("next-router-prefetch")) {
    return false;
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  return userAgent !== "" && !AUTOMATED_USER_AGENT.test(userAgent);
}

// One document per method per day. The "." in the ID makes it a private path
// that is only readable with a token. It holds no personal data, only a count.
function clickDocumentId(method: DonationMethod, date: string): string {
  return `donateclick.${method}.${date}`;
}

export async function recordDonationClick(method: DonationMethod, now = new Date()): Promise<void> {
  if (!sanityWriteClient) {
    throw new Error("SANITY_API_WRITE_TOKEN is not configured");
  }

  const { date } = masjidToday(now);
  const id = clickDocumentId(method, date);

  await sanityWriteClient
    .transaction()
    .createIfNotExists({ _id: id, _type: "donateClick", method, date, count: 0 })
    .patch(id, (patch) => patch.inc({ count: 1 }))
    .commit();
}

export type DonationClickRow = { method: DonationMethod; date: string; count: number };

export async function getDonationClicks(): Promise<DonationClickRow[]> {
  if (!sanityWriteClient) {
    throw new Error("SANITY_API_WRITE_TOKEN is not configured");
  }

  const rows = await sanityWriteClient.fetch<{ method?: string; date?: string; count?: number }[]>(
    `*[_type == "donateClick"]{method, date, count}`
  );

  return rows
    .filter((row): row is DonationClickRow => !!row.method && isDonationMethod(row.method) && !!row.date && typeof row.count === "number")
    .sort((a, b) => b.date.localeCompare(a.date));
}
