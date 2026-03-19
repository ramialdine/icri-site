import { defineArrayMember, defineField, defineType } from "sanity";

import { HHMM_24H_REGEX, timeValidationMessage } from "./helpers";

const prayerFields = [
  defineField({
    name: "fajr",
    title: "Fajr Iqama",
    description: "Optional. Leave empty to use automatic logic-based iqama. Format HH:mm (24-hour), example: 05:45",
    type: "string",
    validation: (rule) => rule.regex(HHMM_24H_REGEX, { name: "HH:mm" }).error(timeValidationMessage),
  }),
  defineField({
    name: "dhuhr",
    title: "Dhuhr Iqama",
    description: "Optional. Leave empty to use automatic logic-based iqama. Format HH:mm (24-hour), example: 13:30",
    type: "string",
    validation: (rule) => rule.regex(HHMM_24H_REGEX, { name: "HH:mm" }).error(timeValidationMessage),
  }),
  defineField({
    name: "asr",
    title: "Asr Iqama",
    description: "Optional. Leave empty to use automatic logic-based iqama. Format HH:mm (24-hour), example: 16:45",
    type: "string",
    validation: (rule) => rule.regex(HHMM_24H_REGEX, { name: "HH:mm" }).error(timeValidationMessage),
  }),
  defineField({
    name: "maghrib",
    title: "Maghrib Iqama",
    description: "Optional. Leave empty to use automatic logic-based iqama. Format HH:mm (24-hour), example: 18:20",
    type: "string",
    validation: (rule) => rule.regex(HHMM_24H_REGEX, { name: "HH:mm" }).error(timeValidationMessage),
  }),
  defineField({
    name: "isha",
    title: "Isha Iqama",
    description: "Optional. Leave empty to use automatic logic-based iqama. Format HH:mm (24-hour), example: 19:45",
    type: "string",
    validation: (rule) => rule.regex(HHMM_24H_REGEX, { name: "HH:mm" }).error(timeValidationMessage),
  }),
];

export const prayerConfigType = defineType({
  name: "prayerConfig",
  title: "Prayer Times Settings",
  type: "document",
  fields: [
    defineField({
      name: "timezone",
      title: "Masjid Time Zone",
      description: "Usually leave as America/New_York unless you move to a different time zone.",
      type: "string",
      initialValue: "America/New_York",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "weeklyTemplate",
      title: "Default Weekly Prayer Times",
      description: "Set the regular weekly iqama schedule. Use special date overrides only when needed.",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        ...prayerFields,
        defineField({
          name: "jumuah",
          title: "Jumu'ah Sessions",
          description: "Add one or more Jumu'ah khutbah/iqama sessions.",
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
                  description: "Enter time as HH:mm (24-hour). Example: 13:15",
                  type: "string",
                  validation: (rule) => rule.required().regex(HHMM_24H_REGEX, { name: "HH:mm" }).error(timeValidationMessage),
                }),
                defineField({
                  name: "iqamahTime",
                  title: "Iqama Time",
                  description: "Enter time as HH:mm (24-hour). Example: 13:45",
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
      ],
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Prayer Times Settings",
      subtitle: "Weekly schedule and masjid timezone",
    }),
  },
});
