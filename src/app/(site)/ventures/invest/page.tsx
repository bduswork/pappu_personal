import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageContent } from "@/lib/pages/getPageContent";
import { isPagePublished } from "@/lib/getPageStatus";
import PartnershipForm from "@/components/PartnershipForm";
import type { InvestContent } from "@/lib/pages/investPartner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Invest & Partner — ABM Whaiduzzaman",
  description: "Partner with ABM Whaiduzzaman to build and scale ventures.",
};

export default async function InvestPartnerPage() {
  if (!(await isPagePublished("/ventures/invest"))) notFound();

  const { banner, pitch, opportunities, form } =
    await getPageContent<InvestContent>("ventures-invest");
  const hasImage = !!banner.image;

  return (
    <div>
      {/* ── Banner ─────────────────────────────────── */}
      <section className={`relative flex flex-col overflow-hidden ${hasImage ? "min-h-[360px] justify-end lg:min-h-[48vh]" : ""}`}>
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
            Ventures
          </p>
          <h1 className={`mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl ${hasImage ? "text-white" : "text-brand-green"}`}>
            {banner.headline}
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-12">
        {/* ── Pitch ────────────────────────────────── */}
        {pitch && (
          <section className="mx-auto max-w-3xl">
            <div
              className="text-lg [&_a]:font-semibold [&_a]:text-brand-blue [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-ink-soft [&_p:first-child]:mt-0 [&_strong]:font-semibold [&_strong]:text-ink"
              dangerouslySetInnerHTML={{ __html: pitch }}
            />
          </section>
        )}

        {/* ── Opportunities ────────────────────────── */}
        {opportunities.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">Ways to work together</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {opportunities.map((o, i) => (
                <div key={o.id} className="rounded-2xl border border-line bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green-soft text-sm font-extrabold text-brand-green-dark">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold tracking-tight text-ink">{o.title}</h3>
                  {o.description && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{o.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Partnership form ─────────────────────── */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{form.heading}</h2>
          {form.intro && <p className="mt-2 max-w-2xl text-ink-soft">{form.intro}</p>}
          <div className="mt-6">
            <PartnershipForm />
          </div>
        </section>
      </div>
    </div>
  );
}
