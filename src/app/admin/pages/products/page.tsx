"use client";

import { useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import { SortableList, SortableItem } from "@/components/admin/Sortable";

type Product = {
  id: string;
  image: string;
  name: string;
  category: string;
  description: string;
  link: string;
};

const INITIAL: Product[] = [
  { id: "p1", image: "", name: "Hospital ERP", category: "Healthcare", description: "Micro-service Hospital ERP with HL7 & DICOM support.", link: "" },
  { id: "p2", image: "", name: "Government MIS", category: "Government", description: "SaaS management information system for government operations.", link: "" },
  { id: "p3", image: "", name: "Unified Prepayment / AMI", category: "Utility", description: "Advanced Metering Infrastructure with STS, DLMS/COSEM and IDIS.", link: "" },
  { id: "p4", image: "", name: "Meter Data Management (MDM)", category: "Utility", description: "Centralized meter data collection, validation and analytics.", link: "" },
  { id: "p5", image: "", name: "Telecom ICX Billing", category: "Telecom", description: "International Carrier Exchange billing and mediation.", link: "" },
  { id: "p6", image: "", name: "Broker Securities System", category: "Finance", description: "Back-office, online trading and community platform.", link: "" },
];

let pid = 7;

export default function ProductsEditor() {
  const [headline, setHeadline] = useState("Products & Platforms");
  const [intro, setIntro] = useState(
    "Systems and platforms I've designed and shipped across utility, telecom, healthcare and finance."
  );
  const [items, setItems] = useState<Product[]>(INITIAL);

  const set = (id: string, field: keyof Product, value: string) =>
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, [field]: value } : x)));

  return (
    <div>
      <EditorHeader
        title="Edit: Products & Platforms"
        description="A banner, then a grid of product cards (image · name · category · description · link)."
        viewHref="/products"
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

      <BlockCard label="Products" hint="drag to reorder">
        <SortableList
          ids={items.map((p) => p.id)}
          onReorder={(ids) =>
            setItems((xs) => {
              const by = new Map(xs.map((x) => [x.id, x]));
              return ids.map((i) => by.get(i)!).filter(Boolean);
            })
          }
        >
          <div className="space-y-3">
            {items.map((p) => (
              <SortableItem key={p.id} id={p.id}>
                {({ setNodeRef, style, handleProps, isDragging }) => (
                  <div
                    ref={setNodeRef}
                    style={style}
                    className={`flex gap-4 rounded-lg border border-line bg-white p-4 ${
                      isDragging ? "shadow-lg ring-1 ring-brand-blue-soft" : ""
                    }`}
                  >
                    <button {...handleProps} className="mt-1 h-fit cursor-grab touch-none rounded p-1 text-ink-faint hover:bg-slate-100 active:cursor-grabbing" aria-label="Drag">
                      <AdminIcon name="grip" className="h-4 w-4" />
                    </button>
                    <ImageField value={p.image} onChange={(v) => set(p.id, "image", v)} label="Image" boxClass="h-20 w-28" />
                    <div className="grid flex-1 gap-3 sm:grid-cols-2">
                      <Field label="Name" value={p.name} onChange={(v) => set(p.id, "name", v)} />
                      <Field label="Category" value={p.category} onChange={(v) => set(p.id, "category", v)} />
                      <div className="sm:col-span-2">
                        <Field label="Description" textarea value={p.description} onChange={(v) => set(p.id, "description", v)} />
                      </div>
                      <Field label="Link" value={p.link} placeholder="https://…" onChange={(v) => set(p.id, "link", v)} className="sm:col-span-2" />
                    </div>
                    <button type="button" onClick={() => setItems((xs) => xs.filter((x) => x.id !== p.id))} className="h-fit rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500" aria-label="Remove product">
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
          onClick={() => setItems((xs) => [...xs, { id: `p${pid++}`, image: "", name: "New product", category: "", description: "", link: "" }])}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
        >
          <AdminIcon name="plus" className="h-4 w-4" />
          Add product
        </button>
      </BlockCard>
    </div>
  );
}
