"use client";

import { useEffect, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import { SortableList, SortableItem } from "@/components/admin/Sortable";
import { Card, PageHeader, Toggle, btnPrimary } from "@/components/admin/ui";
import {
  DEFAULT_SETTINGS,
  SOCIAL_PLATFORMS,
  withDefaults,
  type SiteSettings,
  type Pillar,
} from "@/lib/siteSettings";

let pillarSeq = 0;

function SectionCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-ink">{title}</h2>
        {hint && <p className="text-xs text-ink-faint">{hint}</p>}
      </div>
      {children}
    </Card>
  );
}

export default function SettingsPage() {
  const [s, setS] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setS(withDefaults(d)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof SiteSettings>(
    section: K,
    patch: Partial<SiteSettings[K]>
  ) {
    setS((prev) => ({ ...prev, [section]: { ...prev[section], ...patch } }));
  }

  // ── Home pillars (array) helpers ──
  const updatePillar = (id: string, patch: Partial<Pillar>) =>
    setS((prev) => ({
      ...prev,
      pillars: prev.pillars.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  const addPillar = () =>
    setS((prev) => ({
      ...prev,
      pillars: [
        ...prev.pillars,
        { id: `p-new-${pillarSeq++}`, brand: "", title: "", body: "", link: "", cta: "", accent: "blue" },
      ],
    }));
  const removePillar = (id: string) =>
    setS((prev) => ({ ...prev, pillars: prev.pillars.filter((p) => p.id !== id) }));
  const reorderPillars = (ids: string[]) =>
    setS((prev) => {
      const by = new Map(prev.pillars.map((p) => [p.id, p]));
      return { ...prev, pillars: ids.map((i) => by.get(i)).filter((p): p is Pillar => !!p) };
    });

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
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
      <PageHeader
        title="Site Settings"
        description="Global content — the home page, contact details, social links, newsletter and footer. Changes here affect the whole public site."
        action={
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm font-semibold text-brand-green">Saved ✓</span>
            )}
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
        <p className="text-sm text-ink-faint">Loading settings…</p>
      ) : (
        <div className="space-y-6">
          {/* ── Home banner ── */}
          <SectionCard title="Home banner" hint="The hero at the top of the home page.">
            <div className="mb-4">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Banner background
              </span>
              <div className="inline-flex rounded-lg border border-line p-0.5">
                {(["image", "video"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => update("home", { bannerType: t })}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                      s.home.bannerType === t
                        ? "bg-brand-green text-white"
                        : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    <AdminIcon name={t === "image" ? "media" : "videos"} className="h-4 w-4" />
                    {t === "image" ? "Image" : "YouTube video"}
                  </button>
                ))}
              </div>
            </div>

            {s.home.bannerType === "image" ? (
              <div className="max-w-md">
                <ImageField
                  value={s.home.bannerImage}
                  onChange={(v) => update("home", { bannerImage: v })}
                  label="Banner image"
                  boxClass="aspect-video w-full"
                />
              </div>
            ) : (
              <Field
                label="YouTube video URL"
                value={s.home.bannerVideo}
                onChange={(v) => update("home", { bannerVideo: v })}
                placeholder="https://youtube.com/watch?v=…  (plays muted behind the hero)"
              />
            )}

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow" value={s.home.eyebrow} onChange={(v) => update("home", { eyebrow: v })} />
              <div className="sm:col-span-2">
                <Field label="Headline" textarea rows={2} value={s.home.headline} onChange={(v) => update("home", { headline: v })} />
              </div>
              <div className="sm:col-span-2">
                <Field label="Subtitle" textarea value={s.home.subtitle} onChange={(v) => update("home", { subtitle: v })} />
              </div>
              <Field label="Primary button label" value={s.home.cta1Label} onChange={(v) => update("home", { cta1Label: v })} />
              <Field label="Primary button link" value={s.home.cta1Link} onChange={(v) => update("home", { cta1Link: v })} />
              <Field label="Secondary button label" value={s.home.cta2Label} onChange={(v) => update("home", { cta2Label: v })} />
              <Field label="Secondary button link" value={s.home.cta2Link} onChange={(v) => update("home", { cta2Link: v })} />
            </div>
          </SectionCard>

          {/* ── Home pillars ── */}
          <SectionCard title="Home pillars" hint="The brand cards on the home page. Drag to reorder.">
            <SortableList ids={s.pillars.map((p) => p.id)} onReorder={reorderPillars}>
              <div className="space-y-3">
                {s.pillars.map((p) => (
                  <SortableItem key={p.id} id={p.id}>
                    {({ setNodeRef, style, handleProps, isDragging }) => (
                      <div
                        ref={setNodeRef}
                        style={style}
                        className={`flex gap-3 rounded-lg border border-line bg-white p-4 ${
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
                        <div className="grid flex-1 gap-3 sm:grid-cols-2">
                          <Field label="Brand / eyebrow" value={p.brand} onChange={(v) => updatePillar(p.id, { brand: v })} />
                          <Field label="Title" value={p.title} onChange={(v) => updatePillar(p.id, { title: v })} />
                          <div className="sm:col-span-2">
                            <Field label="Description" textarea value={p.body} onChange={(v) => updatePillar(p.id, { body: v })} />
                          </div>
                          <Field label="Link" value={p.link} onChange={(v) => updatePillar(p.id, { link: v })} placeholder="/builds-software" />
                          <Field label="Button label" value={p.cta} onChange={(v) => updatePillar(p.id, { cta: v })} />
                          <label className="block">
                            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                              Accent
                            </span>
                            <select
                              value={p.accent}
                              onChange={(e) => updatePillar(p.id, { accent: e.target.value as "green" | "blue" })}
                              className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
                            >
                              <option value="blue">Blue</option>
                              <option value="green">Green</option>
                            </select>
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePillar(p.id)}
                          className="h-fit rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                          aria-label="Remove pillar"
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
              onClick={addPillar}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
            >
              <AdminIcon name="plus" className="h-4 w-4" /> Add pillar
            </button>
          </SectionCard>

          {/* ── Contact ── */}
          <SectionCard title="Contact details" hint="Shown on the Contact page and in the sidebar.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone" value={s.contact.phone} onChange={(v) => update("contact", { phone: v })} />
              <Field label="Email" value={s.contact.email} onChange={(v) => update("contact", { email: v })} />
              <div className="sm:col-span-2">
                <Field label="Address" value={s.contact.address} onChange={(v) => update("contact", { address: v })} />
              </div>
            </div>
          </SectionCard>

          {/* ── Social ── */}
          <SectionCard title="Social links" hint="Icons in the sidebar and footer link to these.">
            <div className="grid gap-3 sm:grid-cols-2">
              {SOCIAL_PLATFORMS.map((p) => (
                <Field
                  key={p}
                  label={p}
                  value={s.social[p] ?? ""}
                  onChange={(v) => update("social", { [p]: v })}
                  placeholder="https://…"
                />
              ))}
            </div>
          </SectionCard>

          {/* ── Newsletter ── */}
          <SectionCard title="Newsletter" hint="The signup band at the bottom of pages.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Heading" value={s.newsletter.heading} onChange={(v) => update("newsletter", { heading: v })} />
              <Field label="Provider endpoint" value={s.newsletter.provider} onChange={(v) => update("newsletter", { provider: v })} placeholder="Mailchimp / ConvertKit URL" />
            </div>
          </SectionCard>

          {/* ── Top banner ── */}
          <SectionCard title="Top banner" hint="The optional strip across the very top.">
            <label className="mb-4 flex items-center gap-2 text-sm font-medium text-ink">
              <Toggle
                checked={s.topBanner.enabled}
                onChange={() => update("topBanner", { enabled: !s.topBanner.enabled })}
                label="Enable top banner"
              />
              Show the top banner
            </label>
            {s.topBanner.enabled && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Text" value={s.topBanner.text} onChange={(v) => update("topBanner", { text: v })} placeholder="e.g. Check out the new book!" />
                <Field label="Link" value={s.topBanner.link} onChange={(v) => update("topBanner", { link: v })} placeholder="https://…" />
              </div>
            )}
          </SectionCard>

          {/* ── SEO & footer ── */}
          <SectionCard title="SEO & footer">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Default page title" value={s.seo.title} onChange={(v) => update("seo", { title: v })} />
              <Field label="Footer copyright" value={s.footer.copyright} onChange={(v) => update("footer", { copyright: v })} />
              <div className="sm:col-span-2">
                <Field label="Default meta description" textarea value={s.seo.description} onChange={(v) => update("seo", { description: v })} />
              </div>
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
