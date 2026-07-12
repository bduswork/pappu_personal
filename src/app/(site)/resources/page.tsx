import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/pages/getPageContent";
import { getPublishedItems } from "@/lib/getCollections";
import { isPagePublished } from "@/lib/getPageStatus";
import type { ResourcesPageContent } from "@/lib/pages/collectionPages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Free Resources — ABM Whaiduzzaman",
  description: "Free templates, guides and tools for founders and technologists.",
};

const href = (u: string) => (u && !/^https?:\/\//.test(u) && !u.startsWith("/") ? `https://${u}` : u);

export default async function ResourcesPage() {
  if (!(await isPagePublished("/resources"))) notFound();

  const [{ banner }, resources] = await Promise.all([
    getPageContent<ResourcesPageContent>("resources"),
    getPublishedItems("resources"),
  ]);
  const hasImage = !!banner.image;

  return (
    <div>
      {/* ── Banner ─────────────────────────────────── */}
      <section className={`relative flex flex-col overflow-hidden ${hasImage ? "min-h-[320px] justify-end lg:min-h-[42vh]" : ""}`}>
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
            Free Resources
          </p>
          <h1 className={`mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl ${hasImage ? "text-white" : "text-brand-green"}`}>
            {banner.headline}
          </h1>
          {banner.intro && (
            <p className={`mt-4 max-w-2xl text-lg leading-relaxed ${hasImage ? "text-white/85" : "text-ink-soft"}`}>
              {banner.intro}
            </p>
          )}
        </div>
      </section>

      {/* ── Resource grid ──────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-12">
        {resources.length === 0 ? (
          <p className="text-center text-ink-faint">Resources coming soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((r) => {
              const file = href(String(r.file || ""));
              return (
                <div key={String(r.id)} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-16px_rgba(2,132,199,0.3)]">
                  {r.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={String(r.cover)} alt={String(r.title)} className="h-40 w-full object-cover" />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-brand-blue-tint to-brand-green-tint">
                      <svg viewBox="0 0 24 24" className="h-12 w-12 text-brand-blue/50" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6M9 13h6M9 17h6" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {r.format && (
                      <span className="inline-flex w-fit items-center rounded-full bg-brand-green-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-green-dark">
                        {String(r.format)}
                      </span>
                    )}
                    <h3 className="mt-3 text-lg font-extrabold tracking-tight text-ink">{String(r.title)}</h3>
                    {r.description && <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{String(r.description)}</p>}
                    {file ? (
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Download
                      </a>
                    ) : (
                      <span className="mt-5 inline-flex items-center justify-center rounded-full bg-slate-100 px-5 py-2.5 text-sm font-semibold text-ink-faint">
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
