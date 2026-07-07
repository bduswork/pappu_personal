"use client";

import { useState } from "react";
import Link from "next/link";
import AdminIcon from "@/components/admin/AdminIcon";
import ImageField from "@/components/admin/ImageField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Card, PageHeader, btnPrimary, btnGhost } from "@/components/admin/ui";

type BuyLink = { id: string; label: string; url: string };

// Self-contained single-book page (no Books collection). Placeholder content —
// The Book isn't covered by the résumé, so this is a scaffold to fill.
const INITIAL_DESC =
  "<p>A practical guide to building a focused, disciplined business — drawn from two decades architecting large-scale systems and mentoring founders through One-Focus.</p>";

let bid = 3;

export default function TheBookEditor() {
  const [banner, setBanner] = useState("");
  const [bannerText, setBannerText] = useState(
    "In addition to leading technology teams, ABM Whaiduzzaman shares his focus philosophy in book form."
  );
  const [cover, setCover] = useState("");
  const [title, setTitle] = useState("One-Focus");
  const [subtitle, setSubtitle] = useState("The Entrepreneur's Discipline");
  const [, setDescription] = useState(INITIAL_DESC);
  const [links, setLinks] = useState<BuyLink[]>([
    { id: "1", label: "Amazon", url: "" },
    { id: "2", label: "Barnes & Noble", url: "" },
  ]);

  const updateLink = (id: string, field: "label" | "url", value: string) =>
    setLinks((ls) =>
      ls.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );

  return (
    <div>
      <Link
        href="/admin/pages"
        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink"
      >
        ← Back to Pages
      </Link>

      <PageHeader
        title="Edit: The Book"
        description="A single self-contained book page — cover, title, description and buy links. No separate collection."
        action={
          <div className="flex gap-2">
            <Link href="/the-book" target="_blank" className={btnGhost}>
              <AdminIcon name="external" className="h-4 w-4" />
              View page
            </Link>
            <button type="button" className={btnPrimary}>
              Save changes
            </button>
          </div>
        }
      />

      <p className="mb-5 rounded-lg border border-brand-blue-soft bg-brand-blue-tint px-3 py-2 text-xs text-brand-blue-dark">
        Placeholder content — fill in the real book details. Choose a cover file
        to preview it (upload activates with Firebase Storage).
      </p>

      {/* Banner — background image + intro line, like the live site */}
      <Card className="mb-6 p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded bg-brand-blue-tint px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-blue-dark">
            Banner
          </span>
        </div>
        <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
          <ImageField
            value={banner}
            onChange={setBanner}
            label="Banner image"
            boxClass="aspect-video w-full"
          />
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Banner text
            </span>
            <textarea
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              rows={3}
              className="w-full resize-y rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
            />
          </label>
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded bg-brand-blue-tint px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-blue-dark">
            Book
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-[180px_1fr]">
          {/* Cover */}
          <ImageField
            value={cover}
            onChange={setCover}
            label="Cover"
            boxClass="aspect-[3/4] w-full"
          />

          {/* Details */}
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Title
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-brand-green"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Subtitle
              </span>
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
              />
            </label>
            <div>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Description
              </span>
              <RichTextEditor initialHTML={INITIAL_DESC} onChange={setDescription} />
            </div>
          </div>
        </div>

        {/* Buy links */}
        <div className="mt-6 border-t border-line pt-5">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Buy links
          </span>
          <div className="space-y-2">
            {links.map((l) => (
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
                  onClick={() => setLinks((ls) => ls.filter((x) => x.id !== l.id))}
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
            onClick={() =>
              setLinks((ls) => [...ls, { id: `b${bid++}`, label: "", url: "" }])
            }
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
          >
            <AdminIcon name="plus" className="h-4 w-4" />
            Add buy link
          </button>
        </div>
      </Card>
    </div>
  );
}
