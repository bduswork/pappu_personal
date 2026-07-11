"use client";

import { useEffect, useRef, useState } from "react";

/** Minimal typing for the bits of the YouTube IFrame API we use. */
type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (v: number) => void;
  getIframe: () => HTMLIFrameElement;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: (e: { target: YTPlayer }) => void;
        onStateChange?: (e: { data: number }) => void;
      };
    }
  ) => YTPlayer;
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/**
 * Full-bleed background hero video with CUSTOM controls (the cover-scaling
 * hides YouTube's own controls). Starts paused; play/pause, mute, volume,
 * fullscreen. Driven by the YouTube IFrame Player API.
 */
export default function HeroVideo({ videoId }: { videoId: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);

  useEffect(() => {
    let cancelled = false;

    function init() {
      if (cancelled || !mountRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          fs: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (e) => e.target.setVolume(volume),
          onStateChange: (e) => {
            const S = window.YT!.PlayerState;
            if (e.data === S.PLAYING) setPlaying(true);
            else if (e.data === S.PAUSED) setPlaying(false);
            else if (e.data === S.ENDED) {
              setPlaying(false);
              setStarted(false);
            }
          },
        },
      });
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
  }, [videoId]);

  const play = () => {
    const p = playerRef.current;
    if (!p) return;
    if (!started) {
      p.unMute();
      p.setVolume(volume);
      setMuted(false);
      setStarted(true);
    }
    p.playVideo();
  };
  const togglePlay = () => (playing ? playerRef.current?.pauseVideo() : play());
  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.unMute();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  };
  const onVolume = (v: number) => {
    setVolume(v);
    const p = playerRef.current;
    if (!p) return;
    p.setVolume(v);
    if (v > 0 && muted) {
      p.unMute();
      setMuted(false);
    }
    if (v === 0 && !muted) {
      p.mute();
      setMuted(true);
    }
  };
  const fullscreen = () => {
    try {
      playerRef.current?.getIframe()?.requestFullscreen();
    } catch {}
  };

  const iconBtn =
    "flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20";

  return (
    <>
      {/* Ambient blurred backdrop keeps the hero full-bleed without cropping */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover blur-2xl"
      />

      {/* Contained player — the whole 16:9 video is always visible (brand not cut) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 m-auto aspect-video max-h-full max-w-full [&>iframe]:h-full [&>iframe]:w-full">
          <div ref={mountRef} className="h-full w-full" />
        </div>
      </div>

      {/* Click anywhere on the video to play/pause (behind the hero text/CTAs) */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Pause video" : "Play video"}
        tabIndex={-1}
        className="absolute inset-0 z-10 cursor-pointer"
      />

      {/* Center play button when paused */}
      {!playing && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <button
            type="button"
            onClick={play}
            aria-label="Play video"
            className="group pointer-events-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-brand-green shadow-xl transition-transform hover:scale-110"
          >
            <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      )}

      {/* Control bar */}
      <div className="absolute bottom-5 right-5 z-30 flex items-center gap-1.5 rounded-full bg-ink/55 px-2 py-1.5 backdrop-blur-sm">
        <button type="button" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className={iconBtn}>
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className={iconBtn}>
          {muted || volume === 0 ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <path d="m23 9-6 6M17 9l6 6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
            </svg>
          )}
        </button>

        <input
          type="range"
          min={0}
          max={100}
          value={muted ? 0 : volume}
          onChange={(e) => onVolume(Number(e.target.value))}
          aria-label="Volume"
          className="mx-1 h-1 w-16 cursor-pointer accent-brand-green sm:w-20"
        />

        <button type="button" onClick={fullscreen} aria-label="Fullscreen" className={iconBtn}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
          </svg>
        </button>
      </div>
    </>
  );
}
