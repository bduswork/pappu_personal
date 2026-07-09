import Link from "next/link";
import { getSettings } from "@/lib/getSettings";
import { youtubeId } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";

export default async function Home() {
  const s = await getSettings();
  const h = s.home;
  const vid = h.bannerType === "video" ? youtubeId(h.bannerVideo) : null;
  const hasImage = h.bannerType === "image" && !!h.bannerImage;
  const hasMedia = hasImage || !!vid;

  return (
    <div>
      {/* Hero */}
      <section
        className={`relative flex flex-col overflow-hidden ${
          hasMedia ? "min-h-[560px] justify-end lg:min-h-[82vh]" : ""
        }`}
      >
        {/* Background layer */}
        {vid ? (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <iframe
              title="Hero video"
              className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
              src={`https://www.youtube.com/embed/${vid}?autoplay=1&mute=1&loop=1&playlist=${vid}&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1`}
              allow="autoplay; encrypted-media"
            />
          </div>
        ) : hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={h.bannerImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : null}

        {/* Overlay / fallback background */}
        {hasMedia ? (
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/5" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-green-tint via-white to-brand-blue-tint" />
        )}

        <div
          className={`relative w-full max-w-3xl px-6 lg:px-12 ${
            hasMedia ? "pb-16 pt-32 text-white" : "py-24 text-ink sm:py-32"
          }`}
        >
          {h.eyebrow && (
            <p
              className={`text-sm font-semibold uppercase tracking-[0.22em] ${
                hasMedia ? "text-white/80" : "text-brand-green"
              }`}
            >
              {h.eyebrow}
            </p>
          )}
          <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-brand-green sm:text-5xl">
            {h.headline}
          </h1>
          {h.subtitle && (
            <p
              className={`mt-6 max-w-2xl text-lg leading-relaxed ${
                hasMedia ? "text-white/85" : "text-ink-soft"
              }`}
            >
              {h.subtitle}
            </p>
          )}
          <div className="mt-9 flex flex-wrap gap-4">
            {h.cta1Label && (
              <Link
                href={h.cta1Link || "#"}
                className="rounded-full bg-brand-green px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-brand-green-dark"
              >
                {h.cta1Label}
              </Link>
            )}
            {h.cta2Label && (
              <Link
                href={h.cta2Link || "#"}
                className={`rounded-full border px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
                  hasMedia
                    ? "border-white/40 text-white hover:bg-white hover:text-ink"
                    : "border-line bg-white text-ink hover:border-brand-blue hover:text-brand-blue"
                }`}
              >
                {h.cta2Label}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-12">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">
          Three Pillars
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {s.pillars.map((p) => (
            <Link
              key={p.id}
              href={p.link || "#"}
              className={`group flex flex-col rounded-2xl border p-7 transition-all hover:-translate-y-1 hover:shadow-lg ${
                p.accent === "green"
                  ? "border-brand-green-soft bg-brand-green-tint"
                  : "border-brand-blue-soft bg-brand-blue-tint"
              }`}
            >
              <span
                className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
                  p.accent === "green" ? "text-brand-green" : "text-brand-blue"
                }`}
              >
                {p.brand}
              </span>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">
                {p.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{p.body}</p>
              <span
                className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${
                  p.accent === "green" ? "text-brand-green" : "text-brand-blue"
                }`}
              >
                {p.cta}
                <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-line bg-slate-50">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center lg:px-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-ink">
            {s.newsletter.heading}
          </h2>
          <form
            action={s.newsletter.provider || "#"}
            className="mx-auto mt-6 flex max-w-md gap-2"
          >
            <input
              type="email"
              name="email"
              placeholder="Your email"
              className="w-full rounded-full border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-brand-green"
            />
            <button
              type="submit"
              className="rounded-full bg-brand-green px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-green-dark"
            >
              Sign up
            </button>
          </form>
        </div>
      </section>

      {/* Closing band */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">
              Let&apos;s build something together.
            </h2>
            <p className="mt-2 text-ink-soft">
              Speaking, consulting, partnerships, or a focused founder session.
            </p>
          </div>
          <Link
            href="/contact"
            className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-brand-blue-dark"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
