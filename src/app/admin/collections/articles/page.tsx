"use client";

import CollectionEditor, {
  type FieldDef,
  type Item,
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

const INITIAL: Item[] = [
  { id: "a1", cover: "", title: "The discipline of doing one thing well", categories: "Content, Focus", date: "2026-06-15", excerpt: "Why focus beats hustle — lessons from 18 years of building software and mentoring founders.", link: "", content: "<p>Full article content goes here…</p>", published: true },
  { id: "a2", cover: "", title: "Lessons from scaling Nexalinx", categories: "Business, SaaS", date: "2026-05-10", excerpt: "What building a healthcare & government SaaS taught me about architecture.", link: "", content: "", published: false },
];

export default function ArticlesCollection() {
  return (
    <CollectionEditor
      title="Articles"
      description="Blog posts shown on the Blog & Articles page."
      singular="article"
      appearsOn={[{ label: "Blog & Articles", href: "/admin/pages/blog" }]}
      fields={FIELDS}
      initial={INITIAL}
      listTitleKey="title"
      listSubtitle={(a) => `${a.categories || ""}${a.date ? ` · ${a.date}` : ""}`}
      listImageKey="cover"
      listIcon="articles"
    />
  );
}
