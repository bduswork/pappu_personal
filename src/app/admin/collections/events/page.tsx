"use client";

import CollectionEditor, {
  type FieldDef,
  type Item,
} from "@/components/admin/CollectionEditor";

const FIELDS: FieldDef[] = [
  { key: "name", label: "Event name", type: "text", full: true },
  { key: "date", label: "Date", type: "date" },
  { key: "location", label: "Location", type: "text", placeholder: "Dhaka, Bangladesh" },
  { key: "kind", label: "Type", type: "select", options: ["Upcoming", "Past"] },
  { key: "link", label: "Info / register link", type: "url" },
  { key: "videoUrl", label: "Recording (YouTube — for past events)", type: "url" },
  { key: "published", label: "Published", type: "checkbox" },
];

const INITIAL: Item[] = [
  { id: "e1", name: "SaaS Summit Dhaka", date: "2026-06-08", location: "Dhaka", kind: "Upcoming", link: "", videoUrl: "", published: true },
  { id: "e2", name: "Founder Bootcamp", date: "2026-09-14", location: "Chittagong", kind: "Upcoming", link: "", videoUrl: "", published: true },
  { id: "e3", name: "ICT Expo Keynote", date: "2025-11-20", location: "Dhaka", kind: "Past", link: "", videoUrl: "", published: true },
];

export default function EventsCollection() {
  return (
    <CollectionEditor
      title="Events"
      description="Speaking engagements (upcoming & past) shown on Speaking & Consulting."
      singular="event"
      appearsOn={[{ label: "Speaking & Consulting", href: "/admin/pages/speaking" }]}
      fields={FIELDS}
      initial={INITIAL}
      listTitleKey="name"
      listSubtitle={(e) => `${e.kind || ""}${e.location ? ` · ${e.location}` : ""}${e.date ? ` · ${e.date}` : ""}`}
      listIcon="events"
    />
  );
}
