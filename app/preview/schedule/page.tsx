import { Card } from "@/components/ui/card";
import { SCHEDULE_COLUMNS, type ScheduledDay } from "@/lib/prayer-schedule";
import { sanityPreviewClient } from "@/sanity/lib/client";
import { to12Hour } from "@/sanity/lib/prayer";

export const runtime = "nodejs";
export const revalidate = 0;

type PreviewScheduleDoc = {
  _id: string;
  isDraft?: boolean;
  month?: string;
  days?: (Partial<ScheduledDay> & { day?: number })[];
};

interface SchedulePreviewProps {
  searchParams: Promise<{ id?: string }>;
}

const COLUMN_LABELS: Record<keyof ScheduledDay, string> = {
  fajr18: "Fajr 18°",
  fajrNA: "Fajr NA",
  fajrIqama: "Iqama",
  sunrise: "Sunrise",
  dhuhr: "Dhuhr",
  dhuhrIqama: "Iqama",
  asrShafi: "Asr Shafi",
  asrHanafi: "Asr Hanafi",
  asrIqama: "Iqama",
  maghrib: "Maghrib",
  isha: "Isha",
  ishaIqama: "Iqama",
};

const IQAMAH_COLUMNS = new Set<keyof ScheduledDay>(["fajrIqama", "dhuhrIqama", "asrIqama", "ishaIqama"]);

function formatMonth(month?: string): string {
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return "Monthly timetable";
  }
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${month}-01T00:00:00Z`)
  );
}

function Message({ text, detail }: { text: string; detail?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md">
        <div className="p-6 text-center">
          <p className="text-slate-600">{text}</p>
          {detail && <p className="mt-2 text-sm text-slate-500">{detail}</p>}
        </div>
      </Card>
    </div>
  );
}

export default async function SchedulePreview({ searchParams }: SchedulePreviewProps) {
  const { id } = await searchParams;

  if (!id) {
    return <Message text="No timetable ID provided" detail="Open this from the WhatsApp approval message or Sanity Studio." />;
  }

  try {
    const publishedId = id.replace(/^drafts\./, "");
    const draftId = `drafts.${publishedId}`;

    const schedule = await sanityPreviewClient?.fetch<PreviewScheduleDoc | null>(
      `*[_type == "monthlySchedule" && _id in [$publishedId, $draftId]][0]{
        _id,
        "isDraft": _originalId in path("drafts.**"),
        month,
        days
      }`,
      { publishedId, draftId }
    );

    if (!schedule) {
      return <Message text="Timetable not found" detail={`ID: ${id}`} />;
    }

    const days = [...(schedule.days ?? [])].sort((a, b) => (a.day ?? 0) - (b.day ?? 0));

    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6">
        <div className="mx-auto max-w-5xl">
          {schedule.isDraft && (
            <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Unpublished draft. Compare every row with the printed flyer before approving. Nothing changes on the website until it is approved.
            </p>
          )}
          <Card className="overflow-hidden">
            <div className="p-4 sm:p-6">
              <h2 className="text-2xl font-bold text-slate-900">{formatMonth(schedule.month)} prayer timetable</h2>
              <p className="mt-1 text-sm text-slate-500">{days.length} days. Iqama columns are highlighted.</p>
            </div>
            <div className="overflow-x-auto border-t">
              <table className="w-full text-right text-xs tabular-nums sm:text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="sticky left-0 bg-slate-100 px-2 py-2 text-left font-semibold">Day</th>
                    {SCHEDULE_COLUMNS.map((column) => (
                      <th key={column} className="whitespace-nowrap px-2 py-2 font-semibold">
                        {COLUMN_LABELS[column]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map((row) => (
                    <tr key={row.day} className="border-t border-slate-100 even:bg-slate-50/60">
                      <td className="sticky left-0 bg-white px-2 py-1.5 text-left font-semibold text-slate-900">{row.day}</td>
                      {SCHEDULE_COLUMNS.map((column) => {
                        const value = row[column];
                        return (
                          <td
                            key={column}
                            className={`whitespace-nowrap px-2 py-1.5 ${IQAMAH_COLUMNS.has(column) ? "bg-emerald-50 font-semibold text-emerald-800" : "text-slate-700"}`}
                          >
                            {value && /^\d{2}:\d{2}$/.test(value) ? to12Hour(value) : "—"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Preview error:", error);
    return <Message text="Error loading preview" detail={error instanceof Error ? error.message : "Unknown error"} />;
  }
}
