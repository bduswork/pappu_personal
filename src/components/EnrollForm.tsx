"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-green";

export default function EnrollForm({
  programSlug,
  programName,
  ctaLabel,
}: {
  programSlug: string;
  programName: string;
  ctaLabel?: string;
}) {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, programSlug, programName }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setState("sent");
      else {
        setState("error");
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setError("Network error. Please try again.");
    }
  }

  if (state === "sent") {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-brand-green-soft bg-brand-green-tint p-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-4 text-xl font-extrabold tracking-tight text-ink">You&apos;re on the list</h3>
        <p className="mt-2 text-ink-soft">Thanks — I&apos;ll reach out on WhatsApp with the next steps.</p>
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
        {state === "sending" ? "Sending…" : ctaLabel || "Enroll now"}
      </button>
    </form>
  );
}
