"use client";

import { useEffect, useState } from "react";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import CollectionBlock from "@/components/admin/CollectionBlock";
import { usePageStatus } from "@/components/admin/usePageStatus";
import { DEFAULT_BLOG, withBlogDefaults } from "@/lib/pages/collectionPages";

export default function BlogEditor() {
  const [featured, setFeatured] = useState(DEFAULT_BLOG.featured);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const ps = usePageStatus("/blog");

  useEffect(() => {
    fetch("/api/pages/blog")
      .then((r) => r.json())
      .then((d) => setFeatured(withBlogDefaults(d).featured))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (k: keyof typeof featured, v: string) =>
    setFeatured((f) => ({ ...f, [k]: v }));

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/pages/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <EditorHeader
        title="Edit: Blog & Articles"
        description="A featured-article hero, then the article grid — cards come from Collections → Articles."
        viewHref="/blog"
        onSave={save}
        saving={saving}
        saved={saved}
        status={ps.status}
        onStatusChange={ps.change}
      />

      {loading ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : (
        <>
          <BlockCard label="Featured article" tone="green" hint="the big hero at the top (leave title blank to hide)">
            <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
              <ImageField value={featured.image} onChange={(v) => set("image", v)} label="Featured image" boxClass="aspect-video w-full" />
              <div className="space-y-4">
                <Field label="Eyebrow / category" value={featured.eyebrow} onChange={(v) => set("eyebrow", v)} placeholder="By … · in Content" />
                <Field label="Title" value={featured.title} onChange={(v) => set("title", v)} />
                <Field label="Excerpt" textarea value={featured.excerpt} onChange={(v) => set("excerpt", v)} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Button label" value={featured.buttonLabel} onChange={(v) => set("buttonLabel", v)} />
                  <Field label="Button link" value={featured.buttonLink} onChange={(v) => set("buttonLink", v)} placeholder="https://… or /blog/slug" />
                </div>
              </div>
            </div>
          </BlockCard>

          <CollectionBlock
            label="Article grid"
            collection="Articles"
            href="/admin/collections/articles"
            defaultHeading="Latest Articles"
            defaultLimit={9}
            note="Each card shows its cover image, category tags, title and excerpt — set per-article in Collections → Articles."
          />
        </>
      )}
    </div>
  );
}
