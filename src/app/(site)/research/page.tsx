import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/pages/getPageContent";
import { isPagePublished } from "@/lib/getPageStatus";
import type { ResearchContent } from "@/lib/pages/research";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Research & Publications — ABM Whaiduzzaman",
  description:
    "Peer-reviewed research and publications by ABM Whaiduzzaman.",
};

export default async function ResearchPage() {
  if (!(await isPagePublished("/research"))) notFound();

  const { banner, profile, papers } = await getPageContent<ResearchContent>("research");
  const hasImage = !!banner.image;
  const list = papers.filter((p) => p.title.trim());

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
            Research
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
        {/* ── Scholar profile CTA ───────────────────── */}
        {profile.link && (
          <a
            href={profile.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-2xl border border-brand-blue-soft bg-brand-blue-tint px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-blue shadow-sm">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3Z" />
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z" />
              </svg>
            </span>
            <span>
              <span className="block text-sm font-bold text-brand-blue-dark">
                {profile.label || "Scholar profile"}
              </span>
              <span className="block text-xs text-ink-soft">
                View the full publication list →
              </span>
            </span>
          </a>
        )}

        {/* ── Papers ───────────────────────────────── */}
        {list.length > 0 ? (
          <div className="mt-10 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">
              Publications
            </h2>
            {list.map((p) => (
              <article
                key={p.id}
                className="group grid gap-6 rounded-2xl border border-line bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg sm:grid-cols-[160px_1fr] sm:p-7"
              >
                {/* Cover / placeholder */}
                <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-blue to-brand-blue-dark sm:aspect-[3/4]">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-10 w-10 text-white/70" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
                      <path d="M14 3v6h6M8 13h8M8 17h5" strokeLinecap="round" />
                    </svg>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {p.year && (
                      <span className="rounded-full bg-brand-green-soft px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-green-dark">
                        {p.year}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-xl font-extrabold leading-snug tracking-tight text-ink">
                    {p.title}
                  </h3>
                  {p.authors && (
                    <p className="mt-1.5 text-sm font-medium text-ink-soft">{p.authors}</p>
                  )}
                  {p.venue && (
                    <p className="mt-1 text-sm italic text-ink-faint">{p.venue}</p>
                  )}
                  {p.summary && (
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">{p.summary}</p>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
                    >
                      Read the paper
                      <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-ink-soft">Publications will be listed here soon.</p>
        )}
      </div>
    </div>
  );
}
