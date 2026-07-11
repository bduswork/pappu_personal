"use client";

import { useEffect, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { usePageStatus } from "@/components/admin/usePageStatus";
import {
  DEFAULT_PRESS_KIT,
  withPressKitDefaults,
  type Photo,
  type PressItem,
} from "@/lib/pages/pressKit";

let seq = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${seq++}`;

export default function PressKitEditor() {
  const [banner, setBanner] = useState(DEFAULT_PRESS_KIT.banner);
  const [portrait, setPortrait] = useState(DEFAULT_PRESS_KIT.portrait);
  const [bio, setBio] = useState(DEFAULT_PRESS_KIT.bio);
  const [oneSheet, setOneSheet] = useState(DEFAULT_PRESS_KIT.oneSheet);
  const [photos, setPhotos] = useState<Photo[]>(DEFAULT_PRESS_KIT.photos);
  const [press, setPress] = useState<PressItem[]>(DEFAULT_PRESS_KIT.press);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const ps = usePageStatus("/press-kit");

  useEffect(() => {
    fetch("/api/pages/press-kit")
      .then((r) => r.json())
      .then((d) => {
        const c = withPressKitDefaults(d);
        setBanner(c.banner);
        setPortrait(c.portrait);
        setBio(c.bio);
        setOneSheet(c.oneSheet);
        setPhotos(c.photos);
        setPress(c.press);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setPressItem = (id: string, f: keyof PressItem, v: string) =>
    setPress((xs) => xs.map((x) => (x.id === id ? { ...x, [f]: v } : x)));

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/pages/press-kit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banner, portrait, bio, oneSheet, photos, press }),
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
        title="Edit: Press Kit"
        description="Biography, a downloadable one-sheet, a headshots gallery, and recent press."
        viewHref="/press-kit"
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
          {/* Banner */}
          <BlockCard label="Banner" hint="background image, like the live site">
            <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
              <ImageField
                value={banner.image}
                onChange={(v) => setBanner((b) => ({ ...b, image: v }))}
                label="Banner image"
                boxClass="aspect-video w-full"
              />
              <Field label="Headline" value={banner.headline} onChange={(v) => setBanner((b) => ({ ...b, headline: v }))} />
            </div>
          </BlockCard>

          {/* Biography */}
          <BlockCard label="Biography" hint="portrait shows large on the right of the bio">
            <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
              <ImageField
                value={portrait}
                onChange={setPortrait}
                label="Portrait photo"
                boxClass="aspect-[4/5] w-full"
              />
              <RichTextEditor initialHTML={bio} onChange={setBio} />
            </div>
          </BlockCard>

          {/* One-sheet */}
          <BlockCard label="One-sheet" tone="amber" hint="downloadable PDF link">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="PDF URL" value={oneSheet.url} onChange={(v) => setOneSheet((o) => ({ ...o, url: v }))} placeholder="https://…/one-sheet.pdf" />
              <Field label="Button label" value={oneSheet.label} onChange={(v) => setOneSheet((o) => ({ ...o, label: v }))} />
            </div>
          </BlockCard>

          {/* Headshots */}
          <BlockCard label="Headshots & photos" hint="gallery">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {photos.map((p) => (
                <div key={p.id} className="relative">
                  <ImageField
                    value={p.url}
                    onChange={(v) => setPhotos((ps2) => ps2.map((x) => (x.id === p.id ? { ...x, url: v } : x)))}
                    label="Photo"
                    boxClass="aspect-[3/4] w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotos((ps2) => ps2.filter((x) => x.id !== p.id))}
                    className="mt-1 flex w-full items-center justify-center gap-1 rounded-md border border-line py-1 text-xs font-medium text-ink-faint hover:border-red-300 hover:text-red-500"
                  >
                    <AdminIcon name="trash" className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPhotos((ps2) => [...ps2, { id: uid("ph"), url: "" }])}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
            >
              <AdminIcon name="plus" className="h-4 w-4" /> Add photo
            </button>
          </BlockCard>

          {/* Recent press */}
          <BlockCard label="Recent press" hint="outlet · title · date · link">
            <div className="space-y-3">
              {press.map((p) => (
                <div key={p.id} className="flex gap-3 rounded-lg border border-line p-4">
                  <ImageField
                    value={p.image}
                    onChange={(v) => setPressItem(p.id, "image", v)}
                    label="Image"
                    boxClass="aspect-video w-28"
                  />
                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <Field label="Outlet" value={p.outlet} onChange={(v) => setPressItem(p.id, "outlet", v)} placeholder="The Daily Star" />
                    <Field label="Date" value={p.date} onChange={(v) => setPressItem(p.id, "date", v)} placeholder="Jun 2025" />
                    <div className="sm:col-span-2">
                      <Field label="Title" value={p.title} onChange={(v) => setPressItem(p.id, "title", v)} />
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Link" value={p.link} onChange={(v) => setPressItem(p.id, "link", v)} placeholder="https://…" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPress((xs) => xs.filter((x) => x.id !== p.id))}
                    className="h-fit rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove press item"
                  >
                    <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPress((xs) => [...xs, { id: uid("pr"), outlet: "", title: "New article", date: "", link: "", image: "" }])}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
            >
              <AdminIcon name="plus" className="h-4 w-4" /> Add press item
            </button>
          </BlockCard>
        </>
      )}
    </div>
  );
}
