import { sanityClient } from "@/sanity/lib/client";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";

export const runtime = "nodejs";
export const revalidate = 0;

interface PreviewEventDoc {
  _id: string;
  title: string;
  summary?: string;
  startAt: string;
  endAt?: string;
  location?: string;
  ctaUrl?: string;
  isPublished?: boolean;
  flyerImage?: {
    alt?: string;
    url?: string;
  };
}

interface EventPreviewProps {
  searchParams: Promise<{ id?: string }>;
}

function formatEventDateTime(startAt: string, endAt?: string): { date: string; time: string } {
  const start = new Date(startAt);

  if (Number.isNaN(start.getTime())) {
    return { date: "Date TBA", time: "Time TBA" };
  }

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });

  const date = dateFormatter.format(start);
  const startTime = timeFormatter.format(start);

  if (!endAt) {
    return {
      date,
      time: `${startTime} ET`,
    };
  }

  const end = new Date(endAt);
  if (Number.isNaN(end.getTime())) {
    return {
      date,
      time: `${startTime} ET`,
    };
  }

  const endTime = timeFormatter.format(end);
  const endDate = dateFormatter.format(end);

  if (date === endDate) {
    return {
      date,
      time: `${startTime} – ${endTime} ET`,
    };
  }

  return {
    date: `${date} → ${endDate}`,
    time: `${startTime} – ${endTime} ET`,
  };
}

export default async function EventPreview({ searchParams }: EventPreviewProps) {
  const { id } = await searchParams;

  if (!id) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md">
          <div className="p-6 text-center">
            <p className="text-slate-600">No event ID provided</p>
            <p className="text-sm text-slate-500 mt-2">
              Open this from Sanity Studio preview pane
            </p>
          </div>
        </Card>
      </div>
    );
  }

  try {
    const event: PreviewEventDoc | null = await sanityClient?.fetch(
      `*[_id == $id && _type == "event"][0]{
        _id,
        title,
        summary,
        startAt,
        endAt,
        location,
        ctaUrl,
        isPublished,
        flyerImage {
          alt,
          "url": asset->url
        }
      }`,
      { id }
    ) || null;

    if (!event) {
      return (
        <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
          <Card className="max-w-md">
            <div className="p-6 text-center">
              <p className="text-slate-600">Event not found</p>
              <p className="text-sm text-slate-500 mt-2">ID: {id}</p>
            </div>
          </Card>
        </div>
      );
    }

    const { date, time } = formatEventDateTime(event.startAt, event.endAt);

    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
        <div className="max-w-2xl w-full">
          <Card className="overflow-hidden">
            {event.flyerImage?.url && (
              <div className="relative w-full aspect-video">
                <img
                  src={event.flyerImage.url}
                  alt={event.flyerImage.alt || event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold text-slate-900 flex-1">
                  {event.title}
                </h2>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                    event.isPublished
                      ? "bg-green-100 text-green-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {event.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{date}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{time}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                )}
              </div>

              {event.summary && (
                <div className="prose prose-sm max-w-none mb-4 py-4 border-t">
                  <p className="text-slate-600">{event.summary}</p>
                </div>
              )}

              {event.ctaUrl && (
                <a
                  href={event.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Learn More
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </Card>

          <div className="mt-6 p-4 bg-white rounded-lg border text-xs text-slate-600">
            <p className="font-semibold mb-2">Preview Info:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Status: {event.isPublished ? "✓ Published on website" : "✗ Draft (not visible)"}
              </li>
              <li>Date: {date}</li>
              <li>Time: {time}</li>
              {event.location && <li>Location: {event.location}</li>}
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
