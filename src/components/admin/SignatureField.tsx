"use client";

import { useState, type ChangeEvent } from "react";
import AdminIcon from "./AdminIcon";

/**
 * Brand-signature uploader. Posts a photo to /api/signature, which removes the
 * paper background and generates a matching favicon — then reports both URLs.
 * Previews on the blue sidebar gradient so the white signature is visible here.
 */
export default function SignatureField({
  signature,
  onResult,
}: {
  signature: string;
  onResult: (r: { signature: string; favicon: string }) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onPick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const res = await fetch("/api/signature", {
        method: "POST",
        headers: { "Content-Type": file.type, "X-Filename": file.name },
        body: file,
      });
      if (res.ok) {
        const d = await res.json();
        onResult({ signature: d.signature, favicon: d.favicon });
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Upload failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="max-w-md space-y-2">
      <div className="sidebar-surface relative flex aspect-[3/1] w-full items-center justify-center overflow-hidden rounded-lg border border-line">
        {signature ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={signature} alt="" className="max-h-full max-w-full object-contain px-4" />
            <button
              type="button"
              onClick={() => onResult({ signature: "", favicon: "" })}
              aria-label="Remove signature"
              className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 text-ink-soft shadow hover:text-red-500"
            >
              <AdminIcon name="trash" className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <span className="text-xs font-semibold uppercase tracking-wide text-white/70">
            Signature preview
          </span>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-[11px] font-bold uppercase tracking-wide text-white">
            Processing…
          </div>
        )}
      </div>

      <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-line bg-white px-2 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-brand-green hover:text-brand-green">
        <AdminIcon name="media" className="h-3.5 w-3.5" />
        Choose signature photo
        <input type="file" accept="image/*" onChange={onPick} className="hidden" />
      </label>

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
