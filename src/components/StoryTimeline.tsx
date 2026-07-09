"use client";

import { useRef } from "react";
import type { Milestone } from "@/lib/pages/myStory";

/** Horizontal timeline carousel — image + year + caption cards with arrows. */
export default function StoryTimeline({ items }: { items: Milestone[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    // Scroll by roughly one card width.
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <div className="relative">
      {/* Arrows */}
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Previous"
        className="absolute -left-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-md transition-colors hover:border-brand-blue hover:text-brand-blue sm:flex sm:h-11 sm:w-11"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Next"
        className="absolute -right-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-md transition-colors hover:border-brand-blue hover:text-brand-blue sm:flex sm:h-11 sm:w-11"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Track */}
      <div
        ref={trackRef}
        className="scroll-slim flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
      >
        {items.map((m) => (
          <article
            data-card
            key={m.id}
            className="group relative w-[260px] shrink-0 snap-start overflow-hidden rounded-2xl border border-line sm:w-[300px]"
          >
            {/* Image or gradient */}
            {m.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.image}
                alt={m.year}
                className="h-[380px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-[380px] w-full items-center justify-center bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-green">
                <span className="text-6xl font-extrabold text-white/25">
                  {m.year}
                </span>
              </div>
            )}

            {/* Legibility overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />

            {/* Caption */}
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-3xl font-extrabold tracking-tight">{m.year}</p>
              {m.text && (
                <p className="mt-2 line-clamp-5 text-[13px] leading-relaxed text-white/85">
                  {m.text}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
