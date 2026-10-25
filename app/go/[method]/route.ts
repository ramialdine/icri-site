import { NextResponse } from "next/server";

import { DONATION_DESTINATIONS, isCountableClick, isDonationMethod, recordDonationClick } from "@/lib/donations/clicks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Counts a click on a donate button, then sends the visitor on to the donation
// page. The redirect never waits on, or fails because of, the counter.
export async function GET(request: Request, { params }: { params: Promise<{ method: string }> }) {
  const { method } = await params;

  if (!isDonationMethod(method)) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (isCountableClick(request)) {
    try {
      await recordDonationClick(method);
    } catch (error) {
      console.error("Could not record donation click", error);
    }
  }

  return NextResponse.redirect(DONATION_DESTINATIONS[method], {
    status: 302,
    headers: { "Cache-Control": "no-store" },
  });
}
