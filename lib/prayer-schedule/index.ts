import type { ScheduledDay } from "./types";

export type { MonthlyScheduleRows, ScheduledDay } from "./types";

/** Flyer column order, left to right (Maghrib has no iqama column on the flyer). */
export const SCHEDULE_COLUMNS: (keyof ScheduledDay)[] = [
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
  const match = value.trim().match(/^(\d{1,2}):([0-5]\d)\s*([ap])\.?m?\.?$/i);
  if (!match || Number(match[1]) < 1 || Number(match[1]) > 12) {
    throw new Error(`Invalid schedule time: "${value}"`);
  }

  const hour12 = Number(match[1]);
  const isPm = match[3].toLowerCase() === "p";
  const hour24 = (hour12 % 12) + (isPm ? 12 : 0);

  return `${String(hour24).padStart(2, "0")}:${match[2]}`;
}

/** Parses one flyer row (12 times, as a string or list) into a ScheduledDay. */
export function parseFlyerRow(row: string | string[]): ScheduledDay {
  const values = typeof row === "string" ? row.trim().split(/\s+/) : row;
  if (values.length !== SCHEDULE_COLUMNS.length) {
    throw new Error(`Schedule row has ${values.length} columns, expected ${SCHEDULE_COLUMNS.length}`);
  }

  return Object.fromEntries(
    SCHEDULE_COLUMNS.map((column, index) => [column, flyerTimeTo24(values[index])])
  ) as ScheduledDay;
}

/** Number of days in a "YYYY-MM" month. */
export function daysInMonth(month: string): number {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
}
