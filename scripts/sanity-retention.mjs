import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-15";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing required env vars. Ensure NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_WRITE_TOKEN are set.",
  );
  process.exit(1);
}

const apply = process.argv.includes("--apply");

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: "raw",
});

function monthsAgo(months) {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d.toISOString();
}

function yearsAgo(years) {
  return monthsAgo(years * 12);
}

async function run() {
  const hideEventsBefore = monthsAgo(4);
  const deleteEventsBefore = yearsAgo(2);
  const deleteAnnouncementsBefore = yearsAgo(1);

  const staleVisibleEventIds = await client.fetch(
    `*[
      _type == "event" &&
      !(_id in path("drafts.**")) &&
      coalesce(isPublished, true) == true &&
      coalesce(endAt, startAt, _createdAt) < $hideEventsBefore
    ]._id`,
    { hideEventsBefore },
  );

  const oldEventIds = await client.fetch(
    `*[
      _type == "event" &&
      !(_id in path("drafts.**")) &&
      coalesce(endAt, startAt, _createdAt) < $deleteEventsBefore
    ]._id`,
    { deleteEventsBefore },
  );

  const oldAnnouncementIds = await client.fetch(
    `*[
      _type == "announcement" &&
      !(_id in path("drafts.**")) &&
      coalesce(endAt, announcementDate, _createdAt) < $deleteAnnouncementsBefore
    ]._id`,
    { deleteAnnouncementsBefore },
  );

  console.log("\nSanity content retention report");
  console.log("- Events to hide (older than 4 months):", staleVisibleEventIds.length);
  console.log("- Events to delete (older than 2 years):", oldEventIds.length);
  console.log("- Announcements to delete (older than 1 year):", oldAnnouncementIds.length);

  if (!apply) {
    console.log("\nDry run only. Re-run with --apply to perform mutations.");
    return;
  }

  for (const id of staleVisibleEventIds) {
    await client.patch(id).set({ isPublished: false }).commit();

    const draftId = `drafts.${id}`;
    const draftExists = await client.fetch(`count(*[_id == $id]) > 0`, { id: draftId });
    if (draftExists) {
      await client.patch(draftId).set({ isPublished: false }).commit();
    }
  }

  const deleteIds = [
    ...new Set([
      ...oldEventIds,
      ...oldEventIds.map((id) => `drafts.${id}`),
      ...oldAnnouncementIds,
      ...oldAnnouncementIds.map((id) => `drafts.${id}`),
    ]),
  ];

  if (deleteIds.length > 0) {
    let tx = client.transaction();
    for (const id of deleteIds) {
      tx = tx.delete(id);
    }
    await tx.commit();
  }

  console.log("\nRetention mutations complete.");
}

run().catch((error) => {
  console.error("Retention job failed:", error);
  process.exit(1);
});
