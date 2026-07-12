"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import BrandName from "@/components/BrandName";
import { Toggle } from "@/components/admin/ui";
import {
  withProgramsDefaults,
  type Program,
  type ProgramModule,
  type Snapshot,
} from "@/lib/programs";

let seq = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${seq++}`;

const pad2 = (n: number) => String(n).padStart(2, "0");
function isoToLocalInput(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
function localInputToIso(local: string): string {
  if (!local) return "";
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

const dateInput =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green";

export default function ProgramEditor() {
  const params = useParams();
  const routeSlug = String(params.slug ?? "");

  const [p, setP] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/programs")
      .then((r) => r.json())
      .then((d) => {
        const found = withProgramsDefaults(d).programs.find((x) => x.slug === routeSlug);
        setP(found ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [routeSlug]);

  const set = <K extends keyof Program>(key: K, value: Program[K]) =>
    setP((cur) => (cur ? { ...cur, [key]: value } : cur));

  const setModule = (id: string, f: keyof ProgramModule, v: string) =>
    setP((cur) =>
      cur ? { ...cur, modules: cur.modules.map((m) => (m.id === id ? { ...m, [f]: v } : m)) } : cur
    );
  const setSnapshot = (id: string, url: string) =>
    setP((cur) =>
      cur ? { ...cur, snapshots: cur.snapshots.map((s) => (s.id === id ? { ...s, url } : s)) } : cur
    );

  async function save() {
    if (!p) return;
    setSaving(true);
    setSaved(false);
    try {
      const current = await fetch("/api/programs")
        .then((r) => r.json())
        .then((d) => withProgramsDefaults(d).programs)
        .catch(() => [] as Program[]);
      const idx = current.findIndex((x) => x.id === p.id);
      const next = idx >= 0 ? current.map((x) => (x.id === p.id ? p : x)) : [...current, p];
      const res = await fetch("/api/programs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programs: next }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-ink-faint">Loading…</p>;
  }
  if (!p) {
    return (
      <div>
        <Link href="/admin/training" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink">
          ← Back to Programs &amp; Masterclasses
        </Link>
        <p className="rounded-lg border border-line bg-white p-6 text-ink-soft">
          Program not found. It may have been renamed or deleted.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/training" className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink">
        ← Back to Programs &amp; Masterclasses
      </Link>

      <EditorHeader
        title={`Edit program: ${p.name}`}
        description="Landing page (in the Programs dropdown) — hero, dates, themes, snapshots, and a Book-a-Session form."
        viewHref={`/training/${p.slug}`}
        onSave={save}
        saving={saving}
        saved={saved}
      />

      {/* Hero */}
      <BlockCard label="Hero">
        <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
          <ImageField value={p.hero} onChange={(v) => set("hero", v)} label="Hero image" boxClass="aspect-video w-full" />
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Field label="Program name" value={p.name} onChange={(v) => set("name", v)} />
                <p className="mt-1.5 text-xs text-ink-faint">
                  Shows as <BrandName name={p.name} className="text-sm font-bold text-ink" />
                  {" — type "}
                  <span className="font-semibold text-ink-soft">™</span> or{" "}
                  <span className="font-semibold text-ink-soft">(TM)</span> at the end.
                </p>
              </div>
              <Field label="Tagline" value={p.tagline} onChange={(v) => set("tagline", v)} />
            </div>
            <Field
              label="URL slug"
              value={p.slug}
              onChange={(v) => set("slug", v)}
              placeholder="force-progression"
            />
          </div>
        </div>
      </BlockCard>

      {/* Schedule & visibility */}
      <BlockCard label="Schedule & status" hint="drives the countdown and Upcoming / Ongoing / Finished">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Starts</span>
            <input
              type="datetime-local"
              className={dateInput}
              value={isoToLocalInput(p.startAt)}
              onChange={(e) => set("startAt", localInputToIso(e.target.value))}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Ends</span>
            <input
              type="datetime-local"
              className={dateInput}
              value={isoToLocalInput(p.endAt)}
              onChange={(e) => set("endAt", localInputToIso(e.target.value))}
            />
          </label>
        </div>
        <label className="mt-4 flex items-center gap-3 text-sm font-medium text-ink">
          <Toggle checked={p.published} onChange={() => set("published", !p.published)} label="Published" />
          {p.published ? "Published — live on the site & sidebar" : "Hidden from the site & sidebar"}
        </label>
      </BlockCard>

      {/* About */}
      <BlockCard label="About">
        <RichTextEditor initialHTML={p.about} onChange={(html) => set("about", html)} />
      </BlockCard>

      {/* Themes / curriculum */}
      <BlockCard label="What's inside" hint="main themes / curriculum">
        <div className="space-y-3">
          {p.modules.map((m) => (
            <div key={m.id} className="flex gap-3 rounded-lg border border-line p-4">
              <div className="flex-1 space-y-3">
                <Field label="Title" value={m.title} onChange={(v) => setModule(m.id, "title", v)} placeholder="F — Focus" />
                <Field label="Description" textarea value={m.description} onChange={(v) => setModule(m.id, "description", v)} />
              </div>
              <button
                type="button"
                onClick={() => set("modules", p.modules.filter((x) => x.id !== m.id))}
                className="h-fit rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                aria-label="Remove theme"
              >
                <AdminIcon name="trash" className="h-[18px] w-[18px]" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => set("modules", [...p.modules, { id: uid("m"), title: "", description: "" } as ProgramModule])}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
        >
          <AdminIcon name="plus" className="h-4 w-4" /> Add theme
        </button>
      </BlockCard>

      {/* Snapshots gallery */}
      <BlockCard label="Snapshots" hint="upload the program's slide images (English)">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {p.snapshots.map((s) => (
            <div key={s.id}>
              <ImageField value={s.url} onChange={(v) => setSnapshot(s.id, v)} label="Slide" boxClass="aspect-video w-full" />
              <button
                type="button"
                onClick={() => set("snapshots", p.snapshots.filter((x) => x.id !== s.id))}
                className="mt-1 flex w-full items-center justify-center gap-1 rounded-md border border-line py-1 text-xs font-medium text-ink-faint hover:border-red-300 hover:text-red-500"
              >
                <AdminIcon name="trash" className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => set("snapshots", [...p.snapshots, { id: uid("s"), url: "" } as Snapshot])}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
        >
          <AdminIcon name="plus" className="h-4 w-4" /> Add snapshot
        </button>
      </BlockCard>

      {/* Enroll */}
      <BlockCard label="Book-a-Session" hint="submissions arrive in Enrollments">
        <div className="max-w-xs">
          <Field label="Button label" value={p.enrollLabel} onChange={(v) => set("enrollLabel", v)} />
        </div>
        <p className="mt-3 text-xs text-ink-faint">
          The form collects name, email, WhatsApp and a message — they land in{" "}
          <Link href="/admin/enrollments" className="font-semibold text-brand-blue underline">
            Enrollments
          </Link>
          .
        </p>
      </BlockCard>
    </div>
  );
}
