"use client";

import { useState } from "react";
import { waLink } from "@/lib/siteSettings";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-green";

export default function EnrollForm({
  programSlug,
  programName,
  ctaLabel,
  whatsappNumber,
}: {
  programSlug: string;
  programName: string;
  ctaLabel?: string;
  /** Business WhatsApp number the enrollee is handed off to (from Settings). */
  whatsappNumber?: string;
}) {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  /** wa.me link to hand the enrollee straight into a WhatsApp chat. */
  function enrollWaLink() {
    const lines = [
      `Hi, I'd like to enquire about ${programName}.`,
      form.name && `Name: ${form.name}`,
      form.email && `Email: ${form.email}`,
      form.message && `Note: ${form.message}`,
    ].filter(Boolean);
    return waLink(whatsappNumber || "", lines.join("\n"));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError("");
    // Open the WhatsApp tab synchronously so mobile browsers don't block the
    // pop-up (it must happen inside the click handler, before the await).
    const wa = enrollWaLink();
    const waTab = wa ? window.open("about:blank", "_blank") : null;
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, programSlug, programName }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setState("sent");
        if (wa) {
          if (waTab) waTab.location.href = wa;
          else window.location.href = wa;
        }
      } else {
        if (waTab) waTab.close();
        setState("error");
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      if (waTab) waTab.close();
      setState("error");
      setError("Network error. Please try again.");
    }
  }

  if (state === "sent") {
    const wa = enrollWaLink();
    return (
      <div className="flex flex-col items-center rounded-2xl border border-brand-green-soft bg-brand-green-tint p-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-4 text-xl font-extrabold tracking-tight text-ink">You&apos;re on the list</h3>
        <p className="mt-2 text-ink-soft">
          {wa
            ? "WhatsApp should have opened in a new tab — if not, tap the button below to continue our chat."
            : "Thanks — I’ll reach out on WhatsApp with the next steps."}
        </p>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-brand-green-dark"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24Zm4.52 9.87c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42l-.48-.01c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.57.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
            </svg>
            Continue on WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Full name</span>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} placeholder="Your name" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Email</span>
          <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} placeholder="you@example.com" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">WhatsApp number</span>
          <input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={inputClass} placeholder="+880 …" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Message (optional)</span>
          <input value={form.message} onChange={(e) => set("message", e.target.value)} className={inputClass} placeholder="Anything you'd like to add" />
        </label>
      </div>

      {state === "error" && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand-green px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-brand-green-dark disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : ctaLabel || "Enquire Now"}
      </button>
    </form>
  );
}
