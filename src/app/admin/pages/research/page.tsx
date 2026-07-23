"use client";

import { useEffect, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import { usePageStatus } from "@/components/admin/usePageStatus";
import {
  DEFAULT_RESEARCH,
  withResearchDefaults,
  type ResearchPaper,
} from "@/lib/pages/research";

let seq = 0;
const uid = () => `p-${Date.now().toString(36)}-${seq++}`;

export default function ResearchEditor() {
  const [banner, setBanner] = useState(DEFAULT_RESEARCH.banner);
  const [profile, setProfile] = useState(DEFAULT_RESEARCH.profile);
  const [papers, setPapers] = useState<ResearchPaper[]>(DEFAULT_RESEARCH.papers);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const ps = usePageStatus("/research");

  useEffect(() => {
    fetch("/api/pages/research")
      .then((r) => r.json())
      .then((d) => {
        const c = withResearchDefaults(d);
        setBanner(c.banner);
        setProfile(c.profile);
        setPapers(c.papers);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setP = (id: string, f: keyof ResearchPaper, v: string) =>
    setPapers((ps) => ps.map((p) => (p.id === id ? { ...p, [f]: v } : p)));

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/pages/research", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banner, profile, papers }),
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
        title="Edit: Research Paper"
        description="Your publications — each with authors, venue, year, a summary and a link."
        viewHref="/research"
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
          <BlockCard label="Banner">
            <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
              <ImageField
                value={banner.image}
                onChange={(v) => setBanner((b) => ({ ...b, image: v }))}
                label="Banner image"
                boxClass="aspect-video w-full"
              />
              <div className="space-y-3">
                <Field
                  label="Headline"
                  value={banner.headline}
                  onChange={(v) => setBanner((b) => ({ ...b, headline: v }))}
                />
                <Field
                  label="Intro"
                  textarea
                  value={banner.intro}
                  onChange={(v) => setBanner((b) => ({ ...b, intro: v }))}
                />
              </div>
            </div>
          </BlockCard>

          <BlockCard label="Scholar profile" tone="blue" hint="shown as a button at the top">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Button label"
                value={profile.label}
                onChange={(v) => setProfile((p) => ({ ...p, label: v }))}
                placeholder="Google Scholar profile"
              />
              <Field
                label="Profile link"
                value={profile.link}
                onChange={(v) => setProfile((p) => ({ ...p, link: v }))}
                placeholder="https://scholar.google.com/citations?user=…"
              />
            </div>
          </BlockCard>

          <BlockCard label="Publications" tone="green" hint="one card per paper">
            <div className="space-y-4">
              {papers.map((p, i) => (
                <div key={p.id} className="rounded-lg border border-line p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wide text-ink-faint">
                      Paper {i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPapers((ps) => ps.filter((x) => x.id !== p.id))}
                      className="rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                      aria-label="Remove paper"
                    >
                      <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                    </button>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-[150px_1fr]">
                    <ImageField
                      value={p.image}
                      onChange={(v) => setP(p.id, "image", v)}
                      label="Cover"
                      boxClass="aspect-[3/4] w-full"
                    />
                    <div className="space-y-3">
                      <Field label="Title" value={p.title} onChange={(v) => setP(p.id, "title", v)} />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field
                          label="Authors (who)"
                          value={p.authors}
                          onChange={(v) => setP(p.id, "authors", v)}
                          placeholder="ABM Whaiduzzaman, A Al Ryan"
                        />
                        <Field
                          label="Year"
                          value={p.year}
                          onChange={(v) => setP(p.id, "year", v)}
                          placeholder="2025"
                        />
                      </div>
                      <Field
                        label="Journal / conference"
                        value={p.venue}
                        onChange={(v) => setP(p.id, "venue", v)}
                        placeholder="ICCIDS 2025, Springer — pp. 208–223"
                      />
                      <Field
                        label="Details / summary"
                        textarea
                        value={p.summary}
                        onChange={(v) => setP(p.id, "summary", v)}
                      />
                      <Field
                        label="Link"
                        value={p.link}
                        onChange={(v) => setP(p.id, "link", v)}
                        placeholder="https://link.springer.com/chapter/…"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setPapers((ps) => [
                  ...ps,
                  { id: uid(), title: "", authors: "", venue: "", year: "", summary: "", link: "", image: "" },
                ])
              }
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
            >
              <AdminIcon name="plus" className="h-4 w-4" /> Add paper
            </button>
          </BlockCard>
        </>
      )}
    </div>
  );
}
