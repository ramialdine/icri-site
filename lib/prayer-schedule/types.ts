/**
 * One printed timetable row, copied verbatim from the monthly ICRI flyer as
 * 12 space-separated times ("4:33a", "12:46p", ...) in this column order:
 *
 *   fajr18 fajrNA fajrIqama sunrise dhuhr dhuhrIqama
 *   asrShafi asrHanafi asrIqama maghrib isha ishaIqama
 */
export type MonthlyScheduleRows = Record<number, string>;

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
