"use client";

import CollectionEditor, {
  type FieldDef,
  type Item,
} from "@/components/admin/CollectionEditor";

const FIELDS: FieldDef[] = [
  { key: "cover", label: "Cover (optional)", type: "image" },
  { key: "title", label: "Title", type: "text", full: true },
  { key: "format", label: "Format", type: "text", placeholder: "PDF, Sheet, Template…" },
  { key: "description", label: "Description", type: "textarea", full: true },
  { key: "file", label: "File / download URL", type: "url", full: true, placeholder: "https://… (upload activates with Firebase)" },
  { key: "published", label: "Published", type: "checkbox" },
];

const INITIAL: Item[] = [
  { id: "r1", cover: "", title: "Founder's One-Page Business Plan", format: "PDF", description: "A single-page template to pressure-test any business idea.", file: "", published: true },
  { id: "r2", cover: "", title: "Weekly Focus Tracker", format: "Sheet", description: "Plan the one thing that matters each week.", file: "", published: true },
];

export default function ResourcesCollection() {
  return (
    <CollectionEditor
      title="Resources"
      description="Free downloadables shown on the Free Resources page."
      singular="resource"
      appearsOn={[{ label: "Free Resources", href: "/admin/pages/resources" }]}
      fields={FIELDS}
      initial={INITIAL}
      listTitleKey="title"
      listSubtitle={(r) => `${r.format || "Download"}`}
      listImageKey="cover"
      listIcon="resources"
    />
  );
}
