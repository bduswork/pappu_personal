import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomPageBySlug } from "@/lib/getCustomPages";
import { isPagePublished } from "@/lib/getPageStatus";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCustomPageBySlug(slug);
  return {
    title: page ? `${page.label} — ABM Whaiduzzaman` : "Page",
  };
}

export default async function CustomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getCustomPageBySlug(slug);
  if (!page) notFound();
  if (!(await isPagePublished(`/${slug}`))) notFound();

  const { label, banner, body } = page;
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
            hasImage ? "pb-12 pt-24 text-white" : "py-16 sm:py-20"
          }`}
        >
          <h1
            className={`text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl ${
              hasImage ? "text-white" : "text-brand-green"
            }`}
          >
            {banner.headline || label}
          </h1>
        </div>
      </section>

      {/* ── Body ───────────────────────────────────── */}
      {body && (
        <div className="mx-auto max-w-3xl px-6 py-16 lg:px-12">
          <div
            className="text-lg [&_a]:font-semibold [&_a]:text-brand-blue [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-ink [&_li]:mt-1 [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-ink-soft [&_p:first-child]:mt-0 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </div>
      )}
    </div>
  );
}
