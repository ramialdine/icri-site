import { defineField, defineType } from "sanity";

export const programType = defineType({
  name: "program",
  title: "Program",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Program Name",
      description: "Name shown on the website.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Program Description",
      description: "Explain the program in simple words.",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "iconKey",
      title: "Icon Style",
      description: "Choose the icon shown for this program card.",
      type: "string",
      initialValue: "book",
      options: {
        list: [
          { title: "Book", value: "book" },
          { title: "Users", value: "users" },
          { title: "Calendar", value: "calendar" },
        ],
      },
    }),
    defineField({
      name: "scheduleText",
      title: "Schedule Text",
      description: "Example: Every Saturday after Asr",
      type: "string",
    }),
    defineField({
      name: "cardImage",
      title: "Card Image",
      description: "Optional image for this program card.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Short accessibility description for the program image",
        }),
      ],
    }),
    defineField({
      name: "order",
      title: "Display Order",
      description: "Lower number appears first (0, 1, 2...).",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "isActive",
      title: "Visible on Website",
      description: "Turn off to hide this program.",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      scheduleText: "scheduleText",
      isActive: "isActive",
    },
    prepare: ({ title, scheduleText, isActive }) => ({
      title: title || "Untitled program",
      subtitle: `${scheduleText || "No schedule"} • ${isActive ? "Visible" : "Hidden"}`,
    }),
  },
});
