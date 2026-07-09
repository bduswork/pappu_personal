"use client";

import { useEffect, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import Field from "@/components/admin/Field";
import {
  Card,
  PageHeader,
  StatusPill,
  Toggle,
  btnGhost,
  btnPrimary,
} from "@/components/admin/ui";
import {
  DEFAULT_NAV_META,
  pagesInSection,
  withNavDefaults,
  type NavSectionMeta,
} from "@/lib/navigation";

let seq = 0;

export default function SectionsPage() {
  const [sections, setSections] = useState<NavSectionMeta[]>(DEFAULT_NAV_META);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [editing, setEditing] = useState<NavSectionMeta | null>(null);

  useEffect(() => {
    fetch("/api/sections")
      .then((r) => r.json())
      .then((d) => setSections(withNavDefaults(d).sections))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const mutate = (fn: (s: NavSectionMeta[]) => NavSectionMeta[]) => {
    setSections(fn);
    setDirty(true);
    setSaved(false);
  };

  const toggle = (key: string) =>
    mutate((s) =>
      s.map((x) => (x.key === key ? { ...x, isActive: !x.isActive } : x))
    );

  const move = (key: string, dir: -1 | 1) =>
    mutate((s) => {
      const i = s.findIndex((x) => x.key === key);
      const j = i + dir;
      if (j < 0 || j >= s.length) return s;
      const copy = [...s];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const remove = (key: string) => {
    if (!confirm("Remove this section from the sidebar?")) return;
    mutate((s) => s.filter((x) => x.key !== key));
  };

  const addSection = () => {
    const fresh: NavSectionMeta = {
      key: `custom-${seq++}-${sections.length}`,
      title: "New Section",
      tagline: "tagline",
      accent: "green",
      isActive: false,
    };
    mutate((s) => [...s, fresh]);
    setEditing(fresh);
  };

  // Commit the modal draft back into the list.
  const applyEdit = (draft: NavSectionMeta) => {
    mutate((s) => s.map((x) => (x.key === draft.key ? draft : x)));
    setEditing(null);
  };

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections }),
      });
      if (res.ok) {
        const d = await res.json();
        setSections(withNavDefaults(d).sections);
        setDirty(false);
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
        title="Sections"
        description="The sidebar pillars. Rename, recolour, hide a section, reorder with the arrows, and add new ones. Changes go live on the public sidebar after you save."
        action={
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm font-semibold text-brand-green">
                Saved ✓
              </span>
            )}
            {dirty && !saved && (
              <span className="text-sm font-medium text-amber-600">
                Unsaved changes
              </span>
            )}
            <button type="button" onClick={addSection} className={btnGhost}>
              <AdminIcon name="plus" className="h-4 w-4" />
              New section
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving || loading || !dirty}
              className={`${btnPrimary} disabled:opacity-50`}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        }
      />

      {loading ? (
        <p className="text-sm text-ink-faint">Loading sections…</p>
      ) : (
        <Card>
          <ul className="divide-y divide-line">
            {sections.map((s, i) => (
              <li
                key={s.key}
                className={`flex items-center gap-4 px-4 py-3.5 ${
                  s.isActive ? "" : "bg-slate-50/60"
                }`}
              >
                {/* Reorder */}
                <div className="flex flex-col text-ink-faint">
                  <button
                    type="button"
                    onClick={() => move(s.key, -1)}
                    disabled={i === 0}
                    className="rounded p-0.5 hover:text-ink disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <AdminIcon name="chevronUp" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(s.key, 1)}
                    disabled={i === sections.length - 1}
                    className="rounded p-0.5 hover:text-ink disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <AdminIcon name="chevronDown" className="h-4 w-4" />
                  </button>
                </div>

                {/* Accent dot */}
                <span
                  className={`h-3 w-3 shrink-0 rounded-full ${
                    s.accent === "green" ? "bg-brand-green" : "bg-brand-blue"
                  }`}
                />

                {/* Title + tagline */}
                <button
                  type="button"
                  onClick={() => setEditing(s)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex items-center gap-2">
                    <p
                      className={`truncate font-semibold ${
                        s.isActive ? "text-ink" : "text-ink-faint"
                      }`}
                    >
                      {s.title || "Untitled"}
                    </p>
                    <StatusPill variant={s.isActive ? "active" : "inactive"}>
                      {s.isActive ? "Live" : "Hidden"}
                    </StatusPill>
                  </div>
                  <p className="truncate text-[13px] uppercase tracking-wide text-ink-faint">
                    {s.tagline}
                  </p>
                </button>

                {/* Pages count */}
                <span className="hidden shrink-0 text-sm text-ink-soft sm:block">
                  {pagesInSection(s.key)}{" "}
                  {pagesInSection(s.key) === 1 ? "page" : "pages"}
                </span>

                {/* Active toggle */}
                <Toggle
                  checked={s.isActive}
                  onChange={() => toggle(s.key)}
                  label={`Toggle ${s.title}`}
                />

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1 text-ink-faint">
                  <button
                    type="button"
                    onClick={() => setEditing(s)}
                    className="rounded-md p-1.5 hover:bg-slate-100 hover:text-ink"
                    aria-label="Edit"
                  >
                    <AdminIcon name="edit" className="h-[18px] w-[18px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(s.key)}
                    className="rounded-md p-1.5 hover:bg-red-50 hover:text-red-500"
                    aria-label="Delete"
                  >
                    <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {sections.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-ink-faint">
              No sections yet. Click{" "}
              <span className="font-semibold text-ink-soft">New section</span> to
              add one.
            </p>
          )}
        </Card>
      )}

      <p className="mt-4 text-xs text-ink-faint">
        Tip: turning a section off instantly hides it and all its pages from the
        public sidebar — without deleting anything.
      </p>

      {editing && (
        <EditSectionModal
          section={editing}
          onCancel={() => setEditing(null)}
          onSave={applyEdit}
        />
      )}
    </div>
  );
}

/** Modal to edit a single section's title, tagline, accent, and status. */
function EditSectionModal({
  section,
  onCancel,
  onSave,
}: {
  section: NavSectionMeta;
  onCancel: () => void;
  onSave: (draft: NavSectionMeta) => void;
}) {
  const [draft, setDraft] = useState<NavSectionMeta>(section);
  const set = (patch: Partial<NavSectionMeta>) =>
    setDraft((d) => ({ ...d, ...patch }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl border border-line bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-line px-5 py-4">
          <h2 className="text-base font-bold text-ink">Edit section</h2>
          <p className="text-xs text-ink-faint">
            How this pillar appears in the public sidebar.
          </p>
        </div>

        <div className="space-y-4 px-5 py-5">
          <Field
            label="Title"
            value={draft.title}
            onChange={(v) => set({ title: v })}
            placeholder="ABM Whaiduzzaman"
          />
          <Field
            label="Tagline"
            value={draft.tagline}
            onChange={(v) => set({ tagline: v })}
            placeholder="builds technology"
          />

          {/* Accent */}
          <div>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Accent colour
            </span>
            <div className="inline-flex rounded-lg border border-line p-0.5">
              {(["blue", "green"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => set({ accent: a })}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold capitalize transition-colors ${
                    draft.accent === a
                      ? a === "green"
                        ? "bg-brand-green text-white"
                        : "bg-brand-blue text-white"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      a === "green" ? "bg-brand-green" : "bg-brand-blue"
                    } ${draft.accent === a ? "bg-white" : ""}`}
                  />
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <label className="flex items-center gap-3 text-sm font-medium text-ink">
            <Toggle
              checked={draft.isActive}
              onChange={() => set({ isActive: !draft.isActive })}
              label="Live on sidebar"
            />
            {draft.isActive ? "Live on the sidebar" : "Hidden from the sidebar"}
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
          <button type="button" onClick={onCancel} className={btnGhost}>
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(draft)}
            className={btnPrimary}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
