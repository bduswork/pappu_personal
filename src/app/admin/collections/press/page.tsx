"use client";

import CollectionEditor, {
  type FieldDef,
} from "@/components/admin/CollectionEditor";

const FIELDS: FieldDef[] = [
  { key: "cover", label: "Cover image", type: "image" },
  { key: "title", label: "Title", type: "text", full: true },
  { key: "outlet", label: "Outlet / source", type: "text", placeholder: "Bloomberg, NRF, Inc…" },
  { key: "date", label: "Date", type: "date" },
  { key: "link", label: "Article link", type: "url", full: true, placeholder: "https://…" },
  { key: "excerpt", label: "Excerpt (optional)", type: "textarea", full: true },
  { key: "published", label: "Published", type: "checkbox" },
];

export default function PressCollection() {
  return (
    <CollectionEditor
      type="press"
      title="Press"
      description="Media features shown on Press Kit and the Home page."
      singular="press item"
      appearsOn={[
        { label: "Press Kit", href: "/admin/pages/press-kit" },
        { label: "Home", href: "/admin/pages" },
      ]}
      fields={FIELDS}
      listTitleKey="title"
      listSubtitle={(p) => `${p.outlet || "PRESS"}${p.date ? ` · ${p.date}` : ""}`}
      listImageKey="cover"
      listIcon="press"
    />
  );
}
