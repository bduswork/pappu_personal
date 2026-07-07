"use client";

import { useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import CollectionBlock from "@/components/admin/CollectionBlock";

const INTRO =
  "<p>ABM Whaiduzzaman speaks and consults on software architecture, smart metering & AMI, telecom billing, healthcare IT (HL7/DICOM), SaaS at scale, and disciplined entrepreneurship — with multi-country keynote and consulting experience.</p>";

const FIXED_FIELDS = ["Name", "Email", "Phone", "Message"];

export default function SpeakingEditor() {
  const [ctaLabel, setCtaLabel] = useState("Book me");
  const [ctaLink, setCtaLink] = useState("");
  const [video, setVideo] = useState("");
  const [, setIntro] = useState(INTRO);
  const [subjects, setSubjects] = useState<string[]>([
    "Keynote speaking",
    "Fireside chat / Q&A",
    "Consulting engagement",
    "Other",
  ]);

  return (
    <div>
      <EditorHeader
        title="Edit: Speaking & Consulting"
        description="Hero, speaking intro, upcoming events, past talks, and a hire-me booking form."
        viewHref="/speaking"
      />

      {/* Hero */}
      <BlockCard label="Hero">
        <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
          <ImageField value="" onChange={() => {}} label="Hero image" boxClass="aspect-video w-full" />
          <div className="space-y-4">
            <Field label="Video URL (optional)" value={video} onChange={setVideo} placeholder="YouTube link — shows a play button" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Button label" value={ctaLabel} onChange={setCtaLabel} />
              <Field label="Button link" value={ctaLink} onChange={setCtaLink} placeholder="#booking or https://…" />
            </div>
          </div>
        </div>
      </BlockCard>

      {/* Speaking intro */}
      <BlockCard label="Intro" hint="what you speak & consult on">
        <RichTextEditor initialHTML={INTRO} onChange={setIntro} />
      </BlockCard>

      {/* Upcoming events → Events collection */}
      <CollectionBlock
        label="Upcoming events"
        collection="Events"
        href="/admin/collections/events"
        defaultHeading="Upcoming Events"
        defaultLimit={5}
        note="Events (upcoming & past) are managed in Collections → Events; this shows the upcoming ones."
      />

      {/* Watch past talks → Videos collection */}
      <CollectionBlock
        label="Watch past talks"
        collection="Videos"
        href="/admin/collections/videos"
        defaultHeading="Watch Past Talks"
        defaultLimit={6}
        note="Recorded talks live in Collections → Videos (YouTube links)."
      />

      {/* Hire-me booking form */}
      <BlockCard label="Booking form" tone="amber" hint="Hire me to speak">
        <p className="mb-3 text-sm text-ink-soft">
          Fixed fields collected from every request:
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {FIXED_FIELDS.map((f) => (
            <span key={f} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-ink-soft">
              {f}
            </span>
          ))}
        </div>

        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Subject options
        </span>
        <div className="space-y-2">
          {subjects.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={s}
                onChange={(e) =>
                  setSubjects((xs) => xs.map((x, j) => (j === i ? e.target.value : x)))
                }
                className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
              />
              <button
                type="button"
                onClick={() => setSubjects((xs) => xs.filter((_, j) => j !== i))}
                className="rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                aria-label="Remove option"
              >
                <AdminIcon name="trash" className="h-[18px] w-[18px]" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSubjects((xs) => [...xs, "New option"])}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
        >
          <AdminIcon name="plus" className="h-4 w-4" /> Add subject option
        </button>
      </BlockCard>
    </div>
  );
}
