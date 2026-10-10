import { groq } from "next-sanity";

import { SCHEDULE_COLUMNS, type ScheduledDay } from "@/lib/prayer-schedule";

import { sanityClient } from "./client";

export type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
export type PrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export type JumuahSession = {
  label?: string;
  khutbahTime: string;
  iqamahTime: string;
};

type PrayerConfig = {
  timezone?: string;
  weeklyTemplate?: Record<PrayerKey, string> & { jumuah?: JumuahSession[] };
};

type DateOverride = {
  date: string;
  fajr?: string;
  dhuhr?: string;
  asr?: string;
  maghrib?: string;
  isha?: string;
  jumuah?: JumuahSession[];
};

const PRAYER_ORDER: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_KEY_MAP: Record<PrayerName, PrayerKey> = {
  Fajr: "fajr",
  Dhuhr: "dhuhr",
  Asr: "asr",
  Maghrib: "maghrib",
  Isha: "isha",
};

// Which printed-timetable columns to show when a monthly schedule is published.
// The ICRI flyer lists Fajr at 18° (primary) and the North America angle,
// and Asr by both Shafi and Hanafi; the site shows the primary columns.
const SCHEDULE_ADHAN_COLUMNS: Record<PrayerKey, keyof ScheduledDay> = {
  fajr: "fajr18",
  dhuhr: "dhuhr",
  asr: "asrShafi",
  maghrib: "maghrib",
  isha: "isha",
};

// The flyer has no Maghrib iqama column; Maghrib falls through to the usual rules.
const SCHEDULE_IQAMAH_COLUMNS: Partial<Record<PrayerKey, keyof ScheduledDay>> = {
  fajr: "fajrIqama",
  dhuhr: "dhuhrIqama",
  asr: "asrIqama",
  isha: "ishaIqama",
};

const IQAMAH_FALLBACK_FIXED_24: Partial<Record<PrayerName, string>> = {
  Dhuhr: "13:00",
  Asr: "17:15",
};

const IQAMAH_FALLBACK_OFFSETS: Partial<Record<PrayerName, number>> = {
  Fajr: 15,
  Maghrib: 5,
  Isha: 10,
};

const prayerConfigQuery = groq`*[_type == "prayerConfig"][0]{
  timezone,
  weeklyTemplate
}`;

const monthlyScheduleDaysQuery = groq`*[_type == "monthlySchedule" && month == $month][0].days`;

const dateOverrideQuery = groq`*[_type == "dateOverride" && date == $date][0]{
  date,
  fajr,
  dhuhr,
  asr,
  maghrib,
  isha,
  jumuah
}`;

function parseApiTime(rawValue: string): string {
  const match = rawValue?.match(/\b([01]\d|2[0-3]):([0-5]\d)\b/);
  if (!match) {
    return "00:00";
  }

  return `${match[1]}:${match[2]}`;
}

export function to12Hour(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function addMinutes(time24: string, minutes: number): string {
  const [h, m] = time24.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const normalized = ((total % 1440) + 1440) % 1440;
  const outHour = Math.floor(normalized / 60);
  const outMinute = normalized % 60;
  return `${String(outHour).padStart(2, "0")}:${String(outMinute).padStart(2, "0")}`;
}

function normalizeCmsTime(value?: string): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(trimmed) ? trimmed : null;
}

function getDateInTimezone(timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getWeekdayInTimezone(timezone: string): number {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
  }).format(new Date());

  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return map[weekday] ?? 0;
}

function getIqamahForPrayer({
  prayerName,
  adhan24,
  override,
  scheduledDay,
  weekDefaults,
}: {
  prayerName: PrayerName;
  adhan24: string;
  override: DateOverride | null;
  scheduledDay: ScheduledDay | null;
  weekDefaults?: Record<PrayerKey, string>;
}): string {
  const key = PRAYER_KEY_MAP[prayerName];

  const overrideTime = normalizeCmsTime(override?.[key]);
  if (overrideTime) {
    return overrideTime;
  }

  const scheduleColumn = SCHEDULE_IQAMAH_COLUMNS[key];
  if (scheduledDay && scheduleColumn) {
    return scheduledDay[scheduleColumn];
  }

  const weeklyTime = normalizeCmsTime(weekDefaults?.[key]);
  if (weeklyTime) {
    return weeklyTime;
  }

  const fixedIqamah = IQAMAH_FALLBACK_FIXED_24[prayerName];
  if (fixedIqamah) {
    return fixedIqamah;
  }

  const fallbackOffset = IQAMAH_FALLBACK_OFFSETS[prayerName] ?? 0;
  return addMinutes(adhan24, fallbackOffset);
}

/** Today's row from the published monthly timetable in Sanity, or null if none is published or it is malformed. */
async function fetchScheduledDay(date: string): Promise<ScheduledDay | null> {
  if (!sanityClient) {
    return null;
  }

  const [, month, day] = date.match(/^(\d{4}-\d{2})-(\d{2})$/) ?? [];
  if (!month) {
    return null;
  }

  const days = await sanityClient.fetch<(Partial<ScheduledDay> & { day?: number })[] | null>(
    monthlyScheduleDaysQuery,
    { month }
  );
  const row = days?.find((entry) => entry.day === Number(day));
  if (!row) {
    return null;
  }

  const scheduledDay = {} as ScheduledDay;
  for (const column of SCHEDULE_COLUMNS) {
    const value = normalizeCmsTime(row[column]);
    if (!value) {
      return null;
    }
    scheduledDay[column] = value;
  }

  return scheduledDay;
}

async function fetchAladhanTimings(date: string): Promise<Record<string, string>> {
  // Pin the request to the masjid-local date so cached responses never carry over past midnight.
  const [year, month, day] = date.split("-");
  const adhanUrl = `https://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=Providence&country=US&state=Rhode+Island&method=2`;

  const adhanResponse = await fetch(adhanUrl, { next: { revalidate: 3600 } });
  const adhanJson = await adhanResponse.json();
  const timings = adhanJson?.data?.timings;

  if (!timings) {
    throw new Error("Unable to load Adhan timings");
  }

  return timings;
}

export async function getTodayPrayerPayload() {
  const timezone = "America/New_York";

  const config = sanityClient
    ? await sanityClient.fetch<PrayerConfig | null>(prayerConfigQuery)
    : null;

  const cmsTimezone = config?.timezone || timezone;
  const effectiveDate = getDateInTimezone(cmsTimezone);

  // Published monthly timetable takes precedence; Aladhan covers months without one.
  const scheduledDay = await fetchScheduledDay(effectiveDate);
  const timings = scheduledDay ? null : await fetchAladhanTimings(effectiveDate);

  const override = sanityClient
    ? await sanityClient.fetch<DateOverride | null>(dateOverrideQuery, {
        date: effectiveDate,
      })
    : null;

  const weeklyDefaults = config?.weeklyTemplate;

  const prayers = PRAYER_ORDER.map((prayerName) => {
    const adhan24 = scheduledDay
      ? scheduledDay[SCHEDULE_ADHAN_COLUMNS[PRAYER_KEY_MAP[prayerName]]]
      : parseApiTime(timings?.[prayerName] ?? "");
    const iqamah24 = getIqamahForPrayer({
      prayerName,
      adhan24,
      override,
      scheduledDay,
      weekDefaults: weeklyDefaults,
    });

    return {
      name: prayerName,
      adhan: to12Hour(adhan24),
      iqamah: to12Hour(iqamah24),
    };
  });

  const weekday = getWeekdayInTimezone(cmsTimezone);
  const isFriday = weekday === 5;

  const jumuahSessions = isFriday
    ? override?.jumuah?.length
      ? override.jumuah
      : weeklyDefaults?.jumuah || []
    : [];

  return {
    date: effectiveDate,
    source: {
      adhan: scheduledDay ? "schedule" : "aladhan",
      iqamah: override
        ? "dateOverride"
        : scheduledDay
          ? "schedule"
          : weeklyDefaults
            ? "weeklyDefault"
            : "fallbackOffset",
    },
    prayers,
    jumuahSessions: jumuahSessions.map((session) => ({
      label: session.label || "Jumu'ah",
      khutbah: to12Hour(session.khutbahTime),
      iqamah: to12Hour(session.iqamahTime),
    })),
  };
}
