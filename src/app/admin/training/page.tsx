"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminIcon from "@/components/admin/AdminIcon";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import BrandName from "@/components/BrandName";
import { Card, PageHeader, StatusPill, Toggle, btnPrimary } from "@/components/admin/ui";
import {
  programStatus,
  withProgramsDefaults,
  type Program,
  type ProgramStatus,
} from "@/lib/programs";

let seq = 0;

const STATUS_PILL: Record<Exclude<ProgramStatus, "NONE">, "draft" | "active" | "inactive"> = {
  UPCOMING: "draft",
  ONGOING: "active",
  FINISHED: "inactive",
};

export default function ProgramsList() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(0);
  const [pendingDelete, setPendingDelete] = useState<Program | null>(null);

  useEffect(() => {
    setNow(Date.now());
    fetch("/api/programs")
      .then((r) => r.json())
      .then((d) => setPrograms(withProgramsDefaults(d).programs))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const persist = (next: Program[]) => {
    setPrograms(next);
    fetch("/api/programs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programs: next }),
    }).catch(() => {});
  };

  const togglePublished = (id: string) =>
    persist(programs.map((p) => (p.id === id ? { ...p, published: !p.published } : p)));

  const remove = (id: string) => persist(programs.filter((p) => p.id !== id));

  const addProgram = () => {
    const base = "new-program";
    let slug = base;
    let n = 1;
    while (programs.some((p) => p.slug === slug)) slug = `${base}-${n++}`;
    const fresh: Program = {
      id: `p-${Date.now().toString(36)}-${seq++}`,
      slug,
      name: "New Program",
      tagline: "",
      hero: "",
      about: "",
      startAt: "",
      endAt: "",
      enrollLabel: "Enquire Now",
      modules: [],
      snapshots: [],
      published: false,
    };
    persist([...programs, fresh]);
  };

  return (
    <div>
      <PageHeader
        title="Programs & Master Classes"
        description="Each program is a landing page (listed in the sidebar dropdown) with a live countdown, status, curriculum, snapshots and a Book-a-Session form."
        action={
          <button type="button" onClick={addProgram} className={btnPrimary}>
            <AdminIcon name="plus" className="h-4 w-4" />
            New program
          </button>
        }
      />

      {loading ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : programs.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="font-semibold text-ink">No programs yet</p>
          <p className="mt-1 text-sm text-ink-faint">
            Click <span className="font-semibold text-ink-soft">New program</span> to create one.
          </p>
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-line">
            {programs.map((p) => {
              const status = programStatus(p, now);
              return (
                <li key={p.id} className={`flex items-center gap-4 px-4 py-3.5 ${p.published ? "" : "bg-slate-50/60"}`}>
                  <AdminIcon name="training" className="h-5 w-5 shrink-0 text-brand-green" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`truncate font-semibold ${p.published ? "text-ink" : "text-ink-faint"}`}>
                        <BrandName name={p.name || "Untitled"} />
                      </p>
                      {status !== "NONE" && (
                        <StatusPill variant={STATUS_PILL[status]}>{status}</StatusPill>
                      )}
                      {!p.published && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-faint">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="truncate text-[13px] text-ink-faint">/training/{p.slug}</p>
                  </div>

                  <Toggle
                    checked={p.published}
                    onChange={() => togglePublished(p.id)}
                    label={`Publish ${p.name}`}
                  />
                  <Link
                    href={`/admin/training/${p.slug}`}
                    className="rounded-md px-2.5 py-1 text-xs font-semibold text-brand-blue hover:bg-brand-blue-tint"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(p)}
                    className="rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                    aria-label="Delete program"
                  >
                    <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <p className="mt-4 text-xs text-ink-faint">
        Toggling a program off hides it from the sidebar and its public page. Status
        (Upcoming / Ongoing / Finished) comes from the program&apos;s start &amp; end dates.
      </p>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete program"
        message={pendingDelete ? `Delete "${pendingDelete.name}"? This can't be undone.` : ""}
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) remove(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
