"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminIcon from "@/components/admin/AdminIcon";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Card, PageHeader, Toggle, btnPrimary } from "@/components/admin/ui";
import { withVenturesDefaults, type Venture } from "@/lib/ventures";

let seq = 0;

export default function VenturesList() {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<Venture | null>(null);

  useEffect(() => {
    fetch("/api/ventures")
      .then((r) => r.json())
      .then((d) => setVentures(withVenturesDefaults(d).ventures))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const persist = (next: Venture[]) => {
    setVentures(next);
    fetch("/api/ventures", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ventures: next }),
    }).catch(() => {});
  };

  const togglePublished = (id: string) =>
    persist(ventures.map((v) => (v.id === id ? { ...v, published: !v.published } : v)));
  const remove = (id: string) => persist(ventures.filter((v) => v.id !== id));

  const addVenture = () => {
    const base = "new-venture";
    let slug = base;
    let n = 1;
    while (ventures.some((v) => v.slug === slug)) slug = `${base}-${n++}`;
    const fresh: Venture = {
      id: `v-${Date.now().toString(36)}-${seq++}`,
      slug,
      name: "New Venture",
      tagline: "",
      hero: "",
      logo: "",
      about: "",
      website: "",
      gallery: [],
      ctaLabel: "Visit site",
      ctaLink: "",
      published: false,
    };
    persist([...ventures, fresh]);
  };

  return (
    <div>
      <PageHeader
        title="Ventures"
        description="Brand pages (Zariya Living, Heritique, AVA, …) listed in the sidebar Ventures pillar. Each is a hero, logo, about, gallery and a link."
        action={
          <button type="button" onClick={addVenture} className={btnPrimary}>
            <AdminIcon name="plus" className="h-4 w-4" />
            New venture
          </button>
        }
      />

      {loading ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : ventures.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="font-semibold text-ink">No ventures yet</p>
          <p className="mt-1 text-sm text-ink-faint">
            Click <span className="font-semibold text-ink-soft">New venture</span> to create one.
          </p>
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-line">
            {ventures.map((v) => (
              <li key={v.id} className={`flex items-center gap-4 px-4 py-3.5 ${v.published ? "" : "bg-slate-50/60"}`}>
                <div className="flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-ink-faint">
                  {v.logo || v.hero ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v.logo || v.hero} alt="" className="h-full w-full object-contain p-1" />
                  ) : (
                    <span className="text-sm font-extrabold">{(v.name.charAt(0) || "V").toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate font-semibold ${v.published ? "text-ink" : "text-ink-faint"}`}>
                    {v.name || "Untitled"}
                    {!v.published && (
                      <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-faint">
                        Hidden
                      </span>
                    )}
                  </p>
                  <p className="truncate text-[13px] text-ink-faint">/ventures/{v.slug}</p>
                </div>
                <Toggle checked={v.published} onChange={() => togglePublished(v.id)} label={`Publish ${v.name}`} />
                <Link href={`/admin/ventures/${v.slug}`} className="rounded-md px-2.5 py-1 text-xs font-semibold text-brand-blue hover:bg-brand-blue-tint">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => setPendingDelete(v)}
                  className="rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                  aria-label="Delete venture"
                >
                  <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <p className="mt-4 text-xs text-ink-faint">
        The <Link href="/admin/pages/ventures/invest" className="font-semibold text-brand-blue">Invest &amp; Partner</Link> page is
        managed separately (it&apos;s a pitch + partnership form).
      </p>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete venture"
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
