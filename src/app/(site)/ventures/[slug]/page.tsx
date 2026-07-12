import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVentureBySlug } from "@/lib/getVentures";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVentureBySlug(slug);
  return { title: v ? `${v.name} — ABM Whaiduzzaman` : "Venture", description: v?.tagline };
}

export default async function VenturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = await getVentureBySlug(slug);
  if (!v || !v.published) notFound();

  const { name, tagline, hero, logo, about, website, gallery, ctaLabel, ctaLink } = v;
  const hasHero = !!hero;
  const photos = gallery.filter((g) => g.url);
  const link = ctaLink || website;
  const cta = link ? (/^https?:\/\//.test(link) ? link : `https://${link}`) : "";

  return (
    <div>
      {/* ── Hero ───────────────────────────────────── */}
      <section
        className={`relative flex flex-col overflow-hidden ${
          hasHero ? "min-h-[420px] justify-end lg:min-h-[56vh]" : ""
        }`}
      >
        {hasHero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        {hasHero ? (
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/5" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-tint via-white to-brand-green-tint" />
        )}

        <div className={`relative w-full max-w-4xl px-6 lg:px-12 ${hasHero ? "pb-12 pt-28 text-white" : "py-16 sm:py-20"}`}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={name} className="mb-5 h-16 w-auto max-w-[12rem] object-contain" />
          ) : (
            <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${hasHero ? "text-white/80" : "text-brand-blue"}`}>
              Ventures
            </p>
          )}
          <h1 className={`mt-2 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl ${hasHero ? "text-white" : "text-brand-green"}`}>
            {name}
          </h1>
          {tagline && <p className={`mt-3 text-lg ${hasHero ? "text-white/85" : "text-ink-soft"}`}>{tagline}</p>}
          {cta && (
            <a
              href={cta}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-brand-green px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-brand-green-dark"
            >
              {ctaLabel || "Visit site"}
            </a>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-12">
        {/* ── About ────────────────────────────────── */}
        {about && (
          <section className="mx-auto max-w-3xl">
            <div
              className="text-lg [&_a]:font-semibold [&_a]:text-brand-blue [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-ink-soft [&_p:first-child]:mt-0 [&_strong]:font-semibold [&_strong]:text-ink"
              dangerouslySetInnerHTML={{ __html: about }}
            />
          </section>
        )}

        {/* ── Gallery ──────────────────────────────── */}
        {photos.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">Gallery</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {photos.map((g) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={g.id}
                  src={g.url}
                  alt={name}
                  className="aspect-square w-full rounded-2xl border border-line object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
