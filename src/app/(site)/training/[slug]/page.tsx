import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProgramBySlug } from "@/lib/getPrograms";
import { getSettings } from "@/lib/getSettings";
import { plainBrand } from "@/lib/programs";
import BrandName from "@/components/BrandName";
import ProgramCountdown from "@/components/ProgramCountdown";
import EnrollForm from "@/components/EnrollForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  return {
    title: program ? `${plainBrand(program.name)} — ABM Whaiduzzaman` : "Program",
    description: program?.tagline,
  };
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [program, settings] = await Promise.all([
    getProgramBySlug(slug),
    getSettings(),
  ]);
  if (!program || !program.published) notFound();

  const whatsappNumber = settings.contact.whatsapp || settings.contact.phone;

  const { name, tagline, hero, about, startAt, endAt, modules, snapshots, enrollLabel } =
    program;
  const hasHero = !!hero;
  const gallery = snapshots.filter((s) => s.url);

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

        <div
          className={`relative w-full max-w-4xl px-6 lg:px-12 ${
            hasHero ? "pb-12 pt-28 text-white" : "py-16 sm:py-20"
          }`}
        >
          {tagline && (
            <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${hasHero ? "text-white/80" : "text-brand-blue"}`}>
              Programs &amp; Master Classes
            </p>
          )}
          <h1 className={`mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl ${hasHero ? "text-white" : "text-brand-green"}`}>
            <BrandName name={name} />
          </h1>
          {tagline && (
            <p className={`mt-3 text-lg ${hasHero ? "text-white/85" : "text-ink-soft"}`}>{tagline}</p>
          )}
          <div className="mt-6">
            <ProgramCountdown startAt={startAt} endAt={endAt} />
          </div>
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

        {/* ── Themes / curriculum ──────────────────── */}
        {modules.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">
              What&apos;s inside
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {modules.map((m, i) => (
                <div
                  key={m.id}
                  className="flex gap-4 rounded-2xl border border-line bg-white p-6"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green-soft text-sm font-extrabold text-brand-green-dark">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-extrabold tracking-tight text-ink">{m.title}</h3>
                    {m.description && (
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{m.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Snapshots gallery ────────────────────── */}
        {gallery.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">
              Inside the program
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((s) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={s.id}
                  src={s.url}
                  alt="Program slide"
                  className="aspect-video w-full rounded-xl border border-line object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Enroll ───────────────────────────────── */}
        <section className="mt-16" id="enroll">
          <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Book a session
          </h2>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Enrollment is open while the program runs. Apply below and we&apos;ll continue on WhatsApp.
          </p>
          <div className="mt-6">
            <EnrollForm
              programSlug={slug}
              programName={plainBrand(name)}
              ctaLabel={enrollLabel}
              whatsappNumber={whatsappNumber}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
