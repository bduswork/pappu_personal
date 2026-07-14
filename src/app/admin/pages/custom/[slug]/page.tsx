"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { usePageStatus } from "@/components/admin/usePageStatus";
import { withCustomPagesDefaults, type CustomPage } from "@/lib/customPages";

export default function CustomPageEditor() {
  const slug = String(useParams().slug || "");
  const [page, setPage] = useState<CustomPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const ps = usePageStatus(`/${slug}`);

  useEffect(() => {
    fetch("/api/custom-pages")
      .then((r) => r.json())
      .then((d) => {
        const found = withCustomPagesDefaults(d).pages.find((p) => p.slug === slug);
        if (found) setPage(found);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const set = <K extends keyof CustomPage>(k: K, v: CustomPage[K]) =>
    setPage((p) => (p ? { ...p, [k]: v } : p));
  const setBanner = (k: "image" | "headline", v: string) =>
    setPage((p) => (p ? { ...p, banner: { ...p.banner, [k]: v } } : p));

  async function save() {
    if (!page) return;
    setSaving(true);
    setSaved(false);
    try {
      // Read-modify-write: replace this page by id in the latest array.
      const latest = withCustomPagesDefaults(
        await fetch("/api/custom-pages").then((r) => r.json())
      ).pages;
      const next = latest.map((p) => (p.id === page.id ? page : p));
      const res = await fetch("/api/custom-pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages: next }),
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
  if (notFound || !page)
    return (
      <div>
        <EditorHeader title="Page not found" description="This custom page no longer exists." viewHref="/" />
      </div>
    );

  return (
    <div>
      <EditorHeader
        title={`Edit: ${page.label}`}
        description={`Custom page at /${slug} — shown in the ${page.section === "ventures" ? "Ventures" : "ABM Whaiduzzaman"} section when published.`}
        viewHref={`/${slug}`}
        onSave={save}
        saving={saving}
        saved={saved}
        status={ps.status}
        onStatusChange={ps.change}
      />

      <BlockCard label="Page">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Menu / page title" value={page.label} onChange={(v) => set("label", v)} />
          <Field label="URL (fixed)" value={`/${slug}`} onChange={() => {}} />
        </div>
      </BlockCard>

      <BlockCard label="Banner">
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <ImageField
            value={page.banner.image}
            onChange={(v) => setBanner("image", v)}
            label="Banner image"
            boxClass="aspect-video w-full"
          />
          <Field
            label="Headline"
            value={page.banner.headline}
            onChange={(v) => setBanner("headline", v)}
            placeholder="Defaults to the page title if left empty"
          />
        </div>
      </BlockCard>

      <BlockCard label="Content" hint="the body of the page">
        <RichTextEditor initialHTML={page.body} onChange={(v) => set("body", v)} />
      </BlockCard>
    </div>
  );
}
