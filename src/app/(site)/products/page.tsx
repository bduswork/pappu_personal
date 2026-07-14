import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/pages/getProducts";
import { isPagePublished } from "@/lib/getPageStatus";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products & Platforms — ABM Whaiduzzaman",
  description:
    "Systems and platforms designed and shipped across utility, telecom, healthcare and finance.",
};

/** Pick a stable blue/green accent from the category name. */
function accentFor(category: string): "blue" | "green" {
  let h = 0;
  for (let i = 0; i < category.length; i++) h = (h + category.charCodeAt(i)) % 2;
  return h === 0 ? "blue" : "green";
}

export default async function ProductsPage() {
  if (!(await isPagePublished("/products"))) notFound();

  const { banner, products } = await getProducts();
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
            hasImage ? "pb-14 pt-28 text-white" : "py-20 sm:py-24"
          }`}
        >
          <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${hasImage ? "text-white/80" : "text-brand-blue"}`}>
            Products &amp; Platforms
          </p>
          <h1 className={`mt-4 max-w-3xl text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl ${hasImage ? "text-white" : "text-brand-green"}`}>
            {banner.headline}
          </h1>
          {banner.intro && (
            <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${hasImage ? "text-white/85" : "text-ink-soft"}`}>
              {banner.intro}
            </p>
          )}
        </div>
      </section>

      {/* ── Product grid ───────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const green = accentFor(p.category || p.name) === "green";
            const Wrapper = p.link ? "a" : "div";
            return (
              <Wrapper
                key={p.id}
                {...(p.link ? { href: p.link, target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-6 transition-all duration-300 ${
                  p.link ? "hover:-translate-y-1.5 hover:shadow-[0_16px_40px_-16px_rgba(2,132,199,0.3)]" : "hover:shadow-[0_16px_40px_-16px_rgba(2,132,199,0.18)]"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                    green ? "bg-brand-green" : "bg-brand-blue"
                  }`}
                />

                {/* Image or icon tile */}
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.name} className="mb-5 h-36 w-full rounded-xl object-cover" />
                ) : (
                  <span
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-xl font-extrabold text-white ${
                      green ? "bg-gradient-to-br from-brand-green to-brand-green-dark" : "bg-gradient-to-br from-brand-blue to-brand-blue-dark"
                    }`}
                  >
                    {(p.name.charAt(0) || "•").toUpperCase()}
                  </span>
                )}

                {p.category && (
                  <span
                    className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      green ? "bg-brand-green-soft text-brand-green-dark" : "bg-brand-blue-soft text-brand-blue-dark"
                    }`}
                  >
                    {p.category}
                  </span>
                )}
                <h3 className="mt-3 text-xl font-extrabold tracking-tight text-ink">{p.name}</h3>
                {p.description && (
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{p.description}</p>
                )}
                {p.link && (
                  <span className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${green ? "text-brand-green" : "text-brand-blue"}`}>
                    Learn more
                    <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </Wrapper>
            );
          })}
        </div>

        {products.length === 0 && (
          <p className="text-center text-ink-faint">Content coming soon.</p>
        )}
      </div>
    </div>
  );
}
