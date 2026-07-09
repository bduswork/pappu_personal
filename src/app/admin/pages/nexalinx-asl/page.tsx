"use client";

import { useEffect, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import { SortableList, SortableItem } from "@/components/admin/Sortable";
import {
  DEFAULT_NEXALINX_ASL,
  withNexalinxAslDefaults,
  type Company,
} from "@/lib/pages/nexalinxAsl";

let cid = 0;
const uid = () => `c-${Date.now().toString(36)}-${cid++}`;

export default function NexalinxAslEditor() {
  const [banner, setBanner] = useState(DEFAULT_NEXALINX_ASL.banner);
  const [companies, setCompanies] = useState<Company[]>(
    DEFAULT_NEXALINX_ASL.companies
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/pages/nexalinx-asl")
      .then((r) => r.json())
      .then((d) => {
        const c = withNexalinxAslDefaults(d);
        setBanner(c.banner);
        setCompanies(c.companies);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (id: string, field: keyof Company, value: string) =>
    setCompanies((cs) =>
      cs.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );

  const setHighlights = (id: string, text: string) =>
    setCompanies((cs) =>
      cs.map((c) => (c.id === id ? { ...c, highlights: text.split("\n") } : c))
    );

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/pages/nexalinx-asl", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banner, companies }),
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
        title="Edit: Nexalinx · ASL"
        description="A banner, then a card per company (logo · name · role · description · highlights · link)."
        viewHref="/nexalinx-asl"
        onSave={save}
        saving={saving}
        saved={saved}
      />

      {loading ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : (
        <>
          <BlockCard label="Banner">
            <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
              <ImageField
                value={banner.image}
                onChange={(v) => setBanner((b) => ({ ...b, image: v }))}
                label="Banner image"
                boxClass="aspect-video w-full"
              />
              <div className="space-y-4">
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

          <BlockCard label="Companies" hint="drag to reorder">
            <SortableList
              ids={companies.map((c) => c.id)}
              onReorder={(ids) =>
                setCompanies((cs) => {
                  const by = new Map(cs.map((c) => [c.id, c]));
                  return ids.map((i) => by.get(i)!).filter(Boolean);
                })
              }
            >
              <div className="space-y-3">
                {companies.map((c) => (
                  <SortableItem key={c.id} id={c.id}>
                    {({ setNodeRef, style, handleProps, isDragging }) => (
                      <div
                        ref={setNodeRef}
                        style={style}
                        className={`flex gap-4 rounded-lg border border-line bg-white p-4 ${
                          isDragging ? "shadow-lg ring-1 ring-brand-blue-soft" : ""
                        }`}
                      >
                        <button
                          {...handleProps}
                          className="mt-1 h-fit cursor-grab touch-none rounded p-1 text-ink-faint hover:bg-slate-100 active:cursor-grabbing"
                          aria-label="Drag"
                        >
                          <AdminIcon name="grip" className="h-4 w-4" />
                        </button>
                        <ImageField
                          value={c.logo}
                          onChange={(v) => set(c.id, "logo", v)}
                          label="Logo"
                          boxClass="h-20 w-28"
                        />
                        <div className="grid flex-1 gap-3 sm:grid-cols-2">
                          <Field label="Name" value={c.name} onChange={(v) => set(c.id, "name", v)} />
                          <Field label="Role" value={c.role} onChange={(v) => set(c.id, "role", v)} />
                          <Field label="Period" value={c.period} onChange={(v) => set(c.id, "period", v)} />
                          <Field label="Location" value={c.location} onChange={(v) => set(c.id, "location", v)} />
                          <Field label="Website" value={c.website} placeholder="https://…" onChange={(v) => set(c.id, "website", v)} className="sm:col-span-2" />
                          <div className="sm:col-span-2">
                            <Field label="Description" textarea value={c.description} onChange={(v) => set(c.id, "description", v)} />
                          </div>
                          <div className="sm:col-span-2">
                            <Field
                              label="Highlights (one per line)"
                              textarea
                              value={c.highlights.join("\n")}
                              onChange={(v) => setHighlights(c.id, v)}
                              placeholder={"Micro-service Hospital ERP\nGovernment MIS\n…"}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCompanies((cs) => cs.filter((x) => x.id !== c.id))}
                          className="h-fit rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                          aria-label="Remove company"
                        >
                          <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                        </button>
                      </div>
                    )}
                  </SortableItem>
                ))}
              </div>
            </SortableList>

            <button
              type="button"
              onClick={() =>
                setCompanies((cs) => [
                  ...cs,
                  {
                    id: uid(),
                    logo: "",
                    name: "New company",
                    role: "",
                    period: "",
                    location: "",
                    website: "",
                    description: "",
                    highlights: [],
                  },
                ])
              }
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
            >
              <AdminIcon name="plus" className="h-4 w-4" />
              Add company
            </button>
          </BlockCard>
        </>
      )}
    </div>
  );
}
