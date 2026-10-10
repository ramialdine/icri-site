import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-15";
const writeToken = process.env.SANITY_API_WRITE_TOKEN;

// Server-side only: used by the WhatsApp update bot to create, publish and
// discard drafts. "raw" perspective so drafts are addressed by their own IDs.
export const sanityWriteClient =
  projectId && dataset && writeToken
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        token: writeToken,
        useCdn: false,
        perspective: "raw",
      })
    : null;
