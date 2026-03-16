import { defineArrayMember, defineField, defineType } from "sanity";

import { HHMM_24H_REGEX, timeValidationMessage } from "./helpers";

const optionalPrayerField = (name: string, title: string) =>
  defineField({
    name,
    title,
    description: "Optional. Leave empty to keep the normal weekly time. Format: HH:mm (example: 18:30)",
    type: "string",
    validation: (rule) =>
      rule.regex(HHMM_24H_REGEX, { name: "HH:mm" }).error(timeValidationMessage),
  });

export const dateOverrideType = defineType({
  name: "dateOverride",
  title: "Special Date Prayer Override",
  type: "document",
  fields: [
    defineField({
      name: "date",
      title: "Override Date",
      description: "Choose the exact day that has different prayer times.",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    optionalPrayerField("fajr", "Fajr Iqama Override"),
    optionalPrayerField("dhuhr", "Dhuhr Iqama Override"),
    optionalPrayerField("asr", "Asr Iqama Override"),
    optionalPrayerField("maghrib", "Maghrib Iqama Override"),
    optionalPrayerField("isha", "Isha Iqama Override"),
    defineField({
      name: "jumuah",
      title: "Jumu'ah Override Sessions",
      description: "Optional. Add custom Jumu'ah sessions for this date only.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Session Label",
              description: "Example: 1st Khutbah, 2nd Khutbah",
              type: "string",
              initialValue: "1st Khutbah",
            }),
            defineField({
              name: "khutbahTime",
              title: "Khutbah Time",
              description: "Format: HH:mm (example: 13:15)",
              type: "string",
              validation: (rule) => rule.required().regex(HHMM_24H_REGEX, { name: "HH:mm" }).error(timeValidationMessage),
            }),
            defineField({
              name: "iqamahTime",
              title: "Iqama Time",
              description: "Format: HH:mm (example: 13:45)",
              type: "string",
              validation: (rule) => rule.required().regex(HHMM_24H_REGEX, { name: "HH:mm" }).error(timeValidationMessage),
            }),
          ],
          preview: {
            select: {
              title: "label",
              khutbahTime: "khutbahTime",
              iqamahTime: "iqamahTime",
            },
            prepare: ({ title, khutbahTime, iqamahTime }) => ({
              title: title || "Jumu'ah Session",
              subtitle: `${khutbahTime} • Iqama ${iqamahTime}`,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "note",
      title: "Notes for Admins",
      description: "Optional note to explain why this override exists.",
      type: "string",
    }),
  ],
  preview: {
    select: {
      date: "date",
      note: "note",
    },
    prepare: ({ date, note }) => ({
      title: date ? `Override ${date}` : "Date Override",
      subtitle: note || "Custom prayer times for this date",
    }),
  },
});
