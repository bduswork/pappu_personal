"use client";

import CollectionEditor, {
  type FieldDef,
} from "@/components/admin/CollectionEditor";

const FIELDS: FieldDef[] = [
  { key: "cover", label: "Cover image", type: "image" },
  { key: "title", label: "Title", type: "text", full: true },
  { key: "categories", label: "Categories (comma-separated)", type: "text", placeholder: "Content, Business…" },
  { key: "date", label: "Date", type: "date" },
  { key: "excerpt", label: "Excerpt", type: "textarea", full: true },
  { key: "link", label: "External link (optional)", type: "url", full: true, placeholder: "https://… (leave blank to use content below)" },
  { key: "content", label: "Full content (optional)", type: "richtext", full: true },
  { key: "published", label: "Published (visible on the site)", type: "checkbox" },
];

export default function ArticlesCollection() {
  return (
    <CollectionEditor
      type="articles"
      title="Articles"
      description="Blog posts shown on the Blog & Articles page."
      singular="article"
      appearsOn={[{ label: "Blog & Articles", href: "/admin/pages/blog" }]}
      fields={FIELDS}
      listTitleKey="title"
      listSubtitle={(a) => `${a.categories || ""}${a.date ? ` · ${a.date}` : ""}`}
      listImageKey="cover"
      listIcon="articles"
    />
  );
}
