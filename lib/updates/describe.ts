import { to12Hour } from "@/sanity/lib/prayer";

import type { DraftInput } from "./extract";
import { MASJID_TIMEZONE } from "./timezone";

function formatDateTime(iso: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: MASJID_TIMEZONE, ...options }).format(new Date(iso));
}

const DATE_TIME: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
};

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/** A short, plain-text summary of a draft for the WhatsApp approval message. */
export function describeDraft(draft: DraftInput): string {
  switch (draft.kind) {
    case "monthly_schedule": {
      const monthName = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(
        new Date(`${draft.month}-01T00:00:00Z`)
      );
      const first = draft.days[0];
      const sample =
        `Day 1: Fajr ${to12Hour(first.fajr18)} (iqama ${to12Hour(first.fajrIqama)}), ` +
        `Dhuhr ${to12Hour(first.dhuhr)} (${to12Hour(first.dhuhrIqama)}), ` +
        `Asr ${to12Hour(first.asrShafi)} (${to12Hour(first.asrIqama)}), ` +
        `Maghrib ${to12Hour(first.maghrib)}, Isha ${to12Hour(first.isha)} (${to12Hour(first.ishaIqama)}).`;
      const warnings = draft.warnings.length
        ? ` Check these rows: ${draft.warnings.slice(0, 3).join("; ")}${draft.warnings.length > 3 ? ` and ${draft.warnings.length - 3} more` : ""}.`
        : "";
      return `${monthName} prayer timetable, ${draft.days.length} days. ${sample}${warnings} Compare every row with the flyer on the preview page before approving.`;
    }
    case "event": {
      const when = formatDateTime(draft.startAt, DATE_TIME);
      const until = draft.endAt ? `–${formatDateTime(draft.endAt, { hour: "numeric", minute: "2-digit" })}` : "";
      const where = draft.location ? ` at ${draft.location}` : "";
      const summary = draft.summary ? ` ${truncate(draft.summary, 300)}` : "";
      return `Event "${draft.title}", ${when}${until}${where}.${summary}`;
    }
    case "announcement": {
      const window =
        draft.startAt || draft.endAt
          ? ` Shown ${draft.startAt ? `from ${formatDateTime(draft.startAt, DATE_TIME)} ` : ""}${draft.endAt ? `until ${formatDateTime(draft.endAt, DATE_TIME)}` : ""}.`.replace(" .", ".")
          : "";
      return `Announcement "${draft.title}": ${truncate(draft.message, 400)}${window}`;
    }
  }
}
