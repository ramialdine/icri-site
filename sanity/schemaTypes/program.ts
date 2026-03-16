import { defineField, defineType } from "sanity";

export const programType = defineType({
  name: "program",
  title: "Program",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", validation: (rule) => rule.required() }),
    defineField({
      name: "iconKey",
      title: "Icon",
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
    defineField({ name: "scheduleText", title: "Schedule", type: "string" }),
    defineField({ name: "order", title: "Sort Order", type: "number", initialValue: 0 }),
    defineField({ name: "isActive", title: "Active", type: "boolean", initialValue: true }),
  ],
});
