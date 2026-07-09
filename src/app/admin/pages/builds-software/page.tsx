"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminIcon from "@/components/admin/AdminIcon";
import ImageField from "@/components/admin/ImageField";
import { Card, PageHeader, btnPrimary, btnGhost } from "@/components/admin/ui";
import {
  DEFAULT_BUILDS_SOFTWARE,
  withBuildsDefaults,
  type CompanyCard,
  type Group,
} from "@/lib/pages/buildsSoftware";

let seq = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${seq++}`;

function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full resize-y rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
        />
      )}
    </label>
  );
}

export default function BuildsSoftwareEditor() {
  const [banner, setBanner] = useState(DEFAULT_BUILDS_SOFTWARE.banner);
  const [groups, setGroups] = useState<Group[]>(DEFAULT_BUILDS_SOFTWARE.groups);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/pages/builds-software")
      .then((r) => r.json())
      .then((d) => {
        const c = withBuildsDefaults(d);
        setBanner(c.banner);
        setGroups(c.groups);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setG = (id: string, fn: (g: Group) => Group) =>
    setGroups((gs) => gs.map((g) => (g.id === id ? fn(g) : g)));

  const updateCard = (
    gId: string,
    cId: string,
    field: keyof CompanyCard,
    value: string
  ) =>
    setG(gId, (g) => ({
      ...g,
      cards: g.cards.map((c) => (c.id === cId ? { ...c, [field]: value } : c)),
    }));

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/pages/builds-software", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banner, groups }),
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
      <Link
        href="/admin/pages"
        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink"
      >
        ← Back to Pages
      </Link>

      <PageHeader
        title="Edit: Builds Software"
        description="A banner, then role-grouped company cards (logo · title · description · badge)."
        action={
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm font-semibold text-brand-green">
                Saved ✓
              </span>
            )}
            <Link href="/builds-software" target="_blank" className={btnGhost}>
              <AdminIcon name="external" className="h-4 w-4" />
              View page
            </Link>
            <button
              type="button"
              onClick={save}
              disabled={saving || loading}
              className={`${btnPrimary} disabled:opacity-60`}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        }
      />

      {loading ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : (
        <>
          <p className="mb-5 rounded-lg border border-brand-blue-soft bg-brand-blue-tint px-3 py-2 text-xs text-brand-blue-dark">
            Choose a file and it uploads to your site instantly (stored in the
            database), or paste an image URL. Logos are optional.
          </p>

          {/* ── Banner block ─────────────────────────────── */}
          <Card className="mb-6 p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded bg-brand-blue-tint px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-blue-dark">
                Banner
              </span>
            </div>
            <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
              <ImageField
                value={banner.image}
                onChange={(v) => setBanner((b) => ({ ...b, image: v }))}
                label="Banner image"
                boxClass="aspect-video w-full"
              />
              <div className="space-y-4">
                <Field
                  label="Headline / quote"
                  value={banner.headline}
                  onChange={(v) => setBanner((b) => ({ ...b, headline: v }))}
                />
                <Field
                  label="Intro paragraph"
                  textarea
                  value={banner.intro}
                  onChange={(v) => setBanner((b) => ({ ...b, intro: v }))}
                />
              </div>
            </div>
          </Card>

          {/* ── Role groups ──────────────────────────────── */}
          {groups.map((group) => (
            <Card key={group.id} className="mb-6 p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-700">
                  Group
                </span>
                <input
                  value={group.heading}
                  onChange={(e) =>
                    setG(group.id, (g) => ({ ...g, heading: e.target.value }))
                  }
                  className="flex-1 rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-ink outline-none focus:border-brand-green"
                />
                <button
                  type="button"
                  onClick={() =>
                    setGroups((gs) => gs.filter((g) => g.id !== group.id))
                  }
                  className="rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                  aria-label="Remove group"
                >
                  <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                </button>
              </div>

              <div className="space-y-3">
                {group.cards.map((card) => (
                  <div
                    key={card.id}
                    className="flex gap-4 rounded-lg border border-line p-4"
                  >
                    <ImageField
                      value={card.logo}
                      onChange={(v) => updateCard(group.id, card.id, "logo", v)}
                      label="Logo (optional)"
                      boxClass="h-20 w-28"
                    />
                    <div className="grid flex-1 gap-3 sm:grid-cols-2">
                      <Field
                        label="Title"
                        value={card.title}
                        onChange={(v) => updateCard(group.id, card.id, "title", v)}
                      />
                      <Field
                        label="Badge (date / note)"
                        value={card.badge}
                        placeholder="e.g. 2022 – Present, or Acquired by…"
                        onChange={(v) => updateCard(group.id, card.id, "badge", v)}
                      />
                      <div className="sm:col-span-2">
                        <Field
                          label="Description"
                          textarea
                          value={card.description}
                          onChange={(v) =>
                            updateCard(group.id, card.id, "description", v)
                          }
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Field
                          label="Link (optional)"
                          value={card.link}
                          placeholder="https://…"
                          onChange={(v) => updateCard(group.id, card.id, "link", v)}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setG(group.id, (g) => ({
                          ...g,
                          cards: g.cards.filter((c) => c.id !== card.id),
                        }))
                      }
                      className="self-start rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                      aria-label="Remove card"
                    >
                      <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setG(group.id, (g) => ({
                    ...g,
                    cards: [
                      ...g.cards,
                      {
                        id: uid("c"),
                        title: "New company",
                        description: "",
                        badge: "",
                        link: "",
                        logo: "",
                      },
                    ],
                  }))
                }
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
              >
                <AdminIcon name="plus" className="h-4 w-4" />
                Add card
              </button>
            </Card>
          ))}

          <button
            type="button"
            onClick={() =>
              setGroups((gs) => [
                ...gs,
                { id: uid("g"), heading: "New Role", cards: [] },
              ])
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-brand-green hover:text-brand-green"
          >
            <AdminIcon name="plus" className="h-4 w-4" />
            Add role group
          </button>
        </>
      )}
    </div>
  );
}
