"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Toggle } from "@/components/admin/ui";
import { withVenturesDefaults, type Venture, type Gallery } from "@/lib/ventures";

let seq = 0;
const uid = () => `g-${Date.now().toString(36)}-${seq++}`;

export default function VentureEditor() {
  const params = useParams();
  const routeSlug = String(params.slug ?? "");

  const [v, setV] = useState<Venture | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/ventures")
      .then((r) => r.json())
      .then((d) => setV(withVenturesDefaults(d).ventures.find((x) => x.slug === routeSlug) ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [routeSlug]);

  const set = <K extends keyof Venture>(key: K, value: Venture[K]) =>
    setV((cur) => (cur ? { ...cur, [key]: value } : cur));
  const setPhoto = (id: string, url: string) =>
    setV((cur) => (cur ? { ...cur, gallery: cur.gallery.map((g) => (g.id === id ? { ...g, url } : g)) } : cur));

  async function save() {
    if (!v) return;
    setSaving(true);
    setSaved(false);
    try {
      const current = await fetch("/api/ventures")
        .then((r) => r.json())
        .then((d) => withVenturesDefaults(d).ventures)
        .catch(() => [] as Venture[]);
      const idx = current.findIndex((x) => x.id === v.id);
      const next = idx >= 0 ? current.map((x) => (x.id === v.id ? v : x)) : [...current, v];
      const res = await fetch("/api/ventures", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ventures: next }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-ink-faint">Loading…</p>;
  if (!v) {
    return (
      <div>
        <Link href="/admin/ventures" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink">
          ← Back to Ventures
        </Link>
        <p className="rounded-lg border border-line bg-white p-6 text-ink-soft">
          Venture not found. It may have been renamed or deleted.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/ventures" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink">
        ← Back to Ventures
      </Link>

      <EditorHeader
        title={`Edit: ${v.name}`}
        description="Brand profile — hero, logo, about, gallery and a call-to-action."
        viewHref={`/ventures/${v.slug}`}
        onSave={save}
        saving={saving}
        saved={saved}
      />

      <BlockCard label="Hero">
        <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
          <ImageField value={v.hero} onChange={(x) => set("hero", x)} label="Hero image" boxClass="aspect-video w-full" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Brand name" value={v.name} onChange={(x) => set("name", x)} />
            <Field label="Tagline" value={v.tagline} onChange={(x) => set("tagline", x)} />
            <Field label="Website" value={v.website} onChange={(x) => set("website", x)} placeholder="https://…" />
            <Field label="URL slug" value={v.slug} onChange={(x) => set("slug", x)} placeholder="zariya-living" />
          </div>
        </div>
        <label className="mt-4 flex items-center gap-3 text-sm font-medium text-ink">
          <Toggle checked={v.published} onChange={() => set("published", !v.published)} label="Published" />
          {v.published ? "Published — live on the site & sidebar" : "Hidden from the site & sidebar"}
        </label>
      </BlockCard>

      <BlockCard label="Logo" tone="slate">
        <div className="max-w-[220px]">
          <ImageField value={v.logo} onChange={(x) => set("logo", x)} label="Logo" boxClass="aspect-video w-full" />
        </div>
      </BlockCard>

      <BlockCard label="About">
        <RichTextEditor initialHTML={v.about} onChange={(html) => set("about", html)} />
      </BlockCard>

      <BlockCard label="Gallery" hint="brand photos">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {v.gallery.map((g) => (
            <div key={g.id}>
              <ImageField value={g.url} onChange={(x) => setPhoto(g.id, x)} label="Photo" boxClass="aspect-square w-full" />
              <button
                type="button"
                onClick={() => set("gallery", v.gallery.filter((x) => x.id !== g.id))}
                className="mt-1 flex w-full items-center justify-center gap-1 rounded-md border border-line py-1 text-xs font-medium text-ink-faint hover:border-red-300 hover:text-red-500"
              >
                <AdminIcon name="trash" className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => set("gallery", [...v.gallery, { id: uid(), url: "" } as Gallery])}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
        >
          <AdminIcon name="plus" className="h-4 w-4" /> Add photo
        </button>
      </BlockCard>

      <BlockCard label="Call to action" tone="amber">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Button label" value={v.ctaLabel} onChange={(x) => set("ctaLabel", x)} />
          <Field label="Button link" value={v.ctaLink} onChange={(x) => set("ctaLink", x)} placeholder="https://… (defaults to Website)" />
        </div>
      </BlockCard>
    </div>
  );
}
