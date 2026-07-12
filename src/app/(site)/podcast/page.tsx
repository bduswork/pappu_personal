import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/pages/getPageContent";
import { getPublishedItems } from "@/lib/getCollections";
import { isPagePublished } from "@/lib/getPageStatus";
import { youtubeId } from "@/lib/siteSettings";
import VideoGrid, { type GridVideo } from "@/components/VideoGrid";
import type { PodcastContent } from "@/lib/pages/collectionPages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Podcast & Videos — ABM Whaiduzzaman",
  description: "Talks, conversations and lessons — watch and listen.",
};

const href = (u: string) => (u && !/^https?:\/\//.test(u) && !u.startsWith("/") ? `https://${u}` : u);

export default async function PodcastPage() {
  if (!(await isPagePublished("/podcast"))) notFound();

  const [{ banner, intro, platforms, testimonials }, videos] = await Promise.all([
    getPageContent<PodcastContent>("podcast"),
    getPublishedItems("videos"),
  ]);
  const hasImage = !!banner.image;
  const links = platforms.filter((p) => p.url);
  const watchable = videos.filter((v) => youtubeId(String(v.youtubeUrl)));

  return (
    <div>
      {/* ── Hero ───────────────────────────────────── */}
      <section className={`relative flex flex-col overflow-hidden ${hasImage ? "min-h-[340px] justify-end lg:min-h-[44vh]" : ""}`}>
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={banner.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        {hasImage ? (
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/5" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-tint via-white to-brand-green-tint" />
        )}
        <div className={`relative w-full max-w-4xl px-6 lg:px-12 ${hasImage ? "pb-12 pt-24 text-white" : "py-16 sm:py-20"}`}>
          <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${hasImage ? "text-white/80" : "text-brand-blue"}`}>
            Podcast &amp; Videos
          </p>
          <h1 className={`mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl ${hasImage ? "text-white" : "text-brand-green"}`}>
            {banner.headline}
          </h1>
          {intro && (
            <div
              className={`mt-4 max-w-2xl text-lg [&_p]:leading-relaxed ${hasImage ? "text-white/85" : "text-ink-soft"}`}
              dangerouslySetInnerHTML={{ __html: intro }}
            />
          )}
          {links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {links.map((p) => (
                <a
                  key={p.id}
                  href={href(p.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${hasImage ? "bg-white/15 text-white hover:bg-white/25" : "border border-line bg-white text-ink hover:border-brand-blue hover:text-brand-blue"}`}
                >
                  {p.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-12">
        {/* ── Video grid (3 per row, play inline) ──── */}
        <VideoGrid
          videos={watchable.map<GridVideo>((v) => ({
            id: String(v.id),
            title: String(v.title),
            video: String(v.youtubeUrl),
            thumbnail: String(v.thumbnail || ""),
            category: String(v.category || ""),
            date: String(v.date || ""),
          }))}
        />

        {/* ── Testimonials ─────────────────────────── */}
        {testimonials.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">What listeners say</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {testimonials.map((t) => (
                <figure key={t.id} className="rounded-2xl border border-line bg-white p-6">
                  <blockquote className="text-lg leading-relaxed text-ink">“{t.quote}”</blockquote>
                  {t.name && <figcaption className="mt-3 text-sm font-semibold text-ink-soft">— {t.name}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
