"use client";

import { useEffect, useState } from "react";
import { programStatus } from "@/lib/programs";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Live status badge + countdown for a program (ticks every second). */
export default function ProgramCountdown({
  startAt,
  endAt,
}: {
  startAt: string;
  endAt: string;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Render nothing until mounted (avoids SSR/client time mismatch).
  if (now === null) return null;

  const status = programStatus({ startAt, endAt }, now);
  if (status === "NONE") return null;

  if (status === "ONGOING") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-green px-4 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-sm">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
        </span>
        Live now
      </span>
    );
  }

  if (status === "FINISHED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-4 py-2 text-sm font-bold uppercase tracking-wide text-ink-soft">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Completed
      </span>
    );
  }

  // UPCOMING → ticking countdown to the start.
  const diff = Math.max(0, Date.parse(startAt) - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const units: [number, string][] = [
    [days, "Days"],
    [hours, "Hours"],
    [mins, "Min"],
    [secs, "Sec"],
  ];

  return (
    <div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
        Upcoming — starts in
      </span>
      <div className="mt-3 flex gap-2 sm:gap-3">
        {units.map(([value, label]) => (
          <div
            key={label}
            className="flex min-w-[3.75rem] flex-col items-center rounded-xl border border-line bg-white px-3 py-2 shadow-sm"
          >
            <span className="text-2xl font-extrabold tabular-nums tracking-tight text-brand-green sm:text-3xl">
              {pad(value)}
            </span>
            <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
