import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTheBook } from "@/lib/pages/getTheBook";
import { isPagePublished } from "@/lib/getPageStatus";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Book — ABM Whaiduzzaman",
  description: "The book by ABM Whaiduzzaman on focus and disciplined entrepreneurship.",
};

export default async function TheBookPage() {
  if (!(await isPagePublished("/the-book"))) notFound();

  const { banner, cover, title, subtitle, description, highlights, buyLinks } =
    await getTheBook();
  const links = buyLinks.filter((l) => l.url);

  return (
    <div>
      {/* ── Optional banner ────────────────────────── */}
      {banner.image && (
        <section className="relative flex min-h-[300px] flex-col justify-end overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={banner.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/5" />
          <div className="relative w-full max-w-4xl px-6 pb-12 pt-24 text-white lg:px-12">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/80">
              The Book
            </p>
            {banner.text && <p className="mt-3 max-w-2xl text-lg text-white/90">{banner.text}</p>}
          </div>
        </section>
      )}

      {/* ── Book feature ───────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blue-tint via-white to-brand-green-tint">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 lg:grid-cols-[300px_1fr] lg:gap-14 lg:px-12">
          {/* Cover */}
          <div className="mx-auto w-full max-w-[280px]">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover}
                alt={title}
                className="w-full rounded-lg shadow-2xl ring-1 ring-black/5 transition-transform duration-500 hover:-translate-y-1 hover:rotate-1"
              />
            ) : (
              <div className="flex aspect-[3/4] w-full flex-col items-center justify-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-blue-dark p-6 text-center shadow-2xl">
                <span className="text-2xl font-extrabold leading-tight text-white">{title}</span>
                {subtitle && <span className="mt-2 text-sm text-white/75">{subtitle}</span>}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {!banner.image && (
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue">
                The Book
              </p>
            )}
            <h1 className="mt-2 text-4xl font-extrabold leading-[1.1] tracking-tight text-brand-green sm:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 text-xl font-medium text-ink">{subtitle}</p>
            )}
            {!banner.image && banner.text && (
              <p className="mt-4 text-ink-soft">{banner.text}</p>
            )}
            <div
              className="mt-5 [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-ink-soft [&_p:first-child]:mt-0"
              dangerouslySetInnerHTML={{ __html: description }}
            />

            {links.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {links.map((l, i) => {
                  const url = /^https?:\/\//.test(l.url) ? l.url : `https://${l.url}`;
                  return (
                    <a
                      key={l.id}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide shadow-sm transition-colors ${
                        i === 0
                          ? "bg-brand-green text-white hover:bg-brand-green-dark"
                          : "border border-line bg-white text-ink hover:border-brand-blue hover:text-brand-blue"
                      }`}
                    >
                      {l.label || "Buy"}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── What's inside ──────────────────────────── */}
      {highlights.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-16 lg:px-12">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">
            What&apos;s inside
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-line bg-white p-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-green-soft text-brand-green-dark">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="pt-1 font-medium text-ink">{h}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
