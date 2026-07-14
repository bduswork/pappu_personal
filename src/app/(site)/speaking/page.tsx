import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSpeaking } from "@/lib/pages/getSpeaking";
import { isPagePublished } from "@/lib/getPageStatus";
import { youtubeId } from "@/lib/siteSettings";
import VideoTheater, { type TheaterVideo } from "@/components/VideoTheater";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Speaking & Consulting — ABM Whaiduzzaman",
  description: "Keynotes, fireside chats and consulting on software, metering, telecom and healthcare IT.",
};

export default async function SpeakingPage() {
  if (!(await isPagePublished("/speaking"))) notFound();

  const { hero, intro, topics, events, talks } = await getSpeaking();
  const hasImage = !!hero.image;
  const ctaLink = hero.ctaLink || "/contact";

  // Featured hero video (if any) + past talks → one YouTube-style theater.
  const videos: TheaterVideo[] = [
    ...(youtubeId(hero.video)
      ? [{ id: "featured", title: "Featured talk", video: hero.video, thumbnail: "" }]
      : []),
    ...talks.map((t) => ({ id: t.id, title: t.title, video: t.video, thumbnail: t.thumbnail })),
  ];

  return (
    <div>
      {/* ── Hero (text) ────────────────────────────── */}
      <section
        className={`relative flex flex-col overflow-hidden ${
          hasImage ? "min-h-[380px] justify-end lg:min-h-[52vh]" : ""
        }`}
      >
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        {hasImage ? (
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/5" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-tint via-white to-brand-green-tint" />
        )}

        <div
          className={`relative w-full max-w-4xl px-6 lg:px-12 ${
            hasImage ? "pb-12 pt-24 text-white" : "py-20 sm:py-24"
          }`}
        >
          <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${hasImage ? "text-white/80" : "text-brand-blue"}`}>
            Speaking &amp; Consulting
          </p>
          <h1 className={`mt-4 max-w-3xl text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl ${hasImage ? "text-white" : "text-brand-green"}`}>
            {hero.headline}
          </h1>
          {hero.ctaLabel && (
            <Link
              href={ctaLink}
              className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-brand-green px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-brand-green-dark"
            >
              {hero.ctaLabel}
            </Link>
          )}
        </div>
      </section>

      {/* ── Video theater (main player + more talks at right) ── */}
      {videos.length > 0 && (
        <div className="mx-auto max-w-6xl px-6 pt-12 lg:px-12">
          <VideoTheater videos={videos} />
        </div>
      )}

      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-12">
        {/* ── Intro + topics ───────────────────────── */}
        <section className="grid gap-10 lg:grid-cols-[1fr_300px]">
          <div
            className="[&_p]:mt-4 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:text-ink-soft [&_p:first-child]:mt-0"
            dangerouslySetInnerHTML={{ __html: intro }}
          />
          {topics.length > 0 && (
            <aside>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">
                What I speak on
              </h2>
              <ul className="mt-4 space-y-2.5">
                {topics.map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm leading-snug text-ink">{t}</span>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </section>

        {/* ── Upcoming events ──────────────────────── */}
        {events.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">
              Upcoming events
            </h2>
            <div className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line">
              {events.map((e) => {
                const Wrapper = e.link ? "a" : "div";
                return (
                  <Wrapper
                    key={e.id}
                    {...(e.link ? { href: e.link, target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex flex-wrap items-center gap-x-4 gap-y-1 bg-white px-6 py-4 transition-colors hover:bg-slate-50"
                  >
                    {e.date && (
                      <span className="w-28 shrink-0 text-sm font-bold text-brand-blue">
                        {e.date}
                      </span>
                    )}
                    <span className="flex-1 font-semibold text-ink">{e.title}</span>
                    {e.location && (
                      <span className="text-sm text-ink-soft">{e.location}</span>
                    )}
                    {e.link && (
                      <svg viewBox="0 0 24 24" className="h-4 w-4 text-brand-blue transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </Wrapper>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Booking CTA ──────────────────────────── */}
        <section className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-blue to-brand-blue-dark p-10 text-center text-white">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Bring me to your stage or team.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Keynotes, fireside chats, workshops, or a focused consulting engagement.
          </p>
          <Link
            href={ctaLink}
            className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-brand-blue transition-colors hover:bg-white/90"
          >
            {hero.ctaLabel || "Get in touch"}
          </Link>
        </section>
      </div>
    </div>
  );
}
