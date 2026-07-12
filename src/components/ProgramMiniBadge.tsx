"use client";

import { useEffect, useState } from "react";
import { programStatus } from "@/lib/programs";

/** Compact live status pill for the sidebar (Live · or a short countdown). */
export default function ProgramMiniBadge({
  startAt,
  endAt,
}: {
  startAt?: string;
  endAt?: string;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  if (now === null || (!startAt && !endAt)) return null;

  const status = programStatus({ startAt: startAt ?? "", endAt: endAt ?? "" }, now);

  if (status === "ONGOING") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-green px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
        </span>
        Live
      </span>
    );
  }

  if (status === "UPCOMING") {
    const diff = Math.max(0, Date.parse(startAt ?? "") - now);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const label = days > 0 ? `${days}d` : hours > 0 ? `${hours}h` : `${mins}m`;
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink">
        <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {label}
      </span>
    );
  }

  return null;
}
