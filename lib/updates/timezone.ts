export const MASJID_TIMEZONE = "America/New_York";

function offsetMinutes(utcMs: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return Math.round((asUtc - utcMs) / 60_000);
}

/**
 * Converts a masjid-local wall time ("2026-10-18T13:00") to a UTC ISO string,
 * or null if it is not a valid "YYYY-MM-DDTHH:mm" value.
 */
export function localTimeToUtcIso(local: string, timeZone = MASJID_TIMEZONE): string | null {
  const match = local.match(/^(\d{4})-(\d{2})-(\d{2})T([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) {
    return null;
  }

  const [year, month, day, hour, minute] = match.slice(1).map(Number);
  const wallAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  if (new Date(wallAsUtc).getUTCDate() !== day) {
    return null;
  }

  // Two passes settle the offset when the guess lands across a DST change.
  let utcMs = wallAsUtc - offsetMinutes(wallAsUtc, timeZone) * 60_000;
  utcMs = wallAsUtc - offsetMinutes(utcMs, timeZone) * 60_000;

  return new Date(utcMs).toISOString();
}

/** Today's date ("YYYY-MM-DD") and weekday in the masjid's time zone. */
export function masjidToday(now = new Date(), timeZone = MASJID_TIMEZONE): { date: string; weekday: string } {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "long" }).format(now);
  return { date, weekday };
}
