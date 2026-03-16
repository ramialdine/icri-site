// Preview URL configuration for Sanity Studio
// Allows editors to see live previews of how content will look on the site

export const previewUrls = [
  {
    title: "Announcements Page",
    route: "/preview/announcements",
    types: ["announcement"],
  },
  {
    title: "Events Page",
    route: "/preview/events",
    types: ["event"],
  },
  {
    title: "Programs Page",
    route: "/preview/programs",
    types: ["program"],
  },
];

/**
 * Generate preview URLs for a document.
 * These are used in Studio to show side-by-side previews.
 */
export function getPreviewUrl(doc: {
  _type?: string;
  _id?: string;
  slug?: { current?: string };
}): string | undefined {
  switch (doc._type) {
    case "announcement":
      return `/preview/announcements?id=${doc._id}`;
    case "event":
      return `/preview/events?id=${doc._id}`;
    case "program":
      return `/preview/programs?id=${doc._id}`;
    default:
      return undefined;
  }
}
