"use client";

import CollectionEditor, {
  type FieldDef,
  type Item,
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

const INITIAL: Item[] = [
  { id: "pr1", cover: "", title: "ABM Whaiduzzaman on the Future of Bangladeshi SaaS", outlet: "Tech Review", date: "2026-06-01", link: "", excerpt: "", published: true },
  { id: "pr2", cover: "", title: "Building Nexalinx: A Founder's Playbook", outlet: "Startup Daily", date: "2026-05-04", link: "", excerpt: "", published: true },
  { id: "pr3", cover: "", title: "Why I Train Entrepreneurs With One-Focus", outlet: "Founder Mag", date: "2026-04-12", link: "", excerpt: "", published: false },
];

export default function PressCollection() {
  return (
    <CollectionEditor
      title="Press"
      description="Media features shown on Press Kit and the Home page."
      singular="press item"
      appearsOn={[
        { label: "Press Kit", href: "/admin/pages/press-kit" },
        { label: "Home", href: "/admin/pages" },
      ]}
      fields={FIELDS}
      initial={INITIAL}
      listTitleKey="title"
      listSubtitle={(p) => `${p.outlet || "PRESS"}${p.date ? ` · ${p.date}` : ""}`}
      listImageKey="cover"
      listIcon="press"
    />
  );
}
