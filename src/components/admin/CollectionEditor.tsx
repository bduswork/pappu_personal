"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AdminIcon, { type IconName } from "./AdminIcon";
import ImageField from "./ImageField";
import Field from "./Field";
import RichTextEditor from "./RichTextEditor";
import { Card, PageHeader, StatusPill, btnPrimary, btnGhost } from "./ui";
import type { CollectionType } from "@/lib/collections";

export type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "date" | "image" | "richtext" | "select" | "checkbox";
  placeholder?: string;
  options?: string[];
  full?: boolean;
};

export type Item = Record<string, string | boolean>;

/**
 * Reusable collection manager: a list + an inline item editor generated from a
 * field schema. Every collection (Articles, Videos, Press, Events, Resources)
 * uses this so they stay consistent — pass fields + initial data + list config.
 */
export default function CollectionEditor({
  type,
  title,
  description,
  singular,
  appearsOn,
  fields,
  listTitleKey,
  listSubtitle,
  listImageKey,
  listImageFallback,
  listIcon = "articles",
  publishedKey = "published",
}: {
  type: CollectionType;
  title: string;
  description: string;
  singular: string;
  appearsOn: { label: string; href: string }[];
  fields: FieldDef[];
  listTitleKey: string;
  listSubtitle: (item: Item) => string;
  listImageKey?: string;
  /** Derive a thumbnail when listImageKey is empty (e.g. from a YouTube URL). */
  listImageFallback?: (item: Item) => string;
  listIcon?: IconName;
  publishedKey?: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const idRef = useRef(0);

  useEffect(() => {
    fetch(`/api/collections/${type}`)
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d.items) ? d.items : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [type]);

  const persist = (next: Item[]) => {
    setItems(next);
    fetch(`/api/collections/${type}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: next }),
    })
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      })
      .catch(() => {});
  };

  const upd = (key: string, value: string | boolean) =>
    setEditing((e) => (e ? { ...e, [key]: value } : e));

  function blank(): Item {
    // Time-based id so a new item never collides with an already-saved one.
    const o: Item = { id: `${type}-${Date.now().toString(36)}-${idRef.current++}` };
    for (const f of fields) {
      o[f.key] = f.type === "checkbox" ? false : f.type === "select" ? f.options?.[0] ?? "" : "";
    }
    return o;
  }

  function save() {
    if (!editing) return;
    const next = items.some((x) => x.id === editing.id)
      ? items.map((x) => (x.id === editing.id ? editing : x))
      : [...items, editing];
    persist(next);
    setEditing(null);
  }

  function renderField(f: FieldDef) {
    const v = editing?.[f.key];
    if (f.type === "text" || f.type === "url")
      return <Field label={f.label} value={String(v ?? "")} placeholder={f.placeholder} onChange={(x) => upd(f.key, x)} />;
    if (f.type === "textarea")
      return <Field label={f.label} textarea value={String(v ?? "")} placeholder={f.placeholder} onChange={(x) => upd(f.key, x)} />;
    if (f.type === "date")
      return (
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">{f.label}</span>
          <input type="date" value={String(v ?? "")} onChange={(e) => upd(f.key, e.target.value)} className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green" />
        </label>
      );
    if (f.type === "select")
      return (
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">{f.label}</span>
          <select value={String(v ?? "")} onChange={(e) => upd(f.key, e.target.value)} className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green">
            {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
      );
    if (f.type === "image")
      return (
        <div className="max-w-sm">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">{f.label}</span>
          <ImageField value={String(v ?? "")} onChange={(x) => upd(f.key, x)} label={f.label} boxClass="aspect-video w-full" />
        </div>
      );
    if (f.type === "richtext")
      return (
        <div>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">{f.label}</span>
          <RichTextEditor key={`${editing?.id}-${f.key}`} initialHTML={String(v ?? "")} onChange={(html) => upd(f.key, html)} />
        </div>
      );
    // checkbox
    return (
      <label className="flex items-center gap-2 text-sm font-medium text-ink">
        <input type="checkbox" checked={Boolean(v)} onChange={(e) => upd(f.key, e.target.checked)} className="h-4 w-4 accent-brand-green" />
        {f.label}
      </label>
    );
  }

  // ── Editor view ──
  if (editing) {
    const isNew = !items.some((x) => x.id === editing.id);
    return (
      <div>
        <button type="button" onClick={() => setEditing(null)} className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink">
          ← Back to {title}
        </button>
        <PageHeader
          title={isNew ? `New ${singular}` : `Edit ${singular}`}
          description={`These fields become the ${singular}'s card on the site.`}
          action={
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditing(null)} className={btnGhost}>Cancel</button>
              <button type="button" onClick={save} className={btnPrimary}>{isNew ? `Add ${singular}` : "Save"}</button>
            </div>
          }
        />
        <Card className="p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => {
              const span =
                f.full || ["textarea", "image", "richtext", "checkbox"].includes(f.type)
                  ? "sm:col-span-2"
                  : "";
              return (
                <div key={f.key} className={span}>
                  {renderField(f)}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  // ── List view ──
  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        action={
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm font-semibold text-brand-green">Saved ✓</span>}
            <button type="button" onClick={() => setEditing(blank())} className={btnPrimary}>
              <AdminIcon name="plus" className="h-4 w-4" />
              New {singular}
            </button>
          </div>
        }
      />

      {loading && <p className="text-sm text-ink-faint">Loading…</p>}

      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
        <AdminIcon name="external" className="h-4 w-4 text-ink-faint" />
        <span>Appears on:</span>
        {appearsOn.map((p) => (
          <Link key={p.href} href={p.href} className="rounded-full bg-brand-blue-tint px-2.5 py-0.5 text-xs font-semibold text-brand-blue-dark">
            {p.label}
          </Link>
        ))}
      </div>

      <Card>
        <ul className="divide-y divide-line">
          {items.map((item) => {
            const img =
              (listImageKey ? String(item[listImageKey] ?? "") : "") ||
              (listImageFallback ? listImageFallback(item) : "");
            return (
              <li key={String(item.id)} className="flex items-center gap-4 px-4 py-3">
                <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-ink-faint">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <AdminIcon name={listIcon} className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">
                    {String(item[listTitleKey] || `Untitled ${singular}`)}
                  </p>
                  <p className="truncate text-xs uppercase tracking-wide text-ink-faint">
                    {listSubtitle(item) || "—"}
                  </p>
                </div>
                <StatusPill variant={item[publishedKey] ? "published" : "inactive"}>
                  {item[publishedKey] ? "Live" : "Hidden"}
                </StatusPill>
                <div className="flex shrink-0 items-center gap-1 text-ink-faint">
                  <button type="button" onClick={() => setEditing({ ...item })} className="rounded-md px-2.5 py-1 text-xs font-semibold text-brand-blue hover:bg-brand-blue-tint">
                    Edit
                  </button>
                  <button type="button" onClick={() => persist(items.filter((x) => x.id !== item.id))} className="rounded-md p-1.5 hover:bg-red-50 hover:text-red-500" aria-label={`Delete ${singular}`}>
                    <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
