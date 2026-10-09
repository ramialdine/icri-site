import { defineField, defineType } from "sanity";

// Written by the WhatsApp update bot (lib/whatsapp/handle.ts); read-only in Studio.
export const botLogType = defineType({
  name: "botLog",
  title: "WhatsApp Bot Activity",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "messageId", title: "WhatsApp Message ID", type: "string" }),
    defineField({ name: "sender", title: "Sender", type: "string" }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: { list: ["monthly_schedule", "event", "announcement", "decision", "none"] },
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["received", "drafted", "approved", "rejected", "ignored", "failed"] },
    }),
    defineField({ name: "draftId", title: "Draft Document ID", type: "string" }),
    defineField({ name: "note", title: "Note", type: "text" }),
    defineField({ name: "receivedAt", title: "Received At", type: "datetime" }),
  ],
  orderings: [{ title: "Newest first", name: "receivedDesc", by: [{ field: "receivedAt", direction: "desc" }] }],
  preview: {
    select: { kind: "kind", status: "status", sender: "sender", note: "note" },
    prepare: ({ kind, status, sender, note }) => ({
      title: `${status ?? "received"} • ${kind ?? "message"}`,
      subtitle: [sender, note].filter(Boolean).join(" — "),
    }),
  },
});
