"use client";

import CollectionEditor, {
  type FieldDef,
} from "@/components/admin/CollectionEditor";
import { youtubeId } from "@/lib/siteSettings";

const FIELDS: FieldDef[] = [
  { key: "youtubeUrl", label: "YouTube URL", type: "url", full: true, placeholder: "https://youtube.com/watch?v=…" },
  { key: "title", label: "Title", type: "text", full: true },
  { key: "category", label: "Category", type: "text", placeholder: "Talk, Podcast…" },
  { key: "date", label: "Date", type: "date" },
  { key: "thumbnail", label: "Thumbnail (optional — auto from YouTube if blank)", type: "image", full: true },
  { key: "description", label: "Description", type: "textarea", full: true },
  { key: "published", label: "Published", type: "checkbox" },
];

export default function VideosCollection() {
  return (
    <CollectionEditor
      type="videos"
      title="Videos"
      description="YouTube videos shown on Podcast & Videos and Speaking (past talks)."
      singular="video"
      appearsOn={[
        { label: "Podcast & Videos", href: "/admin/pages/podcast" },
        { label: "Speaking", href: "/admin/pages/speaking" },
      ]}
      fields={FIELDS}
      listTitleKey="title"
      listSubtitle={(v) => `${v.category || "YouTube"}${v.date ? ` · ${v.date}` : ""}`}
      listImageKey="thumbnail"
      listImageFallback={(v) => {
        const id = youtubeId(String(v.youtubeUrl || ""));
        return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : "";
      }}
      listIcon="videos"
    />
  );
}
