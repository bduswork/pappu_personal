"use client";

import { useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import CollectionBlock from "@/components/admin/CollectionBlock";

type Platform = { id: string; label: string; url: string };
type Testimonial = { id: string; quote: string; name: string };

const INTRO =
  "<p>On this show you'll find talks on software architecture, smart metering & AMI, telecom billing, healthcare IT, and disciplined entrepreneurship — plus interviews, fireside chats and new thinking recorded for the audio experience.</p>";

const PLATFORMS: Platform[] = [
  { id: "pl1", label: "Apple Podcasts", url: "" },
  { id: "pl2", label: "Spotify", url: "" },
  { id: "pl3", label: "YouTube", url: "" },
  { id: "pl4", label: "Google Podcasts", url: "" },
];

const TESTIMONIALS: Testimonial[] = [
  { id: "t1", quote: "Clear, practical and inspiring — every episode teaches me something I can use.", name: "A listener" },
];

let plid = 5;
let tid = 2;

export default function PodcastEditor() {
  const [banner, setBanner] = useState("");
  const [, setIntro] = useState(INTRO);
  const [platforms, setPlatforms] = useState<Platform[]>(PLATFORMS);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);

  const setP = (id: string, f: "label" | "url", v: string) =>
    setPlatforms((ps) => ps.map((p) => (p.id === id ? { ...p, [f]: v } : p)));
  const setT = (id: string, f: "quote" | "name", v: string) =>
    setTestimonials((ts) => ts.map((t) => (t.id === id ? { ...t, [f]: v } : t)));

  return (
    <div>
      <EditorHeader
        title="Edit: Podcast & Videos"
        description="Hero, listen-on links, video gallery (from Collections → Videos), and testimonials."
        viewHref="/podcast"
      />

      {/* Hero */}
      <BlockCard label="Hero">
        <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
          <ImageField value={banner} onChange={setBanner} label="Hero image" boxClass="aspect-video w-full" />
          <div>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Intro
            </span>
            <RichTextEditor initialHTML={INTRO} onChange={setIntro} />
          </div>
        </div>
      </BlockCard>

      {/* Listen on */}
      <BlockCard label="Listen on" tone="amber" hint="podcast platform links">
        <div className="space-y-2">
          {platforms.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <input
                value={p.label}
                onChange={(e) => setP(p.id, "label", e.target.value)}
                placeholder="Platform (e.g. Spotify)"
                className="w-44 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink outline-none focus:border-brand-green"
              />
              <input
                value={p.url}
                onChange={(e) => setP(p.id, "url", e.target.value)}
                placeholder="https://…"
                className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
              />
              <button type="button" onClick={() => setPlatforms((ps) => ps.filter((x) => x.id !== p.id))} className="rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500" aria-label="Remove platform">
                <AdminIcon name="trash" className="h-[18px] w-[18px]" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setPlatforms((ps) => [...ps, { id: `pl${plid++}`, label: "", url: "" }])} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark">
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
        <button type="button" onClick={() => setTestimonials((ts) => [...ts, { id: `t${tid++}`, quote: "", name: "" }])} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark">
          <AdminIcon name="plus" className="h-4 w-4" /> Add testimonial
        </button>
      </BlockCard>
    </div>
  );
}
