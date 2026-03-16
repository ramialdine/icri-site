import { NextResponse } from "next/server";

import { getTodayPrayerPayload } from "@/sanity/lib/prayer";

const fallbackPrayerTimes = [
  { name: "Fajr", adhan: "5:24 AM", iqamah: "5:45 AM" },
  { name: "Dhuhr", adhan: "12:03 PM", iqamah: "12:30 PM" },
  { name: "Asr", adhan: "3:28 PM", iqamah: "4:00 PM" },
  { name: "Maghrib", adhan: "6:53 PM", iqamah: "6:58 PM" },
  { name: "Isha", adhan: "8:12 PM", iqamah: "8:30 PM" },
];

const fallbackJumuahSessions = [{ label: "1st Khutbah", khutbah: "1:00 PM", iqamah: "1:30 PM" }];

export async function GET() {
  try {
    const payload = await getTodayPrayerPayload();
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json(
      {
        date: new Date().toISOString().slice(0, 10),
        source: { adhan: "fallback", iqamah: "fallback" },
        prayers: fallbackPrayerTimes,
        jumuahSessions: fallbackJumuahSessions,
      },
      {
        status: 200,
      }
    );
  }
}
