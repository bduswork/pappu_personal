"use client";

import { useEffect, useRef, useState } from "react";
import { youtubeId } from "@/lib/siteSettings";

export type TheaterVideo = {
  id: string;
  title: string;
  video: string;
  thumbnail?: string;
};

/** The player methods we call (window.YT is typed globally by HeroVideo). */
type VTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (id: string) => void;
  destroy: () => void;
};

/** YouTube-style player: a main video (tap to play/pause) + a clickable list. */
export default function VideoTheater({
  videos,
  listLabel = "More talks",
}: {
  videos: TheaterVideo[];
  listLabel?: string;
}) {
  const list = videos.filter((v) => youtubeId(v.video));
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VTPlayer | null>(null);

  useEffect(() => {
    if (list.length === 0) return;
    let cancelled = false;
    const firstId = youtubeId(list[0].video) ?? "";

    function init() {
      if (cancelled || !mountRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId: firstId,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onReady: () => setReady(true),
          onStateChange: (e) => {
            const S = window.YT!.PlayerState;
            if (e.data === S.PLAYING) setPlaying(true);
            else if (e.data === S.PAUSED || e.data === S.ENDED) setPlaying(false);
          },
        },
      }) as unknown as VTPlayer;
    }

    if (window.YT?.Player) {
      init();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        init();
      };
      if (!document.getElementById("youtube-iframe-api")) {
        const s = document.createElement("script");
        s.id = "youtube-iframe-api";
        s.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(s);
      }
    }

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {}
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length]);

  if (list.length === 0) return null;

  const current = list[Math.min(active, list.length - 1)];

  const selectVideo = (i: number) => {
    setActive(i);
    const id = youtubeId(list[i].video);
    if (playerRef.current && id) playerRef.current.loadVideoById(id); // autoplays
  };
  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Main player */}
      <div className="min-w-0">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-black shadow-lg">
          <div ref={mountRef} className="absolute inset-0 [&>iframe]:h-full [&>iframe]:w-full" />

          {/* Tap to play/pause (leaves the native control strip at the bottom free) */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            tabIndex={-1}
            className="absolute inset-x-0 bottom-11 top-0 z-10 cursor-pointer"
          />

          {/* Center play / pause button */}
          {ready && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="group absolute inset-x-0 bottom-11 top-0 z-20 flex items-center justify-center"
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-full text-brand-blue shadow-lg transition-all group-hover:scale-110 group-hover:bg-white ${
                  playing ? "bg-white/70" : "bg-white/90"
                }`}
              >
                {playing ? (
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
                    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </span>
            </button>
          )}
        </div>
        {current.title && (
          <h3 className="mt-3 text-lg font-bold tracking-tight text-ink">
            {current.title}
          </h3>
        )}
      </div>

      {/* Up-next list */}
      {list.length > 1 && (
        <div className="scroll-slim lg:max-h-[420px] lg:overflow-y-auto lg:pr-1">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-ink-faint">
            {listLabel}
          </p>
          <div className="space-y-2">
            {list.map((v, i) => {
              const tid = youtubeId(v.video);
              const thumb =
                v.thumbnail || (tid ? `https://img.youtube.com/vi/${tid}/mqdefault.jpg` : "");
              const activeItem = i === active;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => selectVideo(i)}
                  className={`group flex w-full gap-3 rounded-xl border p-2 text-left transition-colors ${
                    activeItem
                      ? "border-brand-blue-soft bg-brand-blue-tint"
                      : "border-line bg-white hover:bg-slate-50"
                  }`}
                >
                  <span className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt={v.title} className="h-full w-full object-cover" />
                    ) : null}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-brand-blue">
                        <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  </span>
                  <span className="min-w-0 flex-1 py-0.5">
                    <span className="line-clamp-2 text-sm font-semibold text-ink">
                      {v.title || "Untitled"}
                    </span>
                    {activeItem && (
                      <span className="mt-1 block text-[11px] font-bold uppercase tracking-wide text-brand-blue">
                        Now playing
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
