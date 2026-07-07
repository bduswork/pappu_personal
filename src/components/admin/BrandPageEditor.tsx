"use client";

import { useRef, useState } from "react";
import AdminIcon from "./AdminIcon";
import EditorHeader from "./EditorHeader";
import BlockCard from "./BlockCard";
import Field from "./Field";
import ImageField from "./ImageField";
import RichTextEditor from "./RichTextEditor";

type Photo = { id: string; url: string };

/**
 * Reusable brand-profile editor for Ventures (Zariya Living, Heritique, AVA):
 * hero · logo · about · gallery · call-to-action. Each venture page is a thin
 * wrapper that passes its own defaults.
 */
export default function BrandPageEditor({
  brand,
  tagline,
  about,
  viewHref,
}: {
  brand: string;
  tagline: string;
  about: string;
  viewHref: string;
}) {
  const [heroImg, setHeroImg] = useState("");
  const [logo, setLogo] = useState("");
  const [name, setName] = useState(brand);
  const [tag, setTag] = useState(tagline);
  const [website, setWebsite] = useState("");
  const [, setAbout] = useState(about);
  const [photos, setPhotos] = useState<Photo[]>([
    { id: "p1", url: "" },
    { id: "p2", url: "" },
    { id: "p3", url: "" },
  ]);
  const [ctaLabel, setCtaLabel] = useState("Visit site");
  const [ctaLink, setCtaLink] = useState("");
  const idRef = useRef(0);

  return (
    <div>
      <EditorHeader
        title={`Edit: ${brand}`}
        description="Brand profile — hero, logo, about, gallery and a call-to-action."
        viewHref={viewHref}
      />

      <BlockCard label="Hero">
        <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
          <ImageField value={heroImg} onChange={setHeroImg} label="Hero image" boxClass="aspect-video w-full" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Brand name" value={name} onChange={setName} />
            <Field label="Tagline" value={tag} onChange={setTag} />
            <Field label="Website" value={website} onChange={setWebsite} placeholder="https://…" className="sm:col-span-2" />
          </div>
        </div>
      </BlockCard>

      <BlockCard label="Logo" tone="slate">
        <div className="max-w-[220px]">
          <ImageField value={logo} onChange={setLogo} label="Logo" boxClass="aspect-video w-full" />
        </div>
      </BlockCard>

      <BlockCard label="About">
        <RichTextEditor initialHTML={about} onChange={setAbout} />
      </BlockCard>

      <BlockCard label="Gallery" hint="brand photos">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p) => (
            <div key={p.id}>
              <ImageField
                value={p.url}
                onChange={(v) => setPhotos((ps) => ps.map((x) => (x.id === p.id ? { ...x, url: v } : x)))}
                label="Photo"
                boxClass="aspect-square w-full"
              />
              <button
                type="button"
                onClick={() => setPhotos((ps) => ps.filter((x) => x.id !== p.id))}
                className="mt-1 flex w-full items-center justify-center gap-1 rounded-md border border-line py-1 text-xs font-medium text-ink-faint hover:border-red-300 hover:text-red-500"
              >
                <AdminIcon name="trash" className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPhotos((ps) => [...ps, { id: `new-${idRef.current++}`, url: "" }])}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
        >
          <AdminIcon name="plus" className="h-4 w-4" /> Add photo
        </button>
      </BlockCard>

      <BlockCard label="Call to action" tone="amber">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Button label" value={ctaLabel} onChange={setCtaLabel} />
          <Field label="Button link" value={ctaLink} onChange={setCtaLink} placeholder="https://…" />
        </div>
      </BlockCard>
    </div>
  );
}
