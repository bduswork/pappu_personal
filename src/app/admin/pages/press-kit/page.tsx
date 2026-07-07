"use client";

import { useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import CollectionBlock from "@/components/admin/CollectionBlock";

type Photo = { id: string; url: string };

const BIO =
  "<p>ABM Whaiduzzaman is a software architect and technology leader, currently CTO of Nexalinx, where he designs Hospital ERP and Government MIS platforms as scalable, HL7/DICOM-compliant SaaS.</p><p>Over 18+ years he has built large-scale billing, metering and enterprise systems for utilities, telecom, healthcare and banking across Bangladesh, China, the USA and Uganda — including telecom roaming for GrameenPhone, prepaid vending for Uganda's UMEME, and AMI/MDM platforms for national utilities.</p><p>He holds an MS in Computer Science from Jahangirnagar University, is PMP-certified, and is a member of BASIS and the Bangladesh Computer Society. He also trains entrepreneurs through One-Focus.</p>";

const INITIAL_PHOTOS: Photo[] = [
  { id: "ph1", url: "" },
  { id: "ph2", url: "" },
  { id: "ph3", url: "" },
];

let phid = 4;

export default function PressKitEditor() {
  const [banner, setBanner] = useState("");
  const [headline, setHeadline] = useState("Biography");
  const [, setBio] = useState(BIO);
  const [oneSheet, setOneSheet] = useState("");
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);

  return (
    <div>
      <EditorHeader
        title="Edit: Press Kit"
        description="Biography, a downloadable one-sheet, a headshots gallery, and recent press."
        viewHref="/press-kit"
      />

      {/* Banner — background image behind the biography */}
      <BlockCard label="Banner" hint="background image, like the live site">
        <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
          <ImageField
            value={banner}
            onChange={setBanner}
            label="Banner image"
            boxClass="aspect-video w-full"
          />
          <Field label="Headline" value={headline} onChange={setHeadline} />
        </div>
      </BlockCard>

      {/* Biography */}
      <BlockCard label="Biography">
        <RichTextEditor initialHTML={BIO} onChange={setBio} />
      </BlockCard>

      {/* One-sheet */}
      <BlockCard label="One-sheet" tone="amber" hint="downloadable PDF">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink-soft hover:border-brand-green hover:text-brand-green">
            <AdminIcon name="media" className="h-4 w-4" />
            Choose PDF
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setOneSheet(f.name);
              }}
            />
          </label>
          <input
            value={oneSheet}
            onChange={(e) => setOneSheet(e.target.value)}
            placeholder="or paste a PDF URL"
            className="min-w-[220px] flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
          />
        </div>
        <p className="mt-2 text-xs text-ink-faint">
          PDF upload activates with Firebase Storage; for now paste a URL.
        </p>
      </BlockCard>

      {/* Headshots & photos */}
      <BlockCard label="Headshots & photos" hint="gallery">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p) => (
            <div key={p.id} className="relative">
              <ImageField
                value={p.url}
                onChange={(v) =>
                  setPhotos((ps) => ps.map((x) => (x.id === p.id ? { ...x, url: v } : x)))
                }
                label="Photo"
                boxClass="aspect-[3/4] w-full"
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
          onClick={() => setPhotos((ps) => [...ps, { id: `ph${phid++}`, url: "" }])}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
        >
          <AdminIcon name="plus" className="h-4 w-4" /> Add photo
        </button>
      </BlockCard>

      {/* Recent press → Press collection */}
      <CollectionBlock
        label="Recent press"
        collection="Press"
        href="/admin/collections/press"
        defaultHeading="Recent Press"
      />
    </div>
  );
}
