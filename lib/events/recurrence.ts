import { localTimeToUtcIso, utcToLocalParts } from "@/lib/updates/timezone";

export const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export const MONTHLY_WEEKS = ["1", "2", "3", "4", "last"] as const;
export type MonthlyWeek = (typeof MONTHLY_WEEKS)[number];

/**
 * How an event repeats. The event's own start/end are its first session; every
 * later session keeps the same local time of day and length.
 */
export type EventRecurrence = {
  frequency: "weekly" | "monthly";
  /** Weekly only: 1 = every week, 2 = every other week. */
  interval?: number;
  /** Weekly only: the days it meets. Always includes the first session's day. */
  weekdays?: Weekday[];
  /** Monthly only: which week of the month, on the first session's weekday. */
  monthlyWeek?: MonthlyWeek;
  /** Last date a session can fall on ("YYYY-MM-DD"); open-ended when absent. */
  until?: string;
};

export type Occurrence = { startMs: number; endMs: number };

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ORDINALS: Record<MonthlyWeek, string> = { "1": "First", "2": "Second", "3": "Third", "4": "Fourth", last: "Last" };
const MAX_OCCURRENCES = 1000;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// Calendar dates as whole days since 1970-01-01, so date arithmetic ignores time zones.
function dayNumber(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / 86_400_000;
}

function dateOf(day: number): string {
  return new Date(day * 86_400_000).toISOString().slice(0, 10);
}

function weekdayOf(day: number): number {
  return (((day + 4) % 7) + 7) % 7; // 1970-01-01 was a Thursday
}

/** True for a real calendar date written "YYYY-MM-DD". */
export function isValidDate(value: string): boolean {
  return DATE_PATTERN.test(value) && dateOf(dayNumber(value)) === value;
}

/** The weekday of a "YYYY-MM-DD" date. */
export function weekdayOfDate(date: string): Weekday {
  return WEEKDAYS[weekdayOf(dayNumber(date))];
}

/** Which week of the month a date falls in, for monthly rules. */
export function monthlyWeekOf(date: string): { nth: number; isLast: boolean } {
  const [year, month, day] = date.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return { nth: Math.ceil(day / 7), isLast: day + 7 > daysInMonth };
}

/**
 * Cleans a recurrence read from Sanity or produced by Claude. Returns null for
 * a one-time event or a rule that can't be used.
 */
export function normalizeRecurrence(raw: unknown, startAt: string): EventRecurrence | null {
  const value = raw as Partial<EventRecurrence> | null | undefined;
  const start = utcToLocalParts(startAt);
  if (!value || !start || (value.frequency !== "weekly" && value.frequency !== "monthly")) {
    return null;
  }

  const until = typeof value.until === "string" && isValidDate(value.until) ? value.until : undefined;
  if (until && until < start.date) {
    return null;
  }

  if (value.frequency === "monthly") {
    const monthlyWeek = MONTHLY_WEEKS.find((week) => week === value.monthlyWeek);
    return monthlyWeek ? { frequency: "monthly", monthlyWeek, ...(until ? { until } : {}) } : null;
  }

  const interval = Number.isInteger(value.interval) && value.interval! >= 1 && value.interval! <= 4 ? value.interval! : 1;
  const startWeekday = WEEKDAYS[weekdayOf(dayNumber(start.date))];
  const weekdays = WEEKDAYS.filter((day) => day === startWeekday || value.weekdays?.includes(day));

  return { frequency: "weekly", interval, weekdays, ...(until ? { until } : {}) };
}

/** Session start dates ("YYYY-MM-DD") in order, from the first session on. */
function* sessionDates(startDate: string, recurrence: EventRecurrence): Generator<string> {
  const startDay = dayNumber(startDate);
  const lastDay = recurrence.until ? dayNumber(recurrence.until) : Number.POSITIVE_INFINITY;

  if (recurrence.frequency === "weekly") {
    const interval = recurrence.interval ?? 1;
    const days = (recurrence.weekdays?.length ? recurrence.weekdays : [WEEKDAYS[weekdayOf(startDay)]])
      .map((weekday) => WEEKDAYS.indexOf(weekday))
      .sort((a, b) => a - b);
    const firstWeek = startDay - weekdayOf(startDay);

    for (let week = 0; ; week += 1) {
      for (const offset of days) {
        const day = firstWeek + week * 7 * interval + offset;
        if (day > lastDay) {
          return;
        }
        if (day >= startDay) {
          yield dateOf(day);
        }
      }
    }
  }

  const weekday = weekdayOf(startDay);
  const [startYear, startMonth] = startDate.split("-").map(Number);
  for (let monthOffset = 0; ; monthOffset += 1) {
    const year = startYear + Math.floor((startMonth - 1 + monthOffset) / 12);
    const month = ((startMonth - 1 + monthOffset) % 12) + 1;
    let day: number;

    if (recurrence.monthlyWeek === "last") {
      const monthEnd = Date.UTC(year, month, 0) / 86_400_000;
      day = monthEnd - ((weekdayOf(monthEnd) - weekday + 7) % 7);
    } else {
      const monthStart = Date.UTC(year, month - 1, 1) / 86_400_000;
      day = monthStart + ((weekday - weekdayOf(monthStart) + 7) % 7) + 7 * (Number(recurrence.monthlyWeek ?? "1") - 1);
    }

    if (day > lastDay) {
      return;
    }
    if (day >= startDay) {
      yield dateOf(day);
    }
  }
}

/**
 * The session to show for a repeating event at `nowMs`: the one in progress or
 * next, or the last one if the series is over (`isPast`). Sessions without an
 * end time count as over once they start, matching one-time events.
 */
export function currentOccurrence(
  startAt: string,
  endAt: string | undefined,
  recurrence: EventRecurrence,
  nowMs: number
): (Occurrence & { isPast: boolean }) | null {
  const start = utcToLocalParts(startAt);
  const firstStartMs = new Date(startAt).getTime();
  if (!start || Number.isNaN(firstStartMs)) {
    return null;
  }

  const endMs = endAt ? new Date(endAt).getTime() : Number.NaN;
  const durationMs = Number.isNaN(endMs) || endMs < firstStartMs ? 0 : endMs - firstStartMs;

  let previous: Occurrence | null = null;
  let count = 0;
  for (const date of sessionDates(start.date, recurrence)) {
    const sessionStart = localTimeToUtcIso(`${date}T${start.time}`);
    if (!sessionStart) {
      continue;
    }

    const occurrence = { startMs: new Date(sessionStart).getTime(), endMs: 0 };
    occurrence.endMs = occurrence.startMs + durationMs;
    if (occurrence.endMs >= nowMs) {
      return { ...occurrence, isPast: false };
    }

    previous = occurrence;
    count += 1;
    if (count >= MAX_OCCURRENCES) {
      break;
    }
  }

  return previous ? { ...previous, isPast: true } : null;
}

function joinNames(names: string[]): string {
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0];
}

/** Plain-language rule, e.g. "Every Saturday until Dec 13, 2026" or "First Friday of every month". */
export function describeRecurrence(recurrence: EventRecurrence, startAt: string): string {
  const start = utcToLocalParts(startAt);
  const startWeekday = start ? weekdayOf(dayNumber(start.date)) : 0;

  let rule: string;
  if (recurrence.frequency === "monthly") {
    rule = `${ORDINALS[recurrence.monthlyWeek ?? "1"]} ${DAY_NAMES[startWeekday]} of every month`;
  } else {
    const days = joinNames(
      (recurrence.weekdays?.length ? recurrence.weekdays : [WEEKDAYS[startWeekday]]).map(
        (weekday) => DAY_NAMES[WEEKDAYS.indexOf(weekday)]
      )
    );
    const interval = recurrence.interval ?? 1;
    rule = interval === 1 ? `Every ${days}` : interval === 2 ? `Every other ${days}` : `Every ${interval} weeks on ${days}`;
  }

  if (!recurrence.until) {
    return rule;
  }

  const until = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${recurrence.until}T00:00:00Z`)
  );
  return `${rule} until ${until}`;
}
