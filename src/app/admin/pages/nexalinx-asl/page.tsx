"use client";

import { useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import { SortableList, SortableItem } from "@/components/admin/Sortable";

type Company = {
  id: string;
  logo: string;
  name: string;
  role: string;
  period: string;
  location: string;
  website: string;
  description: string;
};

const INITIAL: Company[] = [
  {
    id: "c1",
    logo: "",
    name: "Nexalinx",
    role: "Chief Technology Officer",
    period: "2022 – Present",
    location: "Long Island City, NY · Gulshan, Dhaka",
    website: "",
    description:
      "SaaS platforms for healthcare and government — Hospital ERP and Government MIS on a micro-service architecture, HL7 & DICOM compliant.",
  },
  {
    id: "c2",
    logo: "",
    name: "Automation Services Ltd (ASL)",
    role: "Chief Executive Officer",
    period: "2020 – 2022",
    location: "South Badda, Dhaka",
    website: "",
    description:
      "Utility & telecom product company — AMI/MDM, Field Data Management, telecom billing and hospital management solutions delivered across multiple countries.",
  },
];

let cid = 3;

export default function NexalinxAslEditor() {
  const [headline, setHeadline] = useState("Nexalinx · ASL");
  const [intro, setIntro] = useState(
    "The companies I lead — building enterprise software for utilities, telecom and healthcare."
  );
  const [companies, setCompanies] = useState<Company[]>(INITIAL);

  const set = (id: string, field: keyof Company, value: string) =>
    setCompanies((cs) =>
      cs.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );

  return (
    <div>
      <EditorHeader
        title="Edit: Nexalinx · ASL"
        description="A banner, then a card per company (logo · name · role · description · link)."
        viewHref="/nexalinx-asl"
      />

      <BlockCard label="Banner">
        <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
          <ImageField value="" onChange={() => {}} label="Banner image" boxClass="aspect-video w-full" />
          <div className="space-y-4">
            <Field label="Headline" value={headline} onChange={setHeadline} />
            <Field label="Intro" textarea value={intro} onChange={setIntro} />
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
              { id: `c${cid++}`, logo: "", name: "New company", role: "", period: "", location: "", website: "", description: "" },
            ])
          }
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
        >
          <AdminIcon name="plus" className="h-4 w-4" />
          Add company
        </button>
      </BlockCard>
    </div>
  );
}
