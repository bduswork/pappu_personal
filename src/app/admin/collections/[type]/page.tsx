import { notFound } from "next/navigation";
import AdminIcon from "@/components/admin/AdminIcon";
import { Card, PageHeader, StatusPill, btnPrimary } from "@/components/admin/ui";

type Item = { title: string; meta: string; active: boolean };
type Collection = {
  label: string;
  description: string;
  /** Public pages that display this collection (shown as a hint). */
  appearsOn: string[];
  items: Item[];
};

// Mock data per collection — replaced by DB reads when each is wired up.
const COLLECTIONS: Record<string, Collection> = {
  press: {
    label: "Press",
    description: "Articles and media features.",
    appearsOn: ["Press Kit", "Home"],
    items: [
      { title: "ABM Whaiduzzaman on the Future of Bangladeshi SaaS", meta: "PRESS · Jun 2026", active: true },
      { title: "Building Nexalinx: A Founder's Playbook", meta: "PRESS · May 2026", active: true },
      { title: "Why I Train Entrepreneurs With One-Focus", meta: "PRESS · Apr 2026", active: false },
    ],
  },
  events: {
    label: "Events",
    description: "Speaking engagements — upcoming and past.",
    appearsOn: ["Speaking & Consulting"],
    items: [
      { title: "SaaS Summit Dhaka", meta: "Upcoming · Dhaka · 06.08.26", active: true },
      { title: "Founder Bootcamp", meta: "Upcoming · Chittagong · 09.14.26", active: true },
      { title: "ICT Expo Keynote", meta: "Past · Dhaka", active: true },
    ],
  },
  videos: {
    label: "Videos",
    description: "YouTube videos for the Podcast & Videos page.",
    appearsOn: ["Podcast & Videos"],
    items: [
      { title: "How I Build Software Products", meta: "YouTube · Build", active: true },
      { title: "One-Focus Masterclass — Episode 1", meta: "YouTube · Training", active: true },
    ],
  },
  articles: {
    label: "Articles",
    description: "Blog posts shown on the Blog & Articles page.",
    appearsOn: ["Blog & Articles"],
    items: [
      { title: "The discipline of doing one thing well", meta: "BLOG · Jun 2026", active: true },
      { title: "Lessons from scaling Nexalinx", meta: "BLOG · May 2026", active: false },
    ],
  },
  resources: {
    label: "Resources",
    description: "Free downloadables shown on the Free Resources page.",
    appearsOn: ["Free Resources"],
    items: [
      { title: "Founder's One-Page Business Plan (PDF)", meta: "Download · PDF", active: true },
      { title: "Weekly Focus Tracker (Sheet)", meta: "Download · Sheet", active: true },
    ],
  },
};

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const collection = COLLECTIONS[type];
  if (!collection) notFound();

  return (
    <div>
      <PageHeader
        title={collection.label}
        description={collection.description}
        action={
          <button type="button" className={btnPrimary}>
            <AdminIcon name="plus" className="h-4 w-4" />
            New {collection.label.replace(/s$/, "").toLowerCase()}
          </button>
        }
      />

      {/* Where this collection shows up on the public site */}
      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
        <AdminIcon name="external" className="h-4 w-4 text-ink-faint" />
        <span>Appears on:</span>
        {collection.appearsOn.map((page) => (
          <span
            key={page}
            className="rounded-full bg-brand-blue-tint px-2.5 py-0.5 text-xs font-semibold text-brand-blue-dark"
          >
            {page}
          </span>
        ))}
      </div>

      <Card>
        <ul className="divide-y divide-line">
          {collection.items.map((item, i) => (
            <li key={i} className="flex items-center gap-4 px-4 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-ink-faint">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{item.title}</p>
                <p className="truncate text-xs uppercase tracking-wide text-ink-faint">
                  {item.meta}
                </p>
              </div>
              <StatusPill variant={item.active ? "active" : "inactive"}>
                {item.active ? "Live" : "Hidden"}
              </StatusPill>
              <div className="flex shrink-0 items-center gap-1 text-ink-faint">
                <button
                  type="button"
                  className="rounded-md p-1.5 hover:bg-slate-100 hover:text-ink"
                  aria-label="Edit"
                >
                  <AdminIcon name="edit" className="h-[18px] w-[18px]" />
                </button>
                <button
                  type="button"
                  className="rounded-md p-1.5 hover:bg-red-50 hover:text-red-500"
                  aria-label="Delete"
                >
                  <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
