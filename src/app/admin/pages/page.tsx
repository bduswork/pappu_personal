"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_SECTIONS, CONTACT_LINK } from "@/lib/navigation";
import AdminIcon from "@/components/admin/AdminIcon";
import { SortableList, SortableItem } from "@/components/admin/Sortable";
import { Card, PageHeader, StatusPill, btnGhost } from "@/components/admin/ui";

type Entry =
  | {
      kind: "page";
      id: string;
      label: string;
      href: string;
      status: "PUBLISHED" | "DRAFT";
    }
  | { kind: "programs"; id: string; label: string; count: number };

type Section = {
  id: string;
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
  "/ventures/zariya-living": "/admin/pages/ventures/zariya-living",
  "/ventures/heritique": "/admin/pages/ventures/heritique",
  "/ventures/ava": "/admin/pages/ventures/ava",
  "/ventures/invest": "/admin/pages/ventures/invest",
};

// Mock publish status + which collection a page pulls from (design only).
const STATUS: Record<string, "PUBLISHED" | "DRAFT"> = {
  "/builds-software": "PUBLISHED",
  "/my-story": "PUBLISHED",
  "/press-kit": "PUBLISHED",
  "/blog": "PUBLISHED",
  "/ventures/zariya-living": "PUBLISHED",
};
const PULLS: Record<string, string> = {
  "/press-kit": "Press",
  "/speaking": "Events",
  "/blog": "Articles",
  "/podcast": "Videos",
  "/resources": "Resources",
};
const statusOf = (href: string): "PUBLISHED" | "DRAFT" => STATUS[href] ?? "DRAFT";

// Build the admin structure straight from the public sidebar data, so the two
// always match: section links → programs dropdown → links after.
const INITIAL: Section[] = NAV_SECTIONS.map((s, si) => ({
  id: `s${si}`,
  title: s.title,
  tagline: s.tagline,
  accent: s.accent,
  entries: [
    ...s.links.map((l, i) => ({
      kind: "page" as const,
      id: `${si}-l${i}`,
      label: l.label,
      href: l.href,
      status: statusOf(l.href),
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
      status: statusOf(l.href),
    })) ?? []),
  ],
}));

let nid = 100;

export default function PagesList() {
  const [sections, setSections] = useState<Section[]>(INITIAL);

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

  const addPage = (sid: string) =>
    updateSection(sid, (s) => ({
      ...s,
      entries: [
        ...s.entries,
        {
          kind: "page",
          id: `n${nid++}`,
          label: "New Page",
          href: "/new-page",
          status: "DRAFT",
        },
      ],
    }));

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
          <Link href="/admin/sections" className={btnGhost}>
            <AdminIcon name="sections" className="h-4 w-4" />
            Manage sections
          </Link>
        }
      />

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
                                <p className="font-semibold text-ink">
                                  {entry.label}
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
                              <StatusPill
                                variant={
                                  entry.status === "PUBLISHED"
                                    ? "published"
                                    : "draft"
                                }
                              >
                                {entry.status}
                              </StatusPill>
                              {EDITORS[entry.href] ? (
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
                              <button
                                type="button"
                                onClick={() => removeEntry(section.id, entry.id)}
                                className="rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                                aria-label="Delete page"
                              >
                                <AdminIcon
                                  name="trash"
                                  className="h-[18px] w-[18px]"
                                />
                              </button>
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
                onClick={() => addPage(section.id)}
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
              <StatusPill variant="published">PUBLISHED</StatusPill>
              <span
                className="cursor-default rounded-md px-2.5 py-1 text-xs font-semibold text-ink-faint"
                title="Editor coming soon"
              >
                Edit blocks
              </span>
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
    </div>
  );
}
