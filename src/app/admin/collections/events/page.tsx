"use client";

import CollectionEditor, {
  type FieldDef,
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

export default function EventsCollection() {
  return (
    <CollectionEditor
      type="events"
      title="Events"
      description="Speaking engagements (upcoming & past) shown on Speaking & Consulting."
      singular="event"
      appearsOn={[{ label: "Speaking & Consulting", href: "/admin/pages/speaking" }]}
      fields={FIELDS}
      listTitleKey="name"
      listSubtitle={(e) => `${e.kind || ""}${e.location ? ` · ${e.location}` : ""}${e.date ? ` · ${e.date}` : ""}`}
      listIcon="events"
    />
  );
}
