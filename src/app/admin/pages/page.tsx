"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NAV_SECTIONS, CONTACT_LINK } from "@/lib/navigation";
import {
  withCustomPagesDefaults,
  uniqueSlug,
  type CustomPage,
  type CustomPageSection,
} from "@/lib/customPages";
import AdminIcon from "@/components/admin/AdminIcon";
import { SortableList, SortableItem } from "@/components/admin/Sortable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusToggle from "@/components/admin/StatusToggle";
import { Card, PageHeader, btnGhost, btnPrimary } from "@/components/admin/ui";
import {
  statusOf,
  withStatusDefaults,
  type PageStatus,
  type PageStatusMap,
} from "@/lib/pageStatus";

type Entry =
  | {
      kind: "page";
      id: string;
      label: string;
      href: string;
      /** Admin-created page (deletable, edited via the custom editor). */
      custom?: boolean;
      slug?: string;
    }
  | { kind: "programs"; id: string; label: string; count: number };

type Section = {
  id: string;
  key: string;
  title: string;
  tagline: string;
  accent: "green" | "blue";
  entries: Entry[];
};

// Editors that exist so far — others show a muted "Edit blocks".
const EDITORS: Record<string, string> = {
  "/builds-software": "/admin/pages/builds-software",
  "/my-story": "/admin/pages/my-story",
  "/nexalinx-asl": "/admin/pages/nexalinx-asl",
  "/products": "/admin/pages/products",
  "/case-studies": "/admin/pages/case-studies",
  "/press-kit": "/admin/pages/press-kit",
  "/speaking": "/admin/pages/speaking",
  "/the-book": "/admin/pages/the-book",
  "/blog": "/admin/pages/blog",
  "/podcast": "/admin/pages/podcast",
  "/resources": "/admin/pages/resources",
  // Brand ventures are managed at /admin/ventures (dynamic list); only the
  // fixed Invest & Partner page is edited from the Pages list.
  "/ventures/invest": "/admin/pages/ventures/invest",
};

// Which collection a page pulls from (label only).
const PULLS: Record<string, string> = {
  "/press-kit": "Press",
  "/speaking": "Events",
  "/blog": "Articles",
  "/podcast": "Videos",
  "/resources": "Resources",
};

// Build the admin structure straight from the public sidebar data, so the two
// always match: section links → programs dropdown → links after.
const INITIAL: Section[] = NAV_SECTIONS.map((s, si) => ({
  id: `s${si}`,
  key: s.key,
  title: s.title,
  tagline: s.tagline,
  accent: s.accent,
  entries: [
    ...s.links.map((l, i) => ({
      kind: "page" as const,
      id: `${si}-l${i}`,
      label: l.label,
      href: l.href,
    })),
    ...(s.training
      ? [
          {
            kind: "programs" as const,
            id: `${si}-prog`,
            label: s.training.label,
            count: s.training.programs.length,
          },
        ]
      : []),
    ...(s.linksAfter?.map((l, i) => ({
      kind: "page" as const,
      id: `${si}-a${i}`,
      label: l.label,
      href: l.href,
    })) ?? []),
  ],
}));

let nid = 100;

/** Rebuild the section list from the code sections + admin-created pages
 *  (appended to their assigned section). Idempotent — safe to re-run. */
function mergeCustom(pages: CustomPage[]): Section[] {
  return INITIAL.map((s) => ({
    ...s,
    entries: [
      ...s.entries,
      ...pages
        .filter((p) => p.section === s.key)
        .map(
          (p): Entry => ({
            kind: "page",
            id: `cp-${p.id}`,
            label: p.label,
            href: `/${p.slug}`,
            custom: true,
            slug: p.slug,
          })
        ),
    ],
  }));
}

async function fetchCustomPages(): Promise<CustomPage[]> {
  return withCustomPagesDefaults(
    await fetch("/api/custom-pages").then((r) => r.json())
  ).pages;
}

export default function PagesList() {
  const [sections, setSections] = useState<Section[]>(INITIAL);
  const [statusMap, setStatusMap] = useState<PageStatusMap>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    sid: string;
    id: string;
    label: string;
    custom?: boolean;
    slug?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/page-status")
      .then((r) => r.json())
      .then((d) => setStatusMap(withStatusDefaults(d)))
      .catch(() => {});
    // Merge admin-created pages into the list.
    fetchCustomPages()
      .then((pages) => setSections(mergeCustom(pages)))
      .catch(() => {});
  }, []);

  const setStatus = (href: string, value: PageStatus) => {
    setStatusMap((m) => ({ ...m, [href]: value }));
    setDirty(true);
    setSaved(false);
  };

  async function saveStatus() {
    setSaving(true);
    try {
      const res = await fetch("/api/page-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statusMap),
      });
      if (res.ok) {
        setStatusMap(withStatusDefaults(await res.json()));
        setDirty(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  const updateSection = (sid: string, fn: (s: Section) => Section) =>
    setSections((ss) => ss.map((s) => (s.id === sid ? fn(s) : s)));

  const reorderSection = (sid: string, newIds: string[]) =>
    updateSection(sid, (s) => {
      const byId = new Map(s.entries.map((e) => [e.id, e]));
      return {
        ...s,
        entries: newIds.map((id) => byId.get(id)).filter((e): e is Entry => !!e),
      };
    });

  // Create a real, persisted custom page in the given section, then show it.
  async function addPage(section: Section) {
    const label = "New Page";
    const latest = await fetchCustomPages();
    const slug = uniqueSlug(label, new Set(latest.map((p) => p.slug)));
    const page: CustomPage = {
      id: `cp-${nid++}-${Date.now().toString(36)}`,
      slug,
      label,
      section: section.key as CustomPageSection,
      banner: { image: "", headline: "" },
      body: "",
    };
    await fetch("/api/custom-pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pages: [...latest, page] }),
    });
    updateSection(section.id, (s) => ({
      ...s,
      entries: [
        ...s.entries,
        { kind: "page", id: `cp-${page.id}`, label, href: `/${slug}`, custom: true, slug },
      ],
    }));
  }

  // Remove a persisted custom page by slug (read-modify-write).
  async function deleteCustom(slug: string) {
    const latest = await fetchCustomPages();
    await fetch("/api/custom-pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pages: latest.filter((p) => p.slug !== slug) }),
    });
  }

  const removeEntry = (sid: string, id: string) =>
    updateSection(sid, (s) => ({
      ...s,
      entries: s.entries.filter((e) => e.id !== id),
    }));

  return (
    <div>
      <PageHeader
        title="Pages"
        description="Your public sidebar. Reorder pages, add submenu items, and open one to edit its blocks — changes here mirror the live site."
        action={
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm font-semibold text-brand-green">Saved ✓</span>
            )}
            {dirty && !saved && (
              <span className="text-sm font-medium text-amber-600">
                Unsaved changes
              </span>
            )}
            <Link href="/admin/sections" className={btnGhost}>
              <AdminIcon name="sections" className="h-4 w-4" />
              Manage sections
            </Link>
            <button
              type="button"
              onClick={saveStatus}
              disabled={saving || !dirty}
              className={`${btnPrimary} disabled:opacity-50`}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        }
      />

      <p className="mb-5 text-xs text-ink-faint">
        Use the{" "}
        <span className="font-semibold text-brand-green-dark">Published</span> /{" "}
        <span className="font-semibold text-amber-700">Draft</span> switch on each
        page to control whether it&apos;s live on the public site, then Save. A
        draft page is hidden from the sidebar and returns a 404.
      </p>

      <div className="space-y-6">
        {sections.map((section) => {
          const pageCount = section.entries.filter(
            (e) => e.kind === "page"
          ).length;
          return (
            <Card key={section.id} className="overflow-hidden">
              {/* Section header (pillar) */}
              <div className="flex items-center gap-3 border-b border-line bg-slate-50 px-4 py-3">
                <span
                  className={`h-3 w-3 rounded-full ${
                    section.accent === "green"
                      ? "bg-brand-green"
                      : "bg-brand-blue"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-bold uppercase tracking-wide text-ink">
                    {section.title}
                  </p>
                  <p className="text-[11px] uppercase tracking-wide text-ink-faint">
                    {section.tagline}
                  </p>
                </div>
                <span className="text-xs text-ink-faint">
                  {pageCount} {pageCount === 1 ? "page" : "pages"}
                </span>
              </div>

              {/* Entries — drag to reorder */}
              <SortableList
                ids={section.entries.map((e) => e.id)}
                onReorder={(ids) => reorderSection(section.id, ids)}
              >
                <ul className="divide-y divide-line">
                  {section.entries.map((entry) => (
                    <SortableItem key={entry.id} id={entry.id}>
                      {({ setNodeRef, style, handleProps, isDragging }) => (
                        <li
                          ref={setNodeRef}
                          style={style}
                          className={`flex items-center gap-3 px-4 py-2.5 ${
                            entry.kind === "programs"
                              ? "bg-brand-green-tint/50"
                              : "bg-white"
                          } ${
                            isDragging
                              ? "shadow-lg ring-1 ring-brand-blue-soft"
                              : ""
                          }`}
                        >
                          <button
                            {...handleProps}
                            className="cursor-grab touch-none rounded p-1 text-ink-faint hover:bg-slate-100 hover:text-ink active:cursor-grabbing"
                            aria-label="Drag to reorder"
                          >
                            <AdminIcon name="grip" className="h-4 w-4" />
                          </button>

                          {entry.kind === "programs" ? (
                            <>
                              <AdminIcon
                                name="training"
                                className="h-5 w-5 text-brand-green"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-2 font-semibold text-ink">
                                  {entry.label}
                                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-green-dark">
                                    Dropdown
                                  </span>
                                </p>
                                <p className="text-xs text-ink-faint">
                                  {entry.count} program
                                  {entry.count === 1 ? "" : "s"}
                                </p>
                              </div>
                              <Link
                                href="/admin/training"
                                className="rounded-md px-2.5 py-1 text-xs font-semibold text-brand-green-dark hover:bg-brand-green-soft"
                              >
                                Manage programs →
                              </Link>
                            </>
                          ) : (
                            <>
                              <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-2 font-semibold text-ink">
                                  {entry.label}
                                  {entry.custom && (
                                    <span className="rounded-full bg-brand-green-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-green-dark">
                                      Custom
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-ink-faint">
                                  {entry.href}
                                  {PULLS[entry.href] && (
                                    <span className="ml-2 text-brand-blue">
                                      pulls from → {PULLS[entry.href]}
                                    </span>
                                  )}
                                </p>
                              </div>
                              <StatusToggle
                                value={statusOf(statusMap, entry.href)}
                                onChange={(v) => setStatus(entry.href, v)}
                              />
                              {entry.custom ? (
                                <Link
                                  href={`/admin/pages/custom/${entry.slug}`}
                                  className="rounded-md px-2.5 py-1 text-xs font-semibold text-brand-blue hover:bg-brand-blue-tint"
                                >
                                  Edit
                                </Link>
                              ) : EDITORS[entry.href] ? (
                                <Link
                                  href={EDITORS[entry.href]}
                                  className="rounded-md px-2.5 py-1 text-xs font-semibold text-brand-blue hover:bg-brand-blue-tint"
                                >
                                  Edit blocks
                                </Link>
                              ) : (
                                <span
                                  className="cursor-default rounded-md px-2.5 py-1 text-xs font-semibold text-ink-faint"
                                  title="Editor coming soon"
                                >
                                  Edit blocks
                                </span>
                              )}
                              {entry.custom ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPendingDelete({
                                      sid: section.id,
                                      id: entry.id,
                                      label: entry.label,
                                      custom: true,
                                      slug: entry.slug,
                                    })
                                  }
                                  className="rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                                  aria-label="Delete page"
                                >
                                  <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                                </button>
                              ) : (
                                // Built-in pages can't be deleted — keep spacing aligned.
                                <span className="w-[30px]" aria-hidden />
                              )}
                            </>
                          )}
                        </li>
                      )}
                    </SortableItem>
                  ))}
                </ul>
              </SortableList>

              {/* Add page to this section */}
              <button
                type="button"
                onClick={() => addPage(section)}
                className="flex w-full items-center gap-2 border-t border-line px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-slate-50 hover:text-brand-green"
              >
                <AdminIcon name="plus" className="h-4 w-4" />
                Add page to {section.title}
              </button>
            </Card>
          );
        })}

        {/* Global standalone link (Contact) */}
        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 border-b border-line bg-slate-50 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-slate-300" />
            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-wide text-ink">
                Global
              </p>
              <p className="text-[11px] uppercase tracking-wide text-ink-faint">
                standalone links (bottom of sidebar)
              </p>
            </div>
          </div>
          <ul className="divide-y divide-line">
            <li className="flex items-center gap-3 px-4 py-2.5">
              <span className="w-[26px]" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{CONTACT_LINK.label}</p>
                <p className="text-xs text-ink-faint">{CONTACT_LINK.href}</p>
              </div>
              <StatusToggle
                value={statusOf(statusMap, CONTACT_LINK.href)}
                onChange={(v) => setStatus(CONTACT_LINK.href, v)}
              />
              <Link
                href="/admin/pages/contact"
                className="rounded-md px-2.5 py-1 text-xs font-semibold text-brand-blue hover:bg-brand-blue-tint"
              >
                Edit blocks
              </Link>
            </li>
          </ul>
        </Card>

        {/* Add new section */}
        <Link
          href="/admin/sections"
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-white px-4 py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-brand-green hover:text-brand-green"
        >
          <AdminIcon name="plus" className="h-4 w-4" />
          Add or manage sections
        </Link>
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete page"
        message={
          pendingDelete
            ? `Remove "${pendingDelete.label}" from the sidebar list?`
            : ""
        }
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (pendingDelete) {
            if (pendingDelete.custom && pendingDelete.slug) {
              await deleteCustom(pendingDelete.slug);
            }
            removeEntry(pendingDelete.sid, pendingDelete.id);
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
