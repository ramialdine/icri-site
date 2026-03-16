import { sanityClient } from "@/sanity/lib/client";
import { Card } from "@/components/ui/card";
import { BookOpen, Users, Calendar } from "lucide-react";

export const runtime = "nodejs";
export const revalidate = 0;

interface PreviewProgramDoc {
  _id: string;
  title: string;
  description: string;
  iconKey?: string;
  scheduleText?: string;
  isActive?: boolean;
  cardImage?: {
    alt?: string;
    url?: string;
  };
}

interface ProgramPreviewProps {
  searchParams: Promise<{ id?: string }>;
}

function getIconComponent(iconKey?: string) {
  switch (iconKey) {
    case "users":
      return <Users className="h-12 w-12 text-blue-600" />;
    case "calendar":
      return <Calendar className="h-12 w-12 text-blue-600" />;
    case "book":
    default:
      return <BookOpen className="h-12 w-12 text-blue-600" />;
  }
}

export default async function ProgramPreview({
  searchParams,
}: ProgramPreviewProps) {
  const { id } = await searchParams;

  if (!id) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md">
          <div className="p-6 text-center">
            <p className="text-slate-600">No program ID provided</p>
            <p className="text-sm text-slate-500 mt-2">
              Open this from Sanity Studio preview pane
            </p>
          </div>
        </Card>
      </div>
    );
  }

  try {
    const program: PreviewProgramDoc | null = await sanityClient?.fetch(
      `*[_id == $id && _type == "program"][0]{
        _id,
        title,
        description,
        iconKey,
        scheduleText,
        isActive,
        cardImage {
          alt,
          "url": asset->url
        }
      }`,
      { id }
    ) || null;

    if (!program) {
      return (
        <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
          <Card className="max-w-md">
            <div className="p-6 text-center">
              <p className="text-slate-600">Program not found</p>
              <p className="text-sm text-slate-500 mt-2">ID: {id}</p>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
        <div className="max-w-2xl w-full">
          <Card className="overflow-hidden">
            {program.cardImage?.url ? (
              <div className="relative w-full aspect-video">
                <img
                  src={program.cardImage.url}
                  alt={program.cardImage.alt || program.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-video bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                {getIconComponent(program.iconKey)}
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold text-slate-900 flex-1">
                  {program.title}
                </h2>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                    program.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {program.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {program.description && (
                <div className="prose prose-sm max-w-none mb-4">
                  <p className="text-slate-600">{program.description}</p>
                </div>
              )}

              {program.scheduleText && (
                <div className="py-4 border-t">
                  <h3 className="font-semibold text-sm text-slate-900 mb-2">
                    Schedule
                  </h3>
                  <p className="text-sm text-slate-600">{program.scheduleText}</p>
                </div>
              )}
            </div>
          </Card>

          <div className="mt-6 p-4 bg-white rounded-lg border text-xs text-slate-600">
            <p className="font-semibold mb-2">Preview Info:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Status: {program.isActive ? "✓ Active on website" : "✗ Inactive (hidden)"}
              </li>
              <li>Icon Type: {program.iconKey || "book"}</li>
              {program.scheduleText && (
                <li>Has Schedule: Yes</li>
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
