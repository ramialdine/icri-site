import type { StructureResolver } from "sanity/structure";

const groupedTypes = new Set(["prayerConfig", "dateOverride", "announcement", "event", "program"]);

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("🕌 ICRI Studio")
    .items([
      S.listItem()
        .title("1) 🕒 Iqama Times")
        .child(
          S.list()
            .title("🕒 Prayer Times")
            .items([
              S.listItem()
                .title("Main Prayer Settings")
                .child(S.document().schemaType("prayerConfig").documentId("prayerConfig").title("Main Prayer Settings")),
              S.divider(),
              S.listItem()
                .title("Special Date Overrides")
                .child(
                  S.documentTypeList("dateOverride")
                    .title("Special Date Overrides")
                    .defaultOrdering([{ field: "date", direction: "desc" }]),
                ),
            ]),
        ),

      S.listItem()
        .title("2) 🌐 Website Updates")
        .child(
          S.list()
            .title("🌐 Website Updates")
            .items([
              S.listItem()
                .title("📢 Announcements")
                .child(
                  S.documentTypeList("announcement")
                    .title("Announcements")
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("🗓️ Events")
                .child(
                  S.documentTypeList("event")
                    .title("Events")
                    .defaultOrdering([{ field: "startAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("📚 Programs")
                .child(
                  S.documentTypeList("program")
                    .title("Programs")
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
            ]),
        ),

      S.divider(),

      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId();
        return id ? !groupedTypes.has(id) : true;
      }),
    ]);
