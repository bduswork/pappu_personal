"use client";

import { useEffect, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import { usePageStatus } from "@/components/admin/usePageStatus";
import {
  DEFAULT_GLOBAL_EXPERIENCE,
  withGlobalExperienceDefaults,
  type ExperienceItem,
  type ExperienceTrack,
} from "@/lib/pages/globalExperience";

let seq = 0;
const uid = () => `e-${Date.now().toString(36)}-${seq++}`;
const blank = (): ExperienceItem => ({
  id: uid(),
  image: "",
  role: "",
  organization: "",
  location: "",
  period: "",
  description: "",
  highlights: "",
});

/** Editor for one track (Job / Consultancy). */
function TrackEditor({
  label,
  tone,
  track,
  onChange,
}: {
  label: string;
  tone: "blue" | "green";
  track: ExperienceTrack;
  onChange: (t: ExperienceTrack) => void;
}) {
  const setItem = (id: string, f: keyof ExperienceItem, v: string) =>
    onChange({
      ...track,
      items: track.items.map((i) => (i.id === id ? { ...i, [f]: v } : i)),
    });

  return (
    <BlockCard label={label} tone={tone} hint="roles shown newest first">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Section heading"
          value={track.heading}
          onChange={(v) => onChange({ ...track, heading: v })}
        />
        <Field
          label="Section intro"
          value={track.intro}
          onChange={(v) => onChange({ ...track, intro: v })}
        />
      </div>

      <div className="mt-4 space-y-4">
        {track.items.map((item, i) => (
          <div key={item.id} className="rounded-lg border border-line p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-ink-faint">
                Entry {i + 1}
              </span>
              <button
                type="button"
                onClick={() =>
                  onChange({ ...track, items: track.items.filter((x) => x.id !== item.id) })
                }
                className="rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                aria-label="Remove entry"
              >
                <AdminIcon name="trash" className="h-[18px] w-[18px]" />
              </button>
            </div>
            <div className="grid gap-4 lg:grid-cols-[140px_1fr]">
              <ImageField
                value={item.image}
                onChange={(v) => setItem(item.id, "image", v)}
                label="Logo"
                boxClass="aspect-square w-full"
              />
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Role / position"
                    value={item.role}
                    onChange={(v) => setItem(item.id, "role", v)}
                    placeholder="Chief Technology Officer"
                  />
                  <Field
                    label="Organization / client"
                    value={item.organization}
                    onChange={(v) => setItem(item.id, "organization", v)}
                    placeholder="Nexalinx"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Location"
                    value={item.location}
                    onChange={(v) => setItem(item.id, "location", v)}
                    placeholder="Long Island City, NY · Dhaka"
                  />
                  <Field
                    label="Period"
                    value={item.period}
                    onChange={(v) => setItem(item.id, "period", v)}
                    placeholder="2022 — Present"
                  />
                </div>
                <Field
                  label="Description"
                  textarea
                  value={item.description}
                  onChange={(v) => setItem(item.id, "description", v)}
                />
                <Field
                  label="Key achievements — one per line"
                  textarea
                  rows={4}
                  value={item.highlights}
                  onChange={(v) => setItem(item.id, "highlights", v)}
                  placeholder={"Architected a micro-service Hospital ERP\nLed cross-border teams"}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange({ ...track, items: [...track.items, blank()] })}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
      >
        <AdminIcon name="plus" className="h-4 w-4" /> Add entry
      </button>
    </BlockCard>
  );
}

export default function GlobalExperienceEditor() {
  const [banner, setBanner] = useState(DEFAULT_GLOBAL_EXPERIENCE.banner);
  const [jobs, setJobs] = useState<ExperienceTrack>(DEFAULT_GLOBAL_EXPERIENCE.jobs);
  const [consultancy, setConsultancy] = useState<ExperienceTrack>(
    DEFAULT_GLOBAL_EXPERIENCE.consultancy
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const ps = usePageStatus("/global-experience");

  useEffect(() => {
    fetch("/api/pages/global-experience")
      .then((r) => r.json())
      .then((d) => {
        const c = withGlobalExperienceDefaults(d);
        setBanner(c.banner);
        setJobs(c.jobs);
        setConsultancy(c.consultancy);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/pages/global-experience", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banner, jobs, consultancy }),
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
        title="Edit: Global Experience"
        description="Two tracks — Job Experience and Consultancy Experience — in CV style."
        viewHref="/global-experience"
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

          <TrackEditor label="Job Experience" tone="blue" track={jobs} onChange={setJobs} />
          <TrackEditor
            label="Consultancy Experience"
            tone="green"
            track={consultancy}
            onChange={setConsultancy}
          />
        </>
      )}
    </div>
  );
}
