import { defineArrayMember, defineField, defineType } from "sanity";

import { HHMM_24H_REGEX, timeValidationMessage } from "./helpers";

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

const timeField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "string",
    validation: (rule) => rule.required().regex(HHMM_24H_REGEX, { name: "HH:mm" }).error(timeValidationMessage),
  });

export const monthlyScheduleType = defineType({
  name: "monthlySchedule",
  title: "Monthly Prayer Timetable",
  type: "document",
  fields: [
    defineField({
      name: "month",
      title: "Month",
      description: "Format YYYY-MM, for example 2026-10. One timetable per month.",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .regex(MONTH_REGEX, { name: "YYYY-MM" })
          .custom(async (month, context) => {
            if (!month) {
              return true;
            }

            const id = context.document?._id?.replace(/^drafts\./, "");
            const client = context.getClient({ apiVersion: "2026-03-15" });
            const duplicates = await client.fetch<number>(
              `count(*[_type == "monthlySchedule" && month == $month && !(_id in [$id, $draftId])])`,
              { month, id, draftId: `drafts.${id}` }
            );

            return duplicates === 0 ? true : `A timetable for ${month} already exists.`;
          }),
    }),
    defineField({
      name: "days",
      title: "Days",
      description: "One row per day, copied from the printed flyer. Times are 24-hour HH:mm.",
      type: "array",
      validation: (rule) => rule.required().min(28).max(31),
      of: [
        defineArrayMember({
          name: "scheduleDay",
          title: "Day",
          type: "object",
          fields: [
            defineField({
              name: "day",
              title: "Day of Month",
              type: "number",
              validation: (rule) => rule.required().integer().min(1).max(31),
            }),
            timeField("fajr18", "Fajr (18°)"),
            timeField("fajrNA", "Fajr (North America)"),
            timeField("fajrIqama", "Fajr Iqama"),
            timeField("sunrise", "Sunrise"),
            timeField("dhuhr", "Dhuhr"),
            timeField("dhuhrIqama", "Dhuhr Iqama"),
            timeField("asrShafi", "Asr (Shafi)"),
            timeField("asrHanafi", "Asr (Hanafi)"),
            timeField("asrIqama", "Asr Iqama"),
            timeField("maghrib", "Maghrib"),
            timeField("isha", "Isha"),
            timeField("ishaIqama", "Isha Iqama"),
          ],
          preview: {
            select: { day: "day", fajr: "fajr18", isha: "isha" },
            prepare: ({ day, fajr, isha }) => ({
              title: `Day ${day ?? "?"}`,
              subtitle: `Fajr ${fajr ?? "--"} • Isha ${isha ?? "--"}`,
            }),
          },
        }),
      ],
    }),
  ],
  orderings: [{ title: "Month, newest first", name: "monthDesc", by: [{ field: "month", direction: "desc" }] }],
  preview: {
    select: { month: "month", days: "days" },
    prepare: ({ month, days }) => ({
      title: month ? `Timetable ${month}` : "Monthly Timetable",
      subtitle: `${Array.isArray(days) ? days.length : 0} days`,
    }),
  },
});
