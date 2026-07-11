"use client";

import { useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import type { Milestone } from "@/lib/pages/myStory";

/** Pixels per second the marquee travels. */
const SPEED = 45;

/** Auto-scrolling marquee of timeline cards (pauses on hover). */
export default function StoryTimeline({ items }: { items: Milestone[] }) {
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useAnimationFrame((_, delta) => {
    if (paused) return;
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2; // width of one (un-duplicated) set
    if (half <= 0) return;
    let next = x.get() - (delta / 1000) * SPEED;
    if (-next >= half) next += half; // seamless wrap
    x.set(next);
  });

  if (items.length === 0) return null;

  // Duplicate the set so the loop is seamless.
  const loop = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-5">
        {loop.map((m, i) => (
          <article
            key={`${m.id}-${i}`}
            aria-hidden={i >= items.length}
            className="group relative w-[260px] shrink-0 overflow-hidden rounded-2xl border border-line sm:w-[300px]"
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
                <span className="text-6xl font-extrabold text-white/25">{m.year}</span>
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
      </motion.div>
    </div>
  );
}
