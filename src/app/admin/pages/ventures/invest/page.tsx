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
  DEFAULT_INVEST,
  withInvestDefaults,
  type Opportunity,
} from "@/lib/pages/investPartner";

let seq = 0;
const uid = () => `o-${Date.now().toString(36)}-${seq++}`;

const FORM_FIELDS = ["Full name", "Email", "Company", "Message"];

export default function InvestPartnerEditor() {
  const [banner, setBanner] = useState(DEFAULT_INVEST.banner);
  const [pitch, setPitch] = useState(DEFAULT_INVEST.pitch);
  const [opps, setOpps] = useState<Opportunity[]>(DEFAULT_INVEST.opportunities);
  const [form, setForm] = useState(DEFAULT_INVEST.form);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const ps = usePageStatus("/ventures/invest");

  useEffect(() => {
    fetch("/api/pages/ventures-invest")
      .then((r) => r.json())
      .then((d) => {
        const c = withInvestDefaults(d);
        setBanner(c.banner);
        setPitch(c.pitch);
        setOpps(c.opportunities);
        setForm(c.form);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setO = (id: string, f: "title" | "description", v: string) =>
    setOpps((os) => os.map((o) => (o.id === id ? { ...o, [f]: v } : o)));

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/pages/ventures-invest", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banner, pitch, opportunities: opps, form }),
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
        title="Edit: Invest & Partner"
        description="A pitch, partnership opportunities, and a contact form (inquiries land in Messages)."
        viewHref="/ventures/invest"
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
            <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
              <ImageField value={banner.image} onChange={(v) => setBanner((b) => ({ ...b, image: v }))} label="Banner image" boxClass="aspect-video w-full" />
              <Field label="Headline" value={banner.headline} onChange={(v) => setBanner((b) => ({ ...b, headline: v }))} />
            </div>
          </BlockCard>

          <BlockCard label="Pitch">
            <RichTextEditor initialHTML={pitch} onChange={setPitch} />
          </BlockCard>

          <BlockCard label="Opportunities" hint="ways to work together">
            <div className="space-y-3">
              {opps.map((o) => (
                <div key={o.id} className="flex gap-3 rounded-lg border border-line p-4">
                  <div className="flex-1 space-y-3">
                    <Field label="Title" value={o.title} onChange={(v) => setO(o.id, "title", v)} />
                    <Field label="Description" textarea value={o.description} onChange={(v) => setO(o.id, "description", v)} />
                  </div>
                  <button type="button" onClick={() => setOpps((os) => os.filter((x) => x.id !== o.id))} className="h-fit rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500" aria-label="Remove opportunity">
                    <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setOpps((os) => [...os, { id: uid(), title: "", description: "" }])} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark">
              <AdminIcon name="plus" className="h-4 w-4" /> Add opportunity
            </button>
          </BlockCard>

          <BlockCard label="Contact form" tone="amber" hint="partnership inquiries → Messages">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Form heading" value={form.heading} onChange={(v) => setForm((f) => ({ ...f, heading: v }))} />
              <div className="sm:col-span-2">
                <Field label="Intro text" textarea value={form.intro} onChange={(v) => setForm((f) => ({ ...f, intro: v }))} />
              </div>
            </div>
            <p className="mt-4 mb-2 text-sm text-ink-soft">Fields collected:</p>
            <div className="flex flex-wrap gap-2">
              {FORM_FIELDS.map((f) => (
                <span key={f} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-ink-soft">{f}</span>
              ))}
            </div>
          </BlockCard>
        </>
      )}
    </div>
  );
}
