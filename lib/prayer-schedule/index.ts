import { september2026 } from "./2026-09";
import type { MonthlyScheduleRows, ScheduledDay } from "./types";

export type { ScheduledDay } from "./types";

// Add each new monthly flyer here, keyed by "YYYY-MM".
const MONTHLY_SCHEDULES: Record<string, MonthlyScheduleRows> = {
  "2026-09": september2026,
};

const COLUMNS: (keyof ScheduledDay)[] = [
  "fajr18",
  "fajrNA",
  "fajrIqama",
  "sunrise",
  "dhuhr",
  "dhuhrIqama",
  "asrShafi",
  "asrHanafi",
  "asrIqama",
  "maghrib",
  "isha",
  "ishaIqama",
];

/** Converts a flyer time like "4:33a" or "12:46p" to 24-hour "HH:mm". */
export function flyerTimeTo24(value: string): string {
  const match = value.trim().match(/^(\d{1,2}):([0-5]\d)\s*([ap])m?$/i);
  if (!match) {
    throw new Error(`Invalid schedule time: "${value}"`);
  }

  const hour12 = Number(match[1]);
  const isPm = match[3].toLowerCase() === "p";
  const hour24 = (hour12 % 12) + (isPm ? 12 : 0);

  return `${String(hour24).padStart(2, "0")}:${match[2]}`;
}

/** Returns the printed timetable for a "YYYY-MM-DD" date (24-hour times), or null if none is published. */
export function getScheduledDay(date: string): ScheduledDay | null {
  const match = date.match(/^(\d{4}-\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const row = MONTHLY_SCHEDULES[match[1]]?.[Number(match[2])];
  if (!row) {
    return null;
  }

  const values = row.trim().split(/\s+/);
  if (values.length !== COLUMNS.length) {
    throw new Error(`Schedule row for ${date} has ${values.length} columns, expected ${COLUMNS.length}`);
  }

  return Object.fromEntries(
    COLUMNS.map((column, index) => [column, flyerTimeTo24(values[index])])
  ) as ScheduledDay;
}
