"use client";

import { useEffect, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Card, PageHeader, btnGhost } from "@/components/admin/ui";
import type { Subscriber } from "@/lib/subscribers";

function when(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function SubscribersPage() {
  const [items, setItems] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<Subscriber | null>(null);

  useEffect(() => {
    fetch("/api/subscribers")
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d.subscribers) ? d.subscribers : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const remove = (id: string) => {
    setItems((xs) => xs.filter((x) => x.id !== id));
    fetch(`/api/subscribers?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
  };

  function exportCsv() {
    const rows = [["email", "subscribed_at"], ...items.map((s) => [s.email, s.createdAt])];
    const csv = rows.map((r) => r.map((c) => `"${(c || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader
        title="Subscribers"
        description="People who signed up for the newsletter via the Sign up form on the home page."
        action={
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <span className="rounded-full bg-brand-green-soft px-3 py-1 text-sm font-semibold text-brand-green-dark">
                {items.length} {items.length === 1 ? "subscriber" : "subscribers"}
              </span>
            )}
            {items.length > 0 && (
              <button type="button" onClick={exportCsv} className={btnGhost}>
                <AdminIcon name="external" className="h-4 w-4" />
                Export CSV
              </button>
            )}
          </div>
        }
      />

      {loading ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : items.length === 0 ? (
        <Card className="p-10 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-ink-faint">
            <AdminIcon name="mail" className="h-6 w-6" />
          </span>
          <p className="mt-3 font-semibold text-ink">No subscribers yet</p>
          <p className="mt-1 text-sm text-ink-faint">
            Newsletter signups from the home page will show up here.
          </p>
        </Card>
      ) : (
        <Card className="divide-y divide-line">
          {items.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-5 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue-tint text-brand-blue-dark">
                <AdminIcon name="mail" className="h-4 w-4" />
              </span>
              <a href={`mailto:${s.email}`} className="min-w-0 flex-1 truncate text-sm font-medium text-brand-blue hover:underline">
                {s.email}
              </a>
              <span className="shrink-0 text-xs text-ink-faint">{when(s.createdAt)}</span>
              <button
                type="button"
                onClick={() => setPendingDelete(s)}
                className="shrink-0 rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                aria-label="Remove subscriber"
              >
                <AdminIcon name="trash" className="h-[18px] w-[18px]" />
              </button>
            </div>
          ))}
        </Card>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Remove subscriber"
        message={pendingDelete ? `Remove ${pendingDelete.email} from the list?` : ""}
        confirmLabel="Remove"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) remove(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
