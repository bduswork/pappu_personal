"use client";

import { useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import { SortableList, SortableItem } from "@/components/admin/Sortable";

type Client = { id: string; logo: string; name: string; link: string };
type Study = {
  id: string;
  image: string;
  client: string;
  title: string;
  summary: string;
  link: string;
};

const CLIENTS: Client[] = [
  { id: "cl1", logo: "", name: "GrameenPhone", link: "" },
  { id: "cl2", logo: "", name: "GETCO Telecom", link: "" },
  { id: "cl3", logo: "", name: "UMEME (Uganda)", link: "" },
  { id: "cl4", logo: "", name: "DPDC", link: "" },
  { id: "cl5", logo: "", name: "DESCO", link: "" },
  { id: "cl6", logo: "", name: "Fortune Securities", link: "" },
];

const STUDIES: Study[] = [
  { id: "s1", image: "", client: "GrameenPhone", title: "Telecom Roaming System", summary: "Built the roaming platform and UAT process for one of Asia's largest operators.", link: "" },
  { id: "s2", image: "", client: "UMEME, Uganda", title: "STS/CTS Prepaid Vending", summary: "Designed secure STS/CTS vending and Field Data Management for a national utility.", link: "" },
];

let clid = 7;
let sid = 3;

export default function CaseStudiesEditor() {
  const [headline, setHeadline] = useState("Clients & Case Studies");
  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [studies, setStudies] = useState<Study[]>(STUDIES);

  const setClient = (id: string, f: keyof Client, v: string) =>
    setClients((cs) => cs.map((c) => (c.id === id ? { ...c, [f]: v } : c)));
  const setStudy = (id: string, f: keyof Study, v: string) =>
    setStudies((ss) => ss.map((s) => (s.id === id ? { ...s, [f]: v } : s)));

  return (
    <div>
      <EditorHeader
        title="Edit: Clients & Case Studies"
        description="A client logo wall, plus detailed case-study cards."
        viewHref="/case-studies"
      />

      <BlockCard label="Banner">
        <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
          <ImageField value="" onChange={() => {}} label="Banner image" boxClass="aspect-video w-full" />
          <Field label="Headline" value={headline} onChange={setHeadline} />
        </div>
      </BlockCard>

      {/* Client logo wall */}
      <BlockCard label="Client logos" tone="slate" hint="logo · name · link">
        <div className="grid gap-3 sm:grid-cols-2">
          {clients.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-lg border border-line p-3">
              <ImageField value={c.logo} onChange={(v) => setClient(c.id, "logo", v)} label="Logo" boxClass="h-14 w-20" />
              <div className="flex-1 space-y-2">
                <Field label="Name" value={c.name} onChange={(v) => setClient(c.id, "name", v)} />
                <Field label="Link" value={c.link} placeholder="https://…" onChange={(v) => setClient(c.id, "link", v)} />
              </div>
              <button type="button" onClick={() => setClients((cs) => cs.filter((x) => x.id !== c.id))} className="h-fit rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500" aria-label="Remove client">
                <AdminIcon name="trash" className="h-[18px] w-[18px]" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setClients((cs) => [...cs, { id: `cl${clid++}`, logo: "", name: "New client", link: "" }])} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark">
          <AdminIcon name="plus" className="h-4 w-4" /> Add client
        </button>
      </BlockCard>

      {/* Case study cards */}
      <BlockCard label="Case studies" hint="drag to reorder">
        <SortableList
          ids={studies.map((s) => s.id)}
          onReorder={(ids) =>
            setStudies((ss) => {
              const by = new Map(ss.map((s) => [s.id, s]));
              return ids.map((i) => by.get(i)!).filter(Boolean);
            })
          }
        >
          <div className="space-y-3">
            {studies.map((s) => (
              <SortableItem key={s.id} id={s.id}>
                {({ setNodeRef, style, handleProps, isDragging }) => (
                  <div ref={setNodeRef} style={style} className={`flex gap-4 rounded-lg border border-line bg-white p-4 ${isDragging ? "shadow-lg ring-1 ring-brand-blue-soft" : ""}`}>
                    <button {...handleProps} className="mt-1 h-fit cursor-grab touch-none rounded p-1 text-ink-faint hover:bg-slate-100 active:cursor-grabbing" aria-label="Drag">
                      <AdminIcon name="grip" className="h-4 w-4" />
                    </button>
                    <ImageField value={s.image} onChange={(v) => setStudy(s.id, "image", v)} label="Image" boxClass="h-20 w-28" />
                    <div className="grid flex-1 gap-3 sm:grid-cols-2">
                      <Field label="Client" value={s.client} onChange={(v) => setStudy(s.id, "client", v)} />
                      <Field label="Title" value={s.title} onChange={(v) => setStudy(s.id, "title", v)} />
                      <div className="sm:col-span-2">
                        <Field label="Summary" textarea value={s.summary} onChange={(v) => setStudy(s.id, "summary", v)} />
                      </div>
                      <Field label="Link" value={s.link} placeholder="https://…" onChange={(v) => setStudy(s.id, "link", v)} className="sm:col-span-2" />
                    </div>
                    <button type="button" onClick={() => setStudies((ss) => ss.filter((x) => x.id !== s.id))} className="h-fit rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500" aria-label="Remove case study">
                      <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                    </button>
                  </div>
                )}
              </SortableItem>
            ))}
          </div>
        </SortableList>
        <button type="button" onClick={() => setStudies((ss) => [...ss, { id: `s${sid++}`, image: "", client: "", title: "New case study", summary: "", link: "" }])} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark">
          <AdminIcon name="plus" className="h-4 w-4" /> Add case study
        </button>
      </BlockCard>
    </div>
  );
}
