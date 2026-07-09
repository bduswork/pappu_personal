"use client";

import { useState, type ChangeEvent } from "react";
import AdminIcon from "./AdminIcon";

/**
 * Image field: native file picker (instant local preview) + URL paste.
 * Picking a file previews it immediately via a blob URL; actual upload to
 * Firebase Storage is wired later. Empty = no image (fine for optional logos).
 */
export default function ImageField({
  value,
  onChange,
  label,
  boxClass,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  boxClass: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function onPick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Instant local preview, then upload to Postgres and swap in the saved URL.
    onChange(URL.createObjectURL(file));
    setUploading(true);
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": file.type, "X-Filename": file.name },
        body: file,
      });
      if (res.ok) {
        const { url } = await res.json();
        if (url) onChange(url);
      }
    } catch {
      // keep the local preview if the upload fails
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="shrink-0 space-y-1.5">
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-lg border border-dashed border-line bg-slate-50 ${boxClass}`}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Remove image"
              className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-ink-soft shadow hover:text-red-500"
            >
              <AdminIcon name="trash" className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 text-ink-faint">
            <AdminIcon name="media" className="h-5 w-5" />
            <span className="text-[10px] font-semibold uppercase">{label}</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-[11px] font-bold uppercase text-brand-green">
            Uploading…
          </div>
        )}
      </div>

      <label className="flex cursor-pointer items-center justify-center gap-1 rounded-md border border-line bg-white px-2 py-1 text-xs font-semibold text-ink-soft transition-colors hover:border-brand-green hover:text-brand-green">
        <AdminIcon name="media" className="h-3.5 w-3.5" />
        Choose file
        <input type="file" accept="image/*" onChange={onPick} className="hidden" />
      </label>

      <input
        value={value.startsWith("blob:") ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="or paste image URL"
        className="block w-full rounded-md border border-line bg-white px-2 py-1 text-xs text-ink outline-none focus:border-brand-green"
      />
    </div>
  );
}
