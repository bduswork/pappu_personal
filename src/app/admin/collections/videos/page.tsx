"use client";

import CollectionEditor, {
  type FieldDef,
  type Item,
} from "@/components/admin/CollectionEditor";

const FIELDS: FieldDef[] = [
  { key: "youtubeUrl", label: "YouTube URL", type: "url", full: true, placeholder: "https://youtube.com/watch?v=…" },
  { key: "title", label: "Title", type: "text", full: true },
  { key: "category", label: "Category", type: "text", placeholder: "Talk, Podcast…" },
  { key: "date", label: "Date", type: "date" },
  { key: "thumbnail", label: "Thumbnail (optional — auto from YouTube if blank)", type: "image", full: true },
  { key: "description", label: "Description", type: "textarea", full: true },
  { key: "published", label: "Published", type: "checkbox" },
];

const INITIAL: Item[] = [
  { id: "v1", youtubeUrl: "", title: "How I Build Software Products", category: "Talk", date: "2026-04-10", thumbnail: "", description: "", published: true },
  { id: "v2", youtubeUrl: "", title: "One-Focus Masterclass — Episode 1", category: "Training", date: "2026-03-02", thumbnail: "", description: "", published: true },
];

export default function VideosCollection() {
  return (
    <CollectionEditor
      title="Videos"
      description="YouTube videos shown on Podcast & Videos and Speaking (past talks)."
      singular="video"
      appearsOn={[
        { label: "Podcast & Videos", href: "/admin/pages/podcast" },
        { label: "Speaking", href: "/admin/pages/speaking" },
      ]}
      fields={FIELDS}
      initial={INITIAL}
      listTitleKey="title"
      listSubtitle={(v) => `${v.category || "YouTube"}${v.date ? ` · ${v.date}` : ""}`}
      listImageKey="thumbnail"
      listIcon="videos"
    />
  );
}
