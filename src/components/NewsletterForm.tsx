"use client";

import { useState } from "react";

/** Newsletter signup — posts to /api/subscribe; signups land in the admin inbox. */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok) setState("done");
      else {
        setState("error");
        setError(d.error || "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setError("Network error. Please try again.");
    }
  }

  if (state === "done") {
    return (
      <p className="mx-auto mt-6 max-w-md rounded-full border border-brand-green-soft bg-brand-green-tint px-5 py-3 text-sm font-semibold text-brand-green-dark">
        Thanks — you&apos;re on the list! ✓
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-6 max-w-md">
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="w-full rounded-full border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-brand-green"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="shrink-0 rounded-full bg-brand-green px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-green-dark disabled:opacity-60"
        >
          {state === "sending" ? "…" : "Sign up"}
        </button>
      </div>
      {state === "error" && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </form>
  );
}
