import { sanityClient } from "@/sanity/lib/client";
import { Card } from "@/components/ui/card";
import { Clock3, Megaphone, Pin } from "lucide-react";
import { formatAnnouncementWindow } from "@/sanity/lib/content";

export const runtime = "nodejs";
export const revalidate = 0; // Disable caching for live previews

interface PreviewAnnouncementDoc {
  _id: string;
  title: string;
  message: string;
  isPinned?: boolean;
  isActive?: boolean;
  startAt?: string;
  endAt?: string;
}

interface AnnouncementPreviewProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function AnnouncementPreview({
  searchParams,
}: AnnouncementPreviewProps) {
  const { id } = await searchParams;

  if (!id) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md">
          <div className="p-6 text-center">
            <p className="text-slate-600">No announcement ID provided</p>
            <p className="text-sm text-slate-500 mt-2">
              Open this from Sanity Studio preview pane
            </p>
          </div>
        </Card>
      </div>
    );
  }

  try {
    const announcement: PreviewAnnouncementDoc | null = await sanityClient?.fetch(
      `*[_id == $id && _type == "announcement"][0]{
        _id,
        title,
        message,
        isPinned,
        isActive,
        startAt,
        endAt
      }`,
      { id }
    ) || null;

    if (!announcement) {
      return (
        <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
          <Card className="max-w-md">
            <div className="p-6 text-center">
              <p className="text-slate-600">Announcement not found</p>
              <p className="text-sm text-slate-500 mt-2">ID: {id}</p>
            </div>
          </Card>
        </div>
      );
    }

    const now = new Date();
    const startAt = announcement.startAt ? new Date(announcement.startAt) : null;
    const endAt = announcement.endAt ? new Date(announcement.endAt) : null;

    const isWithinWindow =
      (!startAt || now >= startAt) && (!endAt || now <= endAt);
    const isVisible = announcement.isActive && isWithinWindow;

    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
        <div className="max-w-2xl w-full">
          <Card className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <Megaphone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-slate-900">
                    {announcement.title}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {announcement.isPinned && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                      <Pin className="h-3 w-3" />
                      Pinned
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                      isVisible
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {isVisible ? "Visible" : "Hidden"}
                  </span>
                </div>
              </div>

              {announcement.message && (
                <div className="prose prose-sm max-w-none mb-4">
                  <p className="text-slate-600 whitespace-pre-wrap">
                    {announcement.message}
                  </p>
                </div>
              )}

              {(startAt || endAt) && (
                <div className="flex items-center gap-2 pt-4 border-t text-sm text-slate-500">
                  <Clock3 className="h-4 w-4" />
                  <span>{formatAnnouncementWindow(announcement.startAt, announcement.endAt)}</span>
                </div>
              )}
            </div>
          </Card>

          <div className="mt-6 p-4 bg-white rounded-lg border text-xs text-slate-600">
            <p className="font-semibold mb-2">Preview Info:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Status: {isVisible ? "✓ Visible on website" : "✗ Hidden from website"}
              </li>
              <li>Active: {announcement.isActive ? "Yes" : "No"}</li>
              {startAt && (
                <li>Show From: {startAt.toLocaleString()}</li>
              )}
              {endAt && (
                <li>Show Until: {endAt.toLocaleString()}</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Preview error:", error);
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md">
          <div className="p-6 text-center">
            <p className="text-red-600">Error loading preview</p>
            <p className="text-sm text-slate-500 mt-2">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        </Card>
      </div>
    );
  }
}
