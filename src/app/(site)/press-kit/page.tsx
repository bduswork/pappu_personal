import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPressKit } from "@/lib/pages/getPressKit";
import { isPagePublished } from "@/lib/getPageStatus";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Press Kit — ABM Whaiduzzaman",
  description: "Biography, one-sheet, headshots and recent press for ABM Whaiduzzaman.",
};

export default async function PressKitPage() {
  if (!(await isPagePublished("/press-kit"))) notFound();

  const { banner, portrait, bio, oneSheet, photos, press } = await getPressKit();
  const hasImage = !!banner.image;
  const gallery = photos.filter((p) => p.url);
  const sheetUrl = oneSheet.url
    ? /^https?:\/\//.test(oneSheet.url) || oneSheet.url.startsWith("/")
      ? oneSheet.url
      : `https://${oneSheet.url}`
    : "";

  return (
    <div>
      {/* ── Optional banner ────────────────────────── */}
      {hasImage && (
        <section className="relative flex min-h-[280px] flex-col justify-end overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={banner.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/5" />
          <div className="relative w-full max-w-6xl px-6 pb-10 pt-24 text-white lg:px-12">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/80">
              Press Kit
            </p>
          </div>
        </section>
      )}

      {/* ── Biography — portrait bleeds from the right ── */}
      <section className="relative overflow-hidden border-b border-line">
        {/* Large portrait anchored to the right edge, faded into the page */}
        {portrait && (
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={portrait}
              alt="ABM Whaiduzzaman"
              className="h-full w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/45 to-transparent" />
          </div>
        )}

        <div className="relative mx-auto max-w-6xl px-6 py-16 lg:px-12">
          {/* Stacked portrait on small screens */}
          {portrait && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={portrait}
              alt="ABM Whaiduzzaman"
              className="mb-8 aspect-[4/5] w-full max-w-[16rem] rounded-2xl object-cover object-top shadow-lg lg:hidden"
            />
          )}

          <div className="lg:w-[56%]">
            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
              Biography
            </h2>
            <div
              className="mt-6 text-lg [&_a:hover]:underline [&_a]:font-semibold [&_a]:text-brand-green [&_p:first-child]:mt-0 [&_p]:mt-5 [&_p]:leading-relaxed [&_p]:text-ink-soft [&_strong]:font-semibold [&_strong]:text-ink"
              dangerouslySetInnerHTML={{ __html: bio }}
            />
            {sheetUrl && (
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-brand-green-dark"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {oneSheet.label || "Download one-sheet"}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── Headshots filmstrip ────────────────────── */}
      {gallery.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6 lg:px-12">
            <h2 className="text-3xl font-extrabold uppercase tracking-tight text-ink">
              Headshots &amp; photos
            </h2>
          </div>
          <div className="scroll-slim mt-8 flex snap-x gap-4 overflow-x-auto px-6 pb-3 lg:px-12">
            {gallery.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.id}
                src={p.url}
                alt="Headshot"
                className="h-[300px] w-[225px] shrink-0 snap-start rounded-2xl object-cover sm:h-[440px] sm:w-[330px]"
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Recent press ───────────────────────────── */}
      {press.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20 lg:px-12">
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-ink">
            Recent press
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {press.map((p) => {
              const Wrapper = p.link ? "a" : "div";
              return (
                <Wrapper
                  key={p.id}
                  {...(p.link ? { href: p.link, target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 ${
                    p.link ? "hover:-translate-y-1 hover:shadow-[0_16px_36px_-16px_rgba(2,132,199,0.35)]" : ""
                  }`}
                >
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} className="aspect-video w-full object-cover" />
                  ) : (
                    <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-brand-blue to-brand-blue-dark px-6 text-center">
                      <span className="text-lg font-extrabold text-white/95">{p.outlet || p.title}</span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-blue">
                      {p.outlet && <span>{p.outlet}</span>}
                      {p.outlet && p.date && <span className="text-ink-faint">·</span>}
                      {p.date && <span className="text-ink-faint">{p.date}</span>}
                    </div>
                    <h3 className="mt-2 flex-1 font-extrabold leading-snug tracking-tight text-ink">
                      {p.title}
                    </h3>
                    {p.link && (
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue">
                        Read article
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
    </div>
  );
}
