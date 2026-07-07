"use client";

import { useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import RichTextEditor from "@/components/admin/RichTextEditor";

type Opp = { id: string; title: string; description: string };

const PITCH =
  "<p>Partner with ABM Whaiduzzaman to build and scale ventures. With two decades architecting technology companies across utilities, telecom, healthcare and finance, I invest in and co-build brands with strong fundamentals and clear focus.</p>";

const INITIAL_OPPS: Opp[] = [
  { id: "o1", title: "Co-found & build", description: "Hands-on partnership to build a product or brand from zero." },
  { id: "o2", title: "Invest & advise", description: "Capital plus strategic and technical guidance for growth-stage teams." },
];

const FORM_FIELDS = ["Full name", "Email", "Company", "Message"];

let oid = 3;

export default function InvestPartnerEditor() {
  const [banner, setBanner] = useState("");
  const [headline, setHeadline] = useState("Invest & Partner");
  const [, setPitch] = useState(PITCH);
  const [opps, setOpps] = useState<Opp[]>(INITIAL_OPPS);
  const [formHeading, setFormHeading] = useState("Let's talk");
  const [formIntro, setFormIntro] = useState(
    "Tell me about your venture or partnership idea and I'll get back to you."
  );

  const setO = (id: string, f: "title" | "description", v: string) =>
    setOpps((os) => os.map((o) => (o.id === id ? { ...o, [f]: v } : o)));

  return (
    <div>
      <EditorHeader
        title="Edit: Invest & Partner"
        description="A pitch, partnership opportunities, and a contact form."
        viewHref="/ventures/invest"
      />

      <BlockCard label="Banner">
        <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
          <ImageField value={banner} onChange={setBanner} label="Banner image" boxClass="aspect-video w-full" />
          <Field label="Headline" value={headline} onChange={setHeadline} />
        </div>
      </BlockCard>

      <BlockCard label="Pitch">
        <RichTextEditor initialHTML={PITCH} onChange={setPitch} />
      </BlockCard>

      <BlockCard label="Opportunities" hint="ways to work together">
        <div className="space-y-3">
          {opps.map((o) => (
            <div key={o.id} className="flex gap-3 rounded-lg border border-line p-4">
              <div className="flex-1 space-y-3">
                <Field label="Title" value={o.title} onChange={(v) => setO(o.id, "title", v)} />
                <Field label="Description" textarea value={o.description} onChange={(v) => setO(o.id, "description", v)} />
              </div>
              <button
                type="button"
                onClick={() => setOpps((os) => os.filter((x) => x.id !== o.id))}
                className="h-fit rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                aria-label="Remove opportunity"
              >
                <AdminIcon name="trash" className="h-[18px] w-[18px]" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setOpps((os) => [...os, { id: `o${oid++}`, title: "", description: "" }])}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
        >
          <AdminIcon name="plus" className="h-4 w-4" /> Add opportunity
        </button>
      </BlockCard>

      <BlockCard label="Contact form" tone="amber" hint="partnership inquiries">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Form heading" value={formHeading} onChange={setFormHeading} />
          <div className="sm:col-span-2">
            <Field label="Intro text" textarea value={formIntro} onChange={setFormIntro} />
          </div>
        </div>
        <p className="mt-4 mb-2 text-sm text-ink-soft">Fields collected:</p>
        <div className="flex flex-wrap gap-2">
          {FORM_FIELDS.map((f) => (
            <span key={f} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-ink-soft">
              {f}
            </span>
          ))}
        </div>
      </BlockCard>
    </div>
  );
}
