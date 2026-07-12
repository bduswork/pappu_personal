"use client";

import { useEffect, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Card, PageHeader, StatusPill } from "@/components/admin/ui";

type Status = "NEW" | "CONTACTED" | "ENROLLED";
type Enrollment = {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  message: string | null;
  programName: string | null;
  status: Status;
  createdAt: string;
};

const PILL: Record<Status, "draft" | "blue" | "active"> = {
  NEW: "draft",
  CONTACTED: "blue",
  ENROLLED: "active",
};
const NEXT: Record<Status, Status> = {
  NEW: "CONTACTED",
  CONTACTED: "ENROLLED",
  ENROLLED: "NEW",
};

function when(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EnrollmentsPage() {
  const [items, setItems] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<Enrollment | null>(null);

  useEffect(() => {
    fetch("/api/enrollments")
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d.enrollments) ? d.enrollments : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cycle = (e: Enrollment) => {
    const status = NEXT[e.status];
    setItems((xs) => xs.map((x) => (x.id === e.id ? { ...x, status } : x)));
    fetch("/api/enrollments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: e.id, status }),
    }).catch(() => {});
  };
  const remove = (id: string) => {
    setItems((xs) => xs.filter((x) => x.id !== id));
    fetch(`/api/enrollments?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
  };

  const news = items.filter((x) => x.status === "NEW").length;

  return (
    <div>
      <PageHeader
        title="Enrollments"
        description="Book-a-Session submissions from program pages. Reach out on WhatsApp and track status (NEW → CONTACTED → ENROLLED)."
        action={
          news > 0 ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
              {news} new
            </span>
          ) : undefined
        }
      />

      {loading ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : items.length === 0 ? (
        <Card className="p-10 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-ink-faint">
            <AdminIcon name="enrollments" className="h-6 w-6" />
          </span>
          <p className="mt-3 font-semibold text-ink">No enrollments yet</p>
          <p className="mt-1 text-sm text-ink-faint">
            Book-a-Session submissions will show up here.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((e) => (
            <Card key={e.id} className={`p-5 ${e.status === "NEW" ? "border-l-4 border-l-brand-green" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-ink">{e.name}</p>
                    <button type="button" onClick={() => cycle(e)} title="Click to advance status" className="rounded-full">
                      <StatusPill variant={PILL[e.status]}>{e.status}</StatusPill>
                    </button>
                    {e.programName && (
                      <span className="rounded-full bg-brand-blue-tint px-2.5 py-0.5 text-[11px] font-semibold text-brand-blue-dark">
                        {e.programName}
                      </span>
                    )}
                  </div>
                  <a href={`mailto:${e.email}`} className="text-sm text-brand-blue hover:underline">
                    {e.email}
                  </a>
                  {e.whatsapp && (
                    <a
                      href={`https://wa.me/${e.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 inline-flex items-center gap-1 text-sm font-medium text-brand-green hover:underline"
                    >
                      <AdminIcon name="external" className="h-3.5 w-3.5" />
                      {e.whatsapp}
                    </a>
                  )}
                </div>
                <span className="shrink-0 text-xs text-ink-faint">{when(e.createdAt)}</span>
              </div>

              {e.message && (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{e.message}</p>
              )}

              <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
                <button
                  type="button"
                  onClick={() => cycle(e)}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-brand-blue hover:text-brand-blue"
                >
                  Mark {NEXT[e.status].toLowerCase()}
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(e)}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-faint hover:bg-red-50 hover:text-red-500"
                >
                  <AdminIcon name="trash" className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete enrollment"
        message={pendingDelete ? `Delete the enrollment from ${pendingDelete.name}?` : ""}
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
