import type { Metadata } from "next";
import { getBuildsSoftware } from "@/lib/pages/getBuildsSoftware";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Builds Software — ABM Whaiduzzaman",
  description:
    "Software architecture and technology leadership across utilities, telecom, healthcare and banking.",
};

export default async function BuildsSoftwarePage() {
  const { banner, groups } = await getBuildsSoftware();
  const hasImage = !!banner.image;

  return (
    <div>
      {/* ── Banner ─────────────────────────────────── */}
      <section
        className={`relative flex flex-col overflow-hidden ${
          hasImage ? "min-h-[420px] justify-end lg:min-h-[60vh]" : ""
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

      {/* ── Role groups ────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-12">
        {groups.map((group) => (
          <section key={group.id} className="mb-14 last:mb-0">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">
              {group.heading}
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    className={`group flex flex-col rounded-2xl border border-line bg-white p-6 transition-all ${
                      card.link ? "hover:-translate-y-1 hover:shadow-lg" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {card.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={card.logo}
                          alt={card.title}
                          className="h-12 w-auto max-w-[7rem] object-contain"
                        />
                      ) : (
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue-tint text-lg font-extrabold text-brand-blue">
                          {card.title.charAt(0) || "•"}
                        </span>
                      )}
                      {card.badge && (
                        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
                          {card.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-xl font-extrabold tracking-tight text-ink">
                      {card.title}
                    </h3>
                    {card.description && (
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                        {card.description}
                      </p>
                    )}
                    {card.link && (
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue">
                        Visit
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
