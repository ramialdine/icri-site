import { defineField, defineType } from "sanity";

export const announcementType = defineType({
  name: "announcement",
  title: "Announcement",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "message", title: "Message", type: "text", validation: (rule) => rule.required() }),
    defineField({ name: "startAt", title: "Start", type: "datetime" }),
    defineField({ name: "endAt", title: "End", type: "datetime" }),
    defineField({ name: "isPinned", title: "Pinned", type: "boolean", initialValue: false }),
    defineField({ name: "isActive", title: "Active", type: "boolean", initialValue: true }),
  ],
});
