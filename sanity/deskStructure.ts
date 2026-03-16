import type { StructureResolver } from "sanity/structure";
import { getPreviewUrl } from "./previewUrls";
import { PreviewPane } from "./components/PreviewPane";

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
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }])
                    .child((documentId) =>
                      S.document()
                        .documentId(documentId)
                        .schemaType("announcement")
                        .views([
                          S.view.form().title("Edit"),
                          S.view
                            .component(PreviewPane)
                            .title("Preview")
                            .options({
                              url: getPreviewUrl({ _type: "announcement", _id: documentId }),
                            }),
                        ]),
                    ),
                ),
              S.listItem()
                .title("🗓️ Events")
                .child(
                  S.documentTypeList("event")
                    .title("Events")
                    .defaultOrdering([{ field: "startAt", direction: "desc" }])
                    .child((documentId) =>
                      S.document()
                        .documentId(documentId)
                        .schemaType("event")
                        .views([
                          S.view.form().title("Edit"),
                          S.view
                            .component(PreviewPane)
                            .title("Preview")
                            .options({
                              url: getPreviewUrl({ _type: "event", _id: documentId }),
                            }),
                        ]),
                    ),
                ),
              S.listItem()
                .title("📚 Programs")
                .child(
                  S.documentTypeList("program")
                    .title("Programs")
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }])
                    .child((documentId) =>
                      S.document()
                        .documentId(documentId)
                        .schemaType("program")
                        .views([
                          S.view.form().title("Edit"),
                          S.view
                            .component(PreviewPane)
                            .title("Preview")
                            .options({
                              url: getPreviewUrl({ _type: "program", _id: documentId }),
                            }),
                        ]),
                    ),
                ),
            ]),
        ),

      S.divider(),

      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId();
        return id ? !groupedTypes.has(id) : true;
      }),
    ]);
