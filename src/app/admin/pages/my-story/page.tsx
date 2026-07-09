"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminIcon from "@/components/admin/AdminIcon";
import ImageField from "@/components/admin/ImageField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Card, PageHeader, btnPrimary, btnGhost } from "@/components/admin/ui";
import {
  DEFAULT_MY_STORY,
  withMyStoryDefaults,
  type Milestone,
} from "@/lib/pages/myStory";

let mid = 0;
const uid = () => `m-${Date.now().toString(36)}-${mid++}`;

export default function MyStoryEditor() {
  const [items, setItems] = useState<Milestone[]>(DEFAULT_MY_STORY.timeline);
  const [story, setStory] = useState(DEFAULT_MY_STORY.story);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/pages/my-story")
      .then((r) => r.json())
      .then((d) => {
        const c = withMyStoryDefaults(d);
        setItems(c.timeline);
        setStory(c.story);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = (id: string, field: keyof Milestone, value: string) =>
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, [field]: value } : x)));

  const move = (id: string, dir: -1 | 1) =>
    setItems((xs) => {
      const i = xs.findIndex((x) => x.id === id);
      const j = i + dir;
      if (j < 0 || j >= xs.length) return xs;
      const copy = [...xs];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/pages/my-story", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeline: items, story }),
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
      <Link
        href="/admin/pages"
        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink"
      >
        ← Back to Pages
      </Link>

      <PageHeader
        title="Edit: My Story"
        description="A timeline carousel (image · year · text), then the full story with rich-text formatting."
        action={
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm font-semibold text-brand-green">
                Saved ✓
              </span>
            )}
            <Link href="/my-story" target="_blank" className={btnGhost}>
              <AdminIcon name="external" className="h-4 w-4" />
              View page
            </Link>
            <button
              type="button"
              onClick={save}
              disabled={saving || loading}
              className={`${btnPrimary} disabled:opacity-60`}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        }
      />

      {loading ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : (
        <>
          <p className="mb-5 rounded-lg border border-brand-blue-soft bg-brand-blue-tint px-3 py-2 text-xs text-brand-blue-dark">
            Choose a file and it uploads to your site instantly (stored in the
            database), or paste an image URL.
          </p>

          {/* ── Timeline carousel ─────────────────────────── */}
          <Card className="mb-6 p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded bg-brand-green-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-green-dark">
                Timeline
              </span>
              <span className="text-xs text-ink-faint">
                Each card is a slide in the carousel.
              </span>
            </div>

            <div className="space-y-3">
              {items.map((m, i) => (
                <div
                  key={m.id}
                  className="flex gap-4 rounded-lg border border-line p-4"
                >
                  <div className="flex flex-col text-ink-faint">
                    <button
                      type="button"
                      onClick={() => move(m.id, -1)}
                      disabled={i === 0}
                      className="rounded p-0.5 hover:text-ink disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <AdminIcon name="chevronUp" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(m.id, 1)}
                      disabled={i === items.length - 1}
                      className="rounded p-0.5 hover:text-ink disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <AdminIcon name="chevronDown" className="h-4 w-4" />
                    </button>
                  </div>

                  <ImageField
                    value={m.image}
                    onChange={(v) => update(m.id, "image", v)}
                    label="Photo"
                    boxClass="aspect-[3/4] w-28"
                  />

                  <div className="flex-1 space-y-3">
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                        Year
                      </span>
                      <input
                        value={m.year}
                        onChange={(e) => update(m.id, "year", e.target.value)}
                        className="w-32 rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-ink outline-none focus:border-brand-green"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                        Text
                      </span>
                      <textarea
                        value={m.text}
                        onChange={(e) => update(m.id, "text", e.target.value)}
                        rows={3}
                        className="w-full resize-y rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setItems((xs) => xs.filter((x) => x.id !== m.id))
                    }
                    className="self-start rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove milestone"
                  >
                    <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setItems((xs) => [
                  ...xs,
                  { id: uid(), image: "", year: "", text: "" },
                ])
              }
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:text-brand-green-dark"
            >
              <AdminIcon name="plus" className="h-4 w-4" />
              Add milestone
            </button>
          </Card>

          {/* ── Story (rich text) ─────────────────────────── */}
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded bg-brand-blue-tint px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-blue-dark">
                Story
              </span>
              <span className="text-xs text-ink-faint">
                Write freely — use headings, bold, bullets and links.
              </span>
            </div>
            <RichTextEditor initialHTML={story} onChange={setStory} />
          </Card>
        </>
      )}
    </div>
  );
}
