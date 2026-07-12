import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/pages/getPageContent";
import { getPublishedItems } from "@/lib/getCollections";
import { isPagePublished } from "@/lib/getPageStatus";
import type { BlogContent } from "@/lib/pages/collectionPages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog & Articles — ABM Whaiduzzaman",
  description: "Ideas on focus, building software, and disciplined entrepreneurship.",
};

const href = (u: string) => (u && !/^https?:\/\//.test(u) && !u.startsWith("/") ? `https://${u}` : u);

export default async function BlogPage() {
  if (!(await isPagePublished("/blog"))) notFound();

  const [{ featured }, articles] = await Promise.all([
    getPageContent<BlogContent>("blog"),
    getPublishedItems("articles"),
  ]);
  const hasFeatured = !!featured.title;

  return (
    <div>
      {/* ── Header ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pt-16 lg:px-12">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue">
          Blog &amp; Articles
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-green sm:text-4xl">
          Ideas, worth reading.
        </h1>
      </section>

      {/* ── Featured article ─────────────────────── */}
      {hasFeatured && (
        <section className="mx-auto mt-10 max-w-6xl px-6 lg:px-12">
          <a
            href={href(featured.buttonLink) || "#"}
            {...(featured.buttonLink ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group grid overflow-hidden rounded-3xl border border-line bg-white lg:grid-cols-2"
          >
            {featured.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={featured.image} alt={featured.title} className="h-64 w-full object-cover lg:h-full" />
            ) : (
              <div className="h-64 w-full bg-gradient-to-br from-brand-blue to-brand-green lg:h-full" />
            )}
            <div className="flex flex-col justify-center p-8 lg:p-10">
              {featured.eyebrow && (
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-blue">{featured.eyebrow}</p>
              )}
              <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl">
                {featured.title}
              </h2>
              {featured.excerpt && <p className="mt-3 leading-relaxed text-ink-soft">{featured.excerpt}</p>}
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green">
                {featured.buttonLabel || "Read article"}
                <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </a>
        </section>
      )}

      {/* ── Article grid ─────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-12">
        {articles.length === 0 ? (
          <p className="text-center text-ink-faint">No articles yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => {
              const cats = String(a.categories || "").split(",").map((c) => c.trim()).filter(Boolean);
              const link = href(String(a.link || ""));
              const Wrapper = link ? "a" : "div";
              return (
                <Wrapper
                  key={String(a.id)}
                  {...(link ? { href: link, target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 ${link ? "hover:-translate-y-1 hover:shadow-[0_16px_36px_-16px_rgba(2,132,199,0.35)]" : ""}`}
                >
                  {a.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={String(a.cover)} alt={String(a.title)} className="h-44 w-full object-cover" />
                  ) : (
                    <div className="h-44 w-full bg-gradient-to-br from-brand-blue-tint to-brand-green-tint" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      {cats.map((c) => (
                        <span key={c} className="rounded-full bg-brand-blue-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-blue-dark">
                          {c}
                        </span>
                      ))}
                      {a.date && <span className="text-xs text-ink-faint">{String(a.date)}</span>}
                    </div>
                    <h3 className="mt-2 text-lg font-extrabold leading-snug tracking-tight text-ink">{String(a.title)}</h3>
                    {a.excerpt && <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{String(a.excerpt)}</p>}
                    {link && (
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
        )}
      </div>
    </div>
  );
}
