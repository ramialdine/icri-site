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
    },
    prepare: ({ title, startAt, isPublished }) => ({
      title: title || "Untitled event",
      subtitle: `${startAt ? new Date(startAt).toLocaleDateString() : "No date"} • ${isPublished ? "Visible" : "Hidden"}`,
    }),
  },
});
