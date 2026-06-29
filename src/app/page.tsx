import Link from "next/link";

const PILLARS = [
  {
    title: "Builds Technology",
    brand: "ABM Whaiduzzaman",
    body: "Software, products, and platforms — from Nexalinx & ASL to client work and case studies.",
    href: "/builds-software",
    accent: "blue" as const,
    cta: "Explore the work",
  },
  {
    title: "Trains Entrepreneurs",
    brand: "One-Focus",
    body: "Programs, masterclasses, the book, podcast, and an academy that sharpens founders to a single focus.",
    href: "/one-focus",
    accent: "green" as const,
    cta: "Enter One-Focus",
  },
  {
    title: "Creates Brands",
    brand: "Ventures",
    body: "Zariya Living, Heritique, AVA, and partnership opportunities for the next generation of brands.",
    href: "/ventures/zariya-living",
    accent: "blue" as const,
    cta: "Meet the ventures",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-green-tint via-white to-brand-blue-tint">
        <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32 lg:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-green">
            ABM Whaiduzzaman
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-6xl">
            I build technology, train entrepreneurs, and create{" "}
            <span className="text-brand-green">brands that last.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Three pillars, one mission — to turn ideas into products, founders
            into operators, and ventures into lasting brands.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/my-story"
              className="rounded-full bg-brand-green px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-brand-green-dark"
            >
              My Story
            </Link>
            <Link
              href="/book-a-session"
              className="rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:border-brand-blue hover:text-brand-blue"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-12">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">
          Three Pillars
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {PILLARS.map((p) => (
            <Link
              key={p.title}
              href={p.href}
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
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                {p.body}
              </p>
              <span
                className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${
                  p.accent === "green" ? "text-brand-green" : "text-brand-blue"
                }`}
              >
                {p.cta}
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
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
