import { defineField, defineType } from "sanity";

export const announcementType = defineType({
  name: "announcement",
  title: "Announcement",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Headline",
      description: "Short title shown on the website.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "message",
      title: "Announcement Text",
      description: "Main message people will read.",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "startAt",
      title: "Show From",
      description: "Optional. Date/time to start showing this announcement.",
      type: "datetime",
    }),
    defineField({
      name: "endAt",
      title: "Show Until",
      description: "Optional. Date/time to stop showing this announcement.",
      type: "datetime",
    }),
    defineField({
      name: "isPinned",
      title: "Pin to Top",
      description: "Turn on to keep this announcement at the top.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isActive",
      title: "Visible on Website",
      description: "Turn off to hide this announcement.",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      isPinned: "isPinned",
      isActive: "isActive",
    },
    prepare: ({ title, isPinned, isActive }) => ({
      title: title || "Untitled announcement",
      subtitle: `${isPinned ? "Pinned" : "Regular"} • ${isActive ? "Visible" : "Hidden"}`,
    }),
  },
});
