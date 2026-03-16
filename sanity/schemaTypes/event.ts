import { defineField, defineType } from "sanity";

export const eventType = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "summary", title: "Summary", type: "text" }),
    defineField({ name: "startAt", title: "Start", type: "datetime", validation: (rule) => rule.required() }),
    defineField({ name: "endAt", title: "End", type: "datetime" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "ctaUrl", title: "Call to Action URL", type: "url" }),
    defineField({ name: "isPublished", title: "Published", type: "boolean", initialValue: true }),
  ],
});
