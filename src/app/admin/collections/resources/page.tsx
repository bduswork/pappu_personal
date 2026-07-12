"use client";

import CollectionEditor, {
  type FieldDef,
} from "@/components/admin/CollectionEditor";

const FIELDS: FieldDef[] = [
  { key: "cover", label: "Cover (optional)", type: "image" },
  { key: "title", label: "Title", type: "text", full: true },
  { key: "format", label: "Format", type: "text", placeholder: "PDF, Sheet, Template…" },
  { key: "description", label: "Description", type: "textarea", full: true },
  { key: "file", label: "File / download URL", type: "url", full: true, placeholder: "https://…/file.pdf" },
  { key: "published", label: "Published", type: "checkbox" },
];

export default function ResourcesCollection() {
  return (
    <CollectionEditor
      type="resources"
      title="Resources"
      description="Free downloadables shown on the Free Resources page."
      singular="resource"
      appearsOn={[{ label: "Free Resources", href: "/admin/pages/resources" }]}
      fields={FIELDS}
      listTitleKey="title"
      listSubtitle={(r) => `${r.format || "Download"}`}
      listImageKey="cover"
      listIcon="resources"
    />
  );
}
