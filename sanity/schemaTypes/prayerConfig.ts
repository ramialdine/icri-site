import { defineArrayMember, defineField, defineType } from "sanity";

import { HHMM_24H_REGEX, timeValidationMessage } from "./helpers";

const prayerFields = [
  defineField({
    name: "fajr",
    title: "Fajr Iqama",
    type: "string",
    validation: (rule) => rule.required().regex(HHMM_24H_REGEX, { name: "HH:mm" }).error(timeValidationMessage),
  }),
  defineField({
    name: "dhuhr",
    title: "Dhuhr Iqama",
    type: "string",
    validation: (rule) => rule.required().regex(HHMM_24H_REGEX, { name: "HH:mm" }).error(timeValidationMessage),
  }),
  defineField({
    name: "asr",
    title: "Asr Iqama",
    type: "string",
    validation: (rule) => rule.required().regex(HHMM_24H_REGEX, { name: "HH:mm" }).error(timeValidationMessage),
  }),
  defineField({
    name: "maghrib",
    title: "Maghrib Iqama",
    type: "string",
    validation: (rule) => rule.required().regex(HHMM_24H_REGEX, { name: "HH:mm" }).error(timeValidationMessage),
  }),
  defineField({
    name: "isha",
    title: "Isha Iqama",
    type: "string",
    validation: (rule) => rule.required().regex(HHMM_24H_REGEX, { name: "HH:mm" }).error(timeValidationMessage),
  }),
];

export const prayerConfigType = defineType({
  name: "prayerConfig",
  title: "Prayer Configuration",
  type: "document",
  fields: [
    defineField({
      name: "timezone",
      title: "Masjid Timezone",
      type: "string",
      initialValue: "America/New_York",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "weekAnchorDate",
      title: "Week A Anchor Date",
      description: "Any known Week A date. Week parity is calculated from this date.",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "biweeklyTemplate",
      title: "Biweekly Defaults",
      type: "object",
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "weekA",
          title: "Week A",
          type: "object",
          fields: [
            ...prayerFields,
            defineField({
              name: "jumuah",
              title: "Jumu'ah Sessions",
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
          ],
        }),
        defineField({
          name: "weekB",
          title: "Week B",
          type: "object",
          fields: [
            ...prayerFields,
            defineField({
              name: "jumuah",
              title: "Jumu'ah Sessions",
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
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Prayer Configuration",
      subtitle: "Biweekly defaults and timezone",
    }),
  },
});
