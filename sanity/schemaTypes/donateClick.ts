import { defineField, defineType } from "sanity";

// Written by the /go/<method> redirect (lib/donations/clicks.ts); read-only in Studio.
export const donateClickType = defineType({
  name: "donateClick",
  title: "Donation Button Clicks",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "method", title: "Method", type: "string", options: { list: ["mohid", "paypal"] } }),
    defineField({ name: "date", title: "Date (masjid time)", type: "string" }),
    defineField({ name: "count", title: "Clicks", type: "number" }),
  ],
  orderings: [{ title: "Newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: {
    select: { method: "method", date: "date", count: "count" },
    prepare: ({ method, date, count }) => ({
      title: `${method ?? "?"} • ${date ?? ""}`,
      subtitle: `${count ?? 0} clicks`,
    }),
  },
});
