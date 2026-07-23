import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/pages/getPageContent";
import { isPagePublished } from "@/lib/getPageStatus";
import {
  highlightLines,
  type ExperienceTrack,
  type GlobalExperienceContent,
} from "@/lib/pages/globalExperience";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Global Experience — ABM Whaiduzzaman",
  description:
    "Job and consultancy experience across Bangladesh, the USA, China and Uganda.",
};

/** One experience track (Job / Consultancy) rendered as a timeline of cards. */
function Track({ track, accent }: { track: ExperienceTrack; accent: "blue" | "green" }) {
  const items = track.items.filter((i) => i.role.trim() || i.organization.trim());
  if (items.length === 0) return null;

  const dot = accent === "green" ? "bg-brand-green" : "bg-brand-blue";
  const chip =
    accent === "green"
      ? "bg-brand-green-soft text-brand-green-dark"
      : "bg-brand-blue-tint text-brand-blue-dark";
  const eyebrow = accent === "green" ? "text-brand-green" : "text-brand-blue";

  return (
    <section className="mt-16 first:mt-0">
      <h2 className={`text-xs font-bold uppercase tracking-[0.2em] ${eyebrow}`}>
        {track.heading}
      </h2>
      {track.intro && <p className="mt-2 max-w-2xl text-ink-soft">{track.intro}</p>}

      <div className="mt-8 space-y-5">
        {items.map((item) => {
          const bullets = highlightLines(item.highlights);
          return (
            <article
              key={item.id}
              className="relative rounded-2xl border border-line bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg sm:p-7"
            >
              <div className="flex flex-wrap items-start gap-5">
                {/* Logo / initial */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-slate-50">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt="" className="h-full w-full object-contain p-1.5" />
                  ) : (
                    <span className={`flex h-2.5 w-2.5 rounded-full ${dot}`} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-extrabold leading-snug tracking-tight text-ink">
                    {item.role}
                  </h3>
                  {item.organization && (
                    <p className="mt-0.5 text-sm font-semibold text-ink-soft">
                      {item.organization}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {item.period && (
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${chip}`}>
                        {item.period}
                      </span>
                    )}
                    {item.location && (
                      <span className="inline-flex items-center gap-1 text-xs text-ink-faint">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z" />
                          <circle cx="12" cy="10" r="2.5" />
                        </svg>
                        {item.location}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      {item.description}
                    </p>
                  )}

                  {bullets.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                      {bullets.map((b, i) => (
                        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                          <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default async function GlobalExperiencePage() {
  if (!(await isPagePublished("/global-experience"))) notFound();

  const { banner, jobs, consultancy } =
    await getPageContent<GlobalExperienceContent>("global-experience");
  const hasImage = !!banner.image;

  return (
    <div>
      {/* ── Banner ─────────────────────────────────── */}
      <section
        className={`relative flex flex-col overflow-hidden ${
          hasImage ? "min-h-[380px] justify-end lg:min-h-[52vh]" : ""
        }`}
      >
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={banner.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        {hasImage ? (
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/5" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-tint via-white to-brand-green-tint" />
        )}
        <div
          className={`relative w-full max-w-4xl px-6 lg:px-12 ${
            hasImage ? "pb-12 pt-24 text-white" : "py-16 sm:py-20"
          }`}
        >
          <p
            className={`text-sm font-semibold uppercase tracking-[0.22em] ${
              hasImage ? "text-white/80" : "text-brand-blue"
            }`}
          >
            Experience
          </p>
          <h1
            className={`mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl ${
              hasImage ? "text-white" : "text-brand-green"
            }`}
          >
            {banner.headline}
          </h1>
          {banner.intro && (
            <p
              className={`mt-4 max-w-2xl text-lg leading-relaxed ${
                hasImage ? "text-white/90" : "text-ink-soft"
              }`}
            >
              {banner.intro}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-12">
        <Track track={jobs} accent="blue" />
        <Track track={consultancy} accent="green" />
      </div>
    </div>
  );
}
