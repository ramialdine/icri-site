import { defineField, defineType } from "sanity";

/**
 * Custom preview pane component for Sanity Studio.
 * Shows live previews of how content looks on the website.
 */
export function PreviewPane(props: {
  document: {
    displayed: unknown;
  };
  options?: {
    url?: string;
  };
}) {
  const url = props.options?.url;

  if (!url) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#999" }}>
        <p>No preview available for this document type.</p>
      </div>
    );
  }

  return (
    <iframe
      src={url}
      style={{
        width: "100%",
        height: "100%",
        border: "none",
        borderRadius: "8px",
      }}
      title="Page Preview"
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
    />
  );
}
