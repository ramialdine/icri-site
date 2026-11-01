import { defineField, defineType } from "sanity";

export const eventType = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Event Name",
      description: "Name shown on the website.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Short Description",
      description: "Optional short details about the event.",
      type: "text",
    }),
    defineField({
      name: "startAt",
      title: "Start Date & Time",
      description: "When the event begins.",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endAt",
      title: "End Date & Time",
      description: "Optional end time.",
      type: "datetime",
      validation: (rule) =>
        rule.custom((endAt, context) => {
          if (!endAt) {
            return true;
          }

          const startAt = (context.document as { startAt?: string } | undefined)?.startAt;
          if (!startAt) {
            return true;
          }

          return new Date(endAt).getTime() >= new Date(startAt).getTime()
            ? true
            : "End Date & Time must be after or equal to Start Date & Time.";
        }),
    }),
    defineField({
      name: "recurrence",
      title: "Repeats",
      description:
        "Leave empty for a one-time event. For a repeating event, set Start/End to the first session; the website shows the next session.",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "frequency",
          title: "How often",
          type: "string",
          options: {
            list: [
              { title: "Weekly", value: "weekly" },
              { title: "Monthly", value: "monthly" },
            ],
            layout: "radio",
            direction: "horizontal",
          },
        }),
        defineField({
          name: "interval",
          title: "Every how many weeks",
          description: "1 = every week, 2 = every other week.",
          type: "number",
          initialValue: 1,
          hidden: ({ parent }) => parent?.frequency !== "weekly",
          validation: (rule) => rule.integer().min(1).max(4),
        }),
        defineField({
          name: "weekdays",
          title: "Days of the week",
          description: "Optional. The first session's day is always included.",
          type: "array",
          of: [{ type: "string" }],
          options: {
            list: [
              { title: "Sun", value: "sun" },
              { title: "Mon", value: "mon" },
              { title: "Tue", value: "tue" },
              { title: "Wed", value: "wed" },
              { title: "Thu", value: "thu" },
              { title: "Fri", value: "fri" },
              { title: "Sat", value: "sat" },
            ],
            layout: "grid",
          },
          hidden: ({ parent }) => parent?.frequency !== "weekly",
        }),
        defineField({
          name: "monthlyWeek",
          title: "Which week of the month",
          description: "On the same weekday as the first session.",
          type: "string",
          options: {
            list: [
              { title: "First", value: "1" },
              { title: "Second", value: "2" },
              { title: "Third", value: "3" },
              { title: "Fourth", value: "4" },
              { title: "Last", value: "last" },
            ],
            layout: "radio",
            direction: "horizontal",
          },
          hidden: ({ parent }) => parent?.frequency !== "monthly",
          validation: (rule) =>
            rule.custom((value, context) =>
              (context.parent as { frequency?: string } | undefined)?.frequency === "monthly" && !value
                ? "Choose which week of the month."
                : true
            ),
        }),
        defineField({
          name: "until",
          title: "Last date (optional)",
          description: "Leave empty if it repeats until further notice.",
          type: "date",
          hidden: ({ parent }) => !parent?.frequency,
        }),
      ],
    }),
    defineField({
      name: "location",
      title: "Location",
      description: "Optional location (e.g., Main Prayer Hall).",
      type: "string",
    }),
    defineField({
      name: "flyerImage",
      title: "Flyer Image",
      description: "Optional event flyer image.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Short accessibility description for the flyer image",
        }),
      ],
    }),
    defineField({
      name: "ctaUrl",
      title: "Button Link",
      description: "Optional link for registration or details page.",
      type: "url",
    }),
    defineField({
      name: "isPublished",
      title: "Visible on Website",
      description: "Turn off to hide this event.",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      startAt: "startAt",
      isPublished: "isPublished",
      frequency: "recurrence.frequency",
    },
    prepare: ({ title, startAt, isPublished, frequency }) => ({
      title: title || "Untitled event",
      subtitle: `${startAt ? new Date(startAt).toLocaleDateString() : "No date"}${frequency ? ` • Repeats ${frequency}` : ""} • ${isPublished ? "Visible" : "Hidden"}`,
    }),
  },
});
