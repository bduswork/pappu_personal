"use client";

import { useState } from "react";
import { youtubeId } from "@/lib/siteSettings";

export type GridVideo = {
  id: string;
  title: string;
  video: string;
  thumbnail?: string;
  category?: string;
  date?: string;
};

/** A grid of videos (3 per row) that play inline when clicked. */
export default function VideoGrid({ videos }: { videos: GridVideo[] }) {
  const list = videos.filter((v) => youtubeId(v.video));
  const [playing, setPlaying] = useState<string | null>(null);

  if (list.length === 0) {
    return <p className="text-center text-ink-faint">Videos coming soon.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((v) => {
        const id = youtubeId(v.video);
        const thumb =
          v.thumbnail || (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "");
        const isPlaying = playing === v.id;
        return (
          <div
            key={v.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-16px_rgba(2,132,199,0.35)]"
          >
            <div className="relative aspect-video overflow-hidden bg-black">
              {isPlaying ? (
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(v.id)}
                  aria-label={`Play ${v.title}`}
                  className="absolute inset-0"
                >
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt={v.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : null}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-brand-blue shadow-lg transition-transform group-hover:scale-110">
                      <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </button>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs text-ink-faint">
                {v.category && (
                  <span className="font-bold uppercase tracking-wide text-brand-blue">
                    {v.category}
                  </span>
                )}
                {v.date && <span>· {v.date}</span>}
              </div>
              <h3 className="mt-1 font-bold leading-snug text-ink">{v.title}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
