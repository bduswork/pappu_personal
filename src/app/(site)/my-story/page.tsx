import type { Metadata } from "next";
import { getMyStory } from "@/lib/pages/getMyStory";
import StoryTimeline from "@/components/StoryTimeline";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Story — ABM Whaiduzzaman",
  description:
    "The journey of ABM Whaiduzzaman — from programmer to CTO and CEO across utilities, telecom, healthcare and banking.",
};

export default async function MyStoryPage() {
  const { timeline, story } = await getMyStory();

  return (
    <div>
      {/* ── Header ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pt-16 lg:px-12">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue">
          My Story
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-brand-green sm:text-4xl">
          Milestones &amp; moments
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Key chapters in an 18-year journey — from a first line of code to
          leading engineering as a CTO and CEO.
        </p>
      </section>

      {/* ── Timeline carousel ──────────────────────── */}
      {timeline.length > 0 && (
        <div className="mx-auto mt-10 max-w-6xl px-6 lg:px-12">
          <StoryTimeline items={timeline} />
        </div>
      )}

      {/* ── Biography ──────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-12">
        <div
          className="[&_a]:text-brand-blue [&_a]:underline [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-ink [&_li]:mt-1.5 [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-ink-soft [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: story }}
        />
      </section>
    </div>
  );
}
