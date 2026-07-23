"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { PageHeader, btnPrimary } from "@/components/admin/ui";

type MediaItem = {
  id: string;
  url: string | null;
  mimeType: string | null;
  alt: string | null;
  sizeBytes: number | null;
  createdAt: string;
};

const srcOf = (m: MediaItem) => m.url || `/api/media/${m.id}`;

function prettySize(bytes: number | null) {
  if (!bytes) return "";
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function prettyDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MediaItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(
    () =>
      fetch("/api/media")
        .then((r) => r.json())
        .then((d) => setItems(Array.isArray(d.media) ? d.media : []))
        .catch(() => {})
        .finally(() => setLoading(false)),
    []
  );

  useEffect(() => {
    load();
  }, [load]);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;
    setUploading(list.length);
    for (const file of list) {
      try {
        await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": file.type, "X-Filename": file.name },
          body: file,
        });
      } catch {
        // skip this file, keep going
      }
      setUploading((n) => Math.max(0, n - 1));
    }
    setUploading(0);
    await load();
  }

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
  };

  async function copyUrl(m: MediaItem) {
    try {
      await navigator.clipboard.writeText(srcOf(m));
      setCopied(m.id);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // clipboard unavailable
    }
  }

  async function remove(m: MediaItem) {
    setItems((xs) => xs.filter((x) => x.id !== m.id));
    await fetch(`/api/media/${m.id}`, { method: "DELETE" }).catch(() => {});
  }

  const totalBytes = items.reduce((n, m) => n + (m.sizeBytes || 0), 0);

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Every image uploaded across the site — stored in the database and reusable anywhere."
        action={
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <span className="text-sm text-ink-faint">
                {items.length} {items.length === 1 ? "image" : "images"} ·{" "}
                {prettySize(totalBytes)}
              </span>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={btnPrimary}
            >
              <AdminIcon name="plus" className="h-4 w-4" />
              Upload
            </button>
          </div>
        }
      />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onPick}
        className="hidden"
      />

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`mb-6 cursor-pointer rounded-xl border border-dashed p-8 text-center transition-colors ${
          dragOver
            ? "border-brand-green bg-brand-green-tint"
            : "border-line bg-white hover:border-brand-green"
        }`}
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-tint">
          <AdminIcon name="media" className="h-6 w-6 text-brand-green" />
        </span>
        <p className="mt-3 text-sm font-semibold text-ink">
          {uploading > 0 ? `Uploading… (${uploading} left)` : "Drag & drop images here"}
        </p>
        <p className="text-xs text-ink-faint">
          or click to choose files — PNG, JPG, WebP up to 8 MB
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-line bg-white p-10 text-center">
          <p className="font-semibold text-ink">No images yet</p>
          <p className="mt-1 text-sm text-ink-faint">Uploaded images will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((m) => (
            <div
              key={m.id}
              className="group overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-md"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={srcOf(m)}
                  alt={m.alt ?? ""}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
                <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-ink/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => copyUrl(m)}
                    title="Copy URL"
                    className="rounded-md bg-white/90 px-2 py-1 text-[11px] font-bold text-ink-soft hover:text-brand-blue"
                  >
                    {copied === m.id ? "Copied ✓" : "Copy URL"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(m)}
                    aria-label="Delete image"
                    title="Delete"
                    className="rounded-md bg-white/90 p-1.5 text-ink-soft hover:text-red-500"
                  >
                    <AdminIcon name="trash" className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="px-3 py-2">
                <p
                  className="truncate text-xs font-semibold text-ink"
                  title={m.alt ?? m.id}
                >
                  {m.alt || m.id}
                </p>
                <p className="text-[11px] text-ink-faint">
                  {prettySize(m.sizeBytes)}
                  {m.sizeBytes ? " · " : ""}
                  {prettyDate(m.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete image"
        message={
          pendingDelete
            ? `Delete "${pendingDelete.alt || pendingDelete.id}"? If this image is used on a page, it will stop showing there.`
            : ""
        }
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) remove(pendingDelete);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
