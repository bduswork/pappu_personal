import type { Metadata } from "next";
import { getNexalinxAsl } from "@/lib/pages/getNexalinxAsl";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nexalinx · ASL — ABM Whaiduzzaman",
  description:
    "The companies ABM Whaiduzzaman leads — Nexalinx and Automation Services Ltd — building enterprise software for utilities, telecom, healthcare and government.",
};

export default async function NexalinxAslPage() {
  const { banner, companies } = await getNexalinxAsl();
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
          <img
            src={banner.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        {hasImage ? (
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/5" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-tint via-white to-brand-green-tint" />
        )}

        <div
          className={`relative w-full max-w-4xl px-6 lg:px-12 ${
            hasImage ? "pb-14 pt-28 text-white" : "py-20 sm:py-24"
          }`}
        >
          <p
            className={`text-sm font-semibold uppercase tracking-[0.22em] ${
              hasImage ? "text-white/80" : "text-brand-blue"
            }`}
          >
            Nexalinx · ASL
          </p>
          <h1
            className={`mt-4 max-w-3xl text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl ${
              hasImage ? "text-white" : "text-brand-green"
            }`}
          >
            {banner.headline}
          </h1>
          {banner.intro && (
            <p
              className={`mt-6 max-w-2xl text-lg leading-relaxed ${
                hasImage ? "text-white/85" : "text-ink-soft"
              }`}
            >
              {banner.intro}
            </p>
          )}
        </div>
      </section>

      {/* ── Company feature blocks (alternating) ───── */}
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-12">
        <div className="space-y-8 lg:space-y-12">
          {companies.map((c, i) => {
            const green = i % 2 === 1;
            const accentText = green ? "text-brand-green" : "text-brand-blue";
            const website = c.website
              ? /^https?:\/\//.test(c.website)
                ? c.website
                : `https://${c.website}`
              : "";
            return (
              <article
                key={c.id}
                className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              >
                <div
                  className={`flex flex-col lg:items-stretch ${
                    green ? "lg:flex-row-reverse" : "lg:flex-row"
                  }`}
                >
                  {/* Visual panel */}
                  <div
                    className={`relative flex min-h-[260px] items-center justify-center overflow-hidden p-8 lg:w-[40%] ${
                      green
                        ? "bg-gradient-to-br from-brand-green to-brand-green-dark"
                        : "bg-gradient-to-br from-brand-blue to-brand-blue-dark"
                    }`}
                  >
                    {/* Decorative rings fill the colour field */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/15"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-white/5"
                    />

                    {c.logo ? (
                      <span className="relative flex aspect-[16/10] w-64 max-w-[80%] items-center justify-center rounded-2xl bg-white p-7 shadow-xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.logo}
                          alt={c.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </span>
                    ) : (
                      <span className="relative text-center text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                        {c.name}
                      </span>
                    )}
                  </div>

                  {/* Content panel */}
                  <div className="flex-1 p-7 lg:p-9">
                    <p
                      className={`text-xs font-bold uppercase tracking-[0.18em] ${accentText}`}
                    >
                      {c.role}
                    </p>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                      {c.name}
                    </h2>

                    {/* Meta chips */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {c.period && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-ink-soft">
                          {c.period}
                        </span>
                      )}
                      {c.location && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-ink-soft">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 21s-7-6.3-7-11a7 7 0 1114 0c0 4.7-7 11-7 11z" />
                            <circle cx="12" cy="10" r="2.5" />
                          </svg>
                          {c.location}
                        </span>
                      )}
                    </div>

                    {c.description && (
                      <p className="mt-5 leading-relaxed text-ink-soft">
                        {c.description}
                      </p>
                    )}

                    {c.highlights.length > 0 && (
                      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                        {c.highlights.map((h, hi) => (
                          <li key={hi} className="flex items-start gap-2.5">
                            <svg
                              viewBox="0 0 24 24"
                              className={`mt-0.5 h-4 w-4 shrink-0 ${accentText}`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path
                                d="M20 6L9 17l-5-5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="text-sm leading-snug text-ink">
                              {h}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {website && (
                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-6 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors ${
                          green
                            ? "bg-brand-green hover:bg-brand-green-dark"
                            : "bg-brand-blue hover:bg-brand-blue-dark"
                        }`}
                      >
                        Visit website
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            d="M5 12h14M13 6l6 6-6 6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {companies.length === 0 && (
          <p className="text-center text-ink-faint">Content coming soon.</p>
        )}
      </div>
    </div>
  );
}
