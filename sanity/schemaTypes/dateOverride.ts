import { defineArrayMember, defineField, defineType } from "sanity";

import { HHMM_24H_REGEX, timeValidationMessage } from "./helpers";

const optionalPrayerField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "string",
    validation: (rule) =>
      rule.regex(HHMM_24H_REGEX, { name: "HH:mm" }).error(timeValidationMessage),
  });

export const dateOverrideType = defineType({
  name: "dateOverride",
  title: "Date Override",
  type: "document",
  fields: [
    defineField({
      name: "date",
      title: "Date",
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
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", initialValue: "1st Khutbah" }),
            defineField({
              name: "khutbahTime",
              title: "Khutbah Time",
              type: "string",
              validation: (rule) => rule.required().regex(HHMM_24H_REGEX, { name: "HH:mm" }).error(timeValidationMessage),
            }),
            defineField({
              name: "iqamahTime",
              title: "Iqama Time",
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
      title: "Internal Note",
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
      subtitle: note || "Custom Iqama overrides",
    }),
  },
});
