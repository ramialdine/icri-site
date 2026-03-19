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
      title: "Show From (Scheduling)",
      description: "Optional. Start date/time for website visibility. Not shown publicly.",
      type: "datetime",
      validation: (rule) =>
        rule.custom((startAt, context) => {
          if (!startAt) {
            return true;
          }

          const endAt = (context.document as { endAt?: string } | undefined)?.endAt;
          if (!endAt) {
            return true;
          }

          return new Date(startAt).getTime() <= new Date(endAt).getTime()
            ? true
            : "Show From must be before or equal to Show Until.";
        }),
    }),
    defineField({
      name: "endAt",
      title: "Show Until (Scheduling)",
      description: "Optional. End date/time for website visibility. Not shown publicly.",
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
            : "Show Until must be after or equal to Show From.";
        }),
    }),
    defineField({
      name: "announcementDate",
      title: "Announcement Date (Optional)",
      description: "Optional date reference for editors. This is not shown on the website by default.",
      type: "date",
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
