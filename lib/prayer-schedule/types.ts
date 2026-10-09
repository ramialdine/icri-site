/**
 * Printed timetable rows keyed by day of month, copied verbatim from the
 * monthly ICRI flyer as 12 space-separated times ("4:33a", "12:46p", ...) in
 * the column order of SCHEDULE_COLUMNS.
 */
export type MonthlyScheduleRows = Record<number, string>;

/** One day of a monthly timetable, every time in 24-hour "HH:mm". */
export type ScheduledDay = {
  fajr18: string;
  fajrNA: string;
  fajrIqama: string;
  sunrise: string;
  dhuhr: string;
  dhuhrIqama: string;
  asrShafi: string;
  asrHanafi: string;
  asrIqama: string;
  maghrib: string;
  isha: string;
  ishaIqama: string;
};
