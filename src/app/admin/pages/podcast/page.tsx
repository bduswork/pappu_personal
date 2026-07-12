"use client";

import { useEffect, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import CollectionBlock from "@/components/admin/CollectionBlock";
import { usePageStatus } from "@/components/admin/usePageStatus";
import {
  DEFAULT_PODCAST,
  withPodcastDefaults,
  type Platform,
  type Testimonial,
} from "@/lib/pages/collectionPages";

let seq = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${seq++}`;

export default function PodcastEditor() {
  const [banner, setBanner] = useState(DEFAULT_PODCAST.banner);
  const [intro, setIntro] = useState(DEFAULT_PODCAST.intro);
  const [platforms, setPlatforms] = useState<Platform[]>(DEFAULT_PODCAST.platforms);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_PODCAST.testimonials);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const ps = usePageStatus("/podcast");

  useEffect(() => {
    fetch("/api/pages/podcast")
      .then((r) => r.json())
      .then((d) => {
        const c = withPodcastDefaults(d);
        setBanner(c.banner);
        setIntro(c.intro);
        setPlatforms(c.platforms);
        setTestimonials(c.testimonials);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setP = (id: string, f: "label" | "url", v: string) =>
    setPlatforms((ps2) => ps2.map((p) => (p.id === id ? { ...p, [f]: v } : p)));
  const setT = (id: string, f: "quote" | "name", v: string) =>
    setTestimonials((ts) => ts.map((t) => (t.id === id ? { ...t, [f]: v } : t)));

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/pages/podcast", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banner, intro, platforms, testimonials }),
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
        title="Edit: Podcast & Videos"
        description="Hero, listen-on links, video gallery (from Collections → Videos), and testimonials."
        viewHref="/podcast"
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
          {/* Hero */}
          <BlockCard label="Hero">
            <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
              <ImageField value={banner.image} onChange={(v) => setBanner((b) => ({ ...b, image: v }))} label="Hero image" boxClass="aspect-video w-full" />
              <div className="space-y-4">
                <Field label="Headline" value={banner.headline} onChange={(v) => setBanner((b) => ({ ...b, headline: v }))} />
                <div>
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Intro</span>
                  <RichTextEditor initialHTML={intro} onChange={setIntro} />
                </div>
              </div>
            </div>
          </BlockCard>

          {/* Listen on */}
          <BlockCard label="Listen on" tone="amber" hint="podcast platform links">
            <div className="space-y-2">
              {platforms.map((p) => (
                <div key={p.id} className="flex items-center gap-2">
                  <input value={p.label} onChange={(e) => setP(p.id, "label", e.target.value)} placeholder="Platform (e.g. Spotify)" className="w-44 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink outline-none focus:border-brand-green" />
                  <input value={p.url} onChange={(e) => setP(p.id, "url", e.target.value)} placeholder="https://…" className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green" />
                  <button type="button" onClick={() => setPlatforms((ps2) => ps2.filter((x) => x.id !== p.id))} className="rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500" aria-label="Remove platform">
                    <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setPlatforms((ps2) => [...ps2, { id: uid("pl"), label: "", url: "" }])} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark">
              <AdminIcon name="plus" className="h-4 w-4" /> Add platform
            </button>
          </BlockCard>

          {/* Videos → Videos collection */}
          <CollectionBlock
            label="Videos"
            collection="Videos"
            href="/admin/collections/videos"
            defaultHeading="Videos"
            defaultLimit={6}
          />

          {/* Testimonials */}
          <BlockCard label="Testimonials" hint="listener quotes">
            <div className="space-y-3">
              {testimonials.map((t) => (
                <div key={t.id} className="flex gap-3 rounded-lg border border-line p-4">
                  <div className="flex-1 space-y-3">
                    <Field label="Quote" textarea value={t.quote} onChange={(v) => setT(t.id, "quote", v)} />
                    <Field label="Name" value={t.name} onChange={(v) => setT(t.id, "name", v)} />
                  </div>
                  <button type="button" onClick={() => setTestimonials((ts) => ts.filter((x) => x.id !== t.id))} className="h-fit rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500" aria-label="Remove testimonial">
                    <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setTestimonials((ts) => [...ts, { id: uid("t"), quote: "", name: "" }])} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark">
              <AdminIcon name="plus" className="h-4 w-4" /> Add testimonial
            </button>
          </BlockCard>
        </>
      )}
    </div>
  );
}
