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
  DEFAULT_THE_BOOK,
  withTheBookDefaults,
  type BuyLink,
} from "@/lib/pages/theBook";

let seq = 0;
const uid = () => `b-${Date.now().toString(36)}-${seq++}`;

export default function TheBookEditor() {
  const [banner, setBanner] = useState(DEFAULT_THE_BOOK.banner);
  const [cover, setCover] = useState(DEFAULT_THE_BOOK.cover);
  const [title, setTitle] = useState(DEFAULT_THE_BOOK.title);
  const [subtitle, setSubtitle] = useState(DEFAULT_THE_BOOK.subtitle);
  const [description, setDescription] = useState(DEFAULT_THE_BOOK.description);
  const [highlights, setHighlights] = useState<string[]>(DEFAULT_THE_BOOK.highlights);
  const [buyLinks, setBuyLinks] = useState<BuyLink[]>(DEFAULT_THE_BOOK.buyLinks);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const ps = usePageStatus("/the-book");

  useEffect(() => {
    fetch("/api/pages/the-book")
      .then((r) => r.json())
      .then((d) => {
        const c = withTheBookDefaults(d);
        setBanner(c.banner);
        setCover(c.cover);
        setTitle(c.title);
        setSubtitle(c.subtitle);
        setDescription(c.description);
        setHighlights(c.highlights);
        setBuyLinks(c.buyLinks);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateLink = (id: string, field: "label" | "url", value: string) =>
    setBuyLinks((ls) => ls.map((l) => (l.id === id ? { ...l, [field]: value } : l)));

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/pages/the-book", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          banner,
          cover,
          title,
          subtitle,
          description,
          highlights: highlights.filter(Boolean),
          buyLinks,
        }),
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
        title="Edit: The Book"
        description="A single self-contained book page — cover, title, description, highlights and buy links."
        viewHref="/the-book"
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
          <BlockCard label="Banner">
            <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
              <ImageField
                value={banner.image}
                onChange={(v) => setBanner((b) => ({ ...b, image: v }))}
                label="Banner image"
                boxClass="aspect-video w-full"
              />
              <Field
                label="Banner text"
                textarea
                value={banner.text}
                onChange={(v) => setBanner((b) => ({ ...b, text: v }))}
              />
            </div>
          </BlockCard>

          {/* Book */}
          <BlockCard label="Book">
            <div className="grid gap-6 md:grid-cols-[180px_1fr]">
              <ImageField value={cover} onChange={setCover} label="Cover" boxClass="aspect-[3/4] w-full" />
              <div className="space-y-4">
                <Field label="Title" value={title} onChange={setTitle} />
                <Field label="Subtitle" value={subtitle} onChange={setSubtitle} />
                <div>
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    Description
                  </span>
                  <RichTextEditor initialHTML={description} onChange={setDescription} />
                </div>
              </div>
            </div>

            {/* Buy links */}
            <div className="mt-6 border-t border-line pt-5">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Buy links
              </span>
              <div className="space-y-2">
                {buyLinks.map((l) => (
                  <div key={l.id} className="flex items-center gap-2">
                    <input
                      value={l.label}
                      onChange={(e) => updateLink(l.id, "label", e.target.value)}
                      placeholder="Store (e.g. Amazon)"
                      className="w-40 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink outline-none focus:border-brand-green"
                    />
                    <input
                      value={l.url}
                      onChange={(e) => updateLink(l.id, "url", e.target.value)}
                      placeholder="https://…"
                      className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
                    />
                    <button
                      type="button"
                      onClick={() => setBuyLinks((ls) => ls.filter((x) => x.id !== l.id))}
                      className="rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                      aria-label="Remove buy link"
                    >
                      <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setBuyLinks((ls) => [...ls, { id: uid(), label: "", url: "" }])}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
              >
                <AdminIcon name="plus" className="h-4 w-4" /> Add buy link
              </button>
            </div>
          </BlockCard>

          {/* What's inside */}
          <BlockCard label="What's inside" hint="highlights / what readers learn">
            <div className="space-y-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={h}
                    onChange={(e) => setHighlights((xs) => xs.map((x, j) => (j === i ? e.target.value : x)))}
                    className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
                  />
                  <button
                    type="button"
                    onClick={() => setHighlights((xs) => xs.filter((_, j) => j !== i))}
                    className="rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove highlight"
                  >
                    <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setHighlights((xs) => [...xs, "New highlight"])}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
            >
              <AdminIcon name="plus" className="h-4 w-4" /> Add highlight
            </button>
          </BlockCard>
        </>
      )}
    </div>
  );
}
