import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCaseStudies } from "@/lib/pages/getCaseStudies";
import { isPagePublished } from "@/lib/getPageStatus";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Clients & Case Studies — ABM Whaiduzzaman",
  description:
    "Operators, utilities and enterprises served — and a closer look at selected projects.",
};

export default async function CaseStudiesPage() {
  if (!(await isPagePublished("/case-studies"))) notFound();

  const { banner, clients, studies } = await getCaseStudies();
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
            hasImage ? "pb-14 pt-28 text-white" : "py-20 sm:py-24"
          }`}
        >
          <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${hasImage ? "text-white/80" : "text-brand-blue"}`}>
            Clients &amp; Case Studies
          </p>
          <h1 className={`mt-4 max-w-3xl text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl ${hasImage ? "text-white" : "text-brand-green"}`}>
            {banner.headline}
          </h1>
          {banner.intro && (
            <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${hasImage ? "text-white/85" : "text-ink-soft"}`}>
              {banner.intro}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-12">
        {/* ── Client logo wall ─────────────────────── */}
        {clients.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">
              Trusted by
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {clients.map((c) => {
                const Wrapper = c.link ? "a" : "div";
                return (
                  <Wrapper
                    key={c.id}
                    {...(c.link ? { href: c.link, target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex min-h-[150px] items-center justify-center rounded-2xl border border-line bg-white p-7 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-blue-soft hover:shadow-[0_16px_36px_-14px_rgba(2,132,199,0.35)]"
                  >
                    {c.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.logo}
                        alt={c.name}
                        className="max-h-20 max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <span className="text-lg font-extrabold uppercase tracking-wide text-ink-soft transition-colors group-hover:text-brand-blue">
                        {c.name}
                      </span>
                    )}
                  </Wrapper>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Case study cards ─────────────────────── */}
        {studies.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">
              Selected work
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {studies.map((s, i) => {
                const green = i % 2 === 1;
                const Wrapper = s.link ? "a" : "div";
                return (
                  <Wrapper
                    key={s.id}
                    {...(s.link ? { href: s.link, target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={`group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 ${
                      s.link ? "hover:-translate-y-1 hover:shadow-[0_16px_40px_-16px_rgba(2,132,199,0.3)]" : ""
                    }`}
                  >
                    {/* Header: image or gradient */}
                    {s.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.image} alt={s.title} className="h-44 w-full object-cover" />
                    ) : (
                      <div
                        className={`relative flex h-32 items-center justify-center overflow-hidden ${
                          green ? "bg-gradient-to-br from-brand-green to-brand-green-dark" : "bg-gradient-to-br from-brand-blue to-brand-blue-dark"
                        }`}
                      >
                        <span aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border border-white/15" />
                        <span className="px-6 text-center text-xl font-extrabold text-white/95">
                          {s.client || s.title}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-6">
                      {s.client && (
                        <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${green ? "text-brand-green" : "text-brand-blue"}`}>
                          {s.client}
                        </p>
                      )}
                      <h3 className="mt-1.5 text-xl font-extrabold tracking-tight text-ink">
                        {s.title}
                      </h3>
                      {s.summary && (
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                          {s.summary}
                        </p>
                      )}
                      {s.link && (
                        <span className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${green ? "text-brand-green" : "text-brand-blue"}`}>
                          Read the case study
                          <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          </section>
        )}

        {clients.length === 0 && studies.length === 0 && (
          <p className="text-center text-ink-faint">Content coming soon.</p>
        )}
      </div>
    </div>
  );
}
