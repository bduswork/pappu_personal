import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBuildsSoftware } from "@/lib/pages/getBuildsSoftware";
import { isPagePublished } from "@/lib/getPageStatus";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Builds Software — ABM Whaiduzzaman",
  description:
    "Software architecture and technology leadership across utilities, telecom, healthcare and banking.",
};

export default async function BuildsSoftwarePage() {
  if (!(await isPagePublished("/builds-software"))) notFound();

  const { banner, groups } = await getBuildsSoftware();
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
            Builds Software
          </p>
          <h1
            className={`mt-4 max-w-3xl text-2xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl ${
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

      {/* ── Role groups (table grid + hover reveal) ─── */}
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-12">
        {groups.map((group) => (
          <section key={group.id} className="mb-16 last:mb-0">
            <h2 className="inline-block rounded bg-brand-green-soft px-3 py-1 text-sm font-extrabold uppercase tracking-wide text-brand-green-dark">
              {group.heading}
            </h2>

            {/* Cells share 1px lines via the container background showing
                through gap-px; partial rows read as faint empty cells. */}
            <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {group.cards.map((card) => {
                const Wrapper = card.link ? "a" : "div";
                return (
                  <Wrapper
                    key={card.id}
                    {...(card.link
                      ? {
                          href: card.link,
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {})}
                    className="group relative flex min-h-[210px] flex-col items-center justify-center overflow-hidden bg-white p-6 text-center"
                  >
                    {/* Hover wash (light brand gradient) */}
                    <span
                      aria-hidden
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-brand-blue-tint via-white to-brand-green-tint"
                    />
                    {/* Accent bar on hover */}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 z-20 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand-blue to-brand-green transition-transform duration-500 group-hover:scale-x-100"
                    />

                    <div className="relative z-10 flex w-full flex-col items-center">
                      {/* Logo (if provided) — always visible */}
                      {card.logo && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={card.logo}
                          alt={card.title}
                          className="mb-3 h-12 w-auto max-w-[8rem] object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      )}

                      {/* Title — always visible */}
                      <h3 className="text-lg font-extrabold tracking-tight text-ink transition-colors duration-300 group-hover:text-brand-blue">
                        {card.title}
                      </h3>

                      {/* Badge / date — always visible */}
                      {card.badge && (
                        <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-blue">
                          {card.badge}
                        </p>
                      )}

                      {/* Description + link — always shown on mobile, reveal on hover on desktop */}
                      <div className="mt-2.5 grid grid-rows-[1fr] opacity-100 transition-all duration-500 lg:mt-0 lg:grid-rows-[0fr] lg:opacity-0 lg:group-hover:mt-2.5 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100">
                        <div className="overflow-hidden">
                          {card.description && (
                            <p className="text-xs leading-relaxed text-ink-soft">
                              {card.description}
                            </p>
                          )}
                          {card.link && (
                            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue">
                              Visit
                              <svg
                                viewBox="0 0 24 24"
                                className="h-3.5 w-3.5"
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
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          </section>
        ))}

        {groups.length === 0 && (
          <p className="text-center text-ink-faint">Content coming soon.</p>
        )}
      </div>
    </div>
  );
}
