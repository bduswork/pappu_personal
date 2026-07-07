"use client";

import { useState } from "react";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import CollectionBlock from "@/components/admin/CollectionBlock";

export default function BlogEditor() {
  const [featImg, setFeatImg] = useState("");
  const [eyebrow, setEyebrow] = useState("By ABM Whaiduzzaman · in Content");
  const [featTitle, setFeatTitle] = useState(
    "The discipline of doing one thing well"
  );
  const [featExcerpt, setFeatExcerpt] = useState(
    "Why focus beats hustle — lessons from 18 years of building software and mentoring founders."
  );
  const [readLabel, setReadLabel] = useState("Read Article");
  const [readLink, setReadLink] = useState("");

  return (
    <div>
      <EditorHeader
        title="Edit: Blog & Articles"
        description="A featured-article hero, then the article grid — cards come from Collections → Articles."
        viewHref="/blog"
      />

      {/* Featured article — the big hero at the top, like garyvaynerchuk.com/blog */}
      <BlockCard label="Featured article" tone="green" hint="the big hero at the top">
        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <ImageField
            value={featImg}
            onChange={setFeatImg}
            label="Featured image"
            boxClass="aspect-video w-full"
          />
          <div className="space-y-4">
            <Field label="Eyebrow / category" value={eyebrow} onChange={setEyebrow} placeholder="By … · in Content" />
            <Field label="Title" value={featTitle} onChange={setFeatTitle} />
            <Field label="Excerpt" textarea value={featExcerpt} onChange={setFeatExcerpt} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Button label" value={readLabel} onChange={setReadLabel} />
              <Field label="Button link" value={readLink} onChange={setReadLink} placeholder="https://… or /blog/slug" />
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-faint">
          Tip: this is the one article you want to headline. The rest appear in
          the grid below.
        </p>
      </BlockCard>

      {/* Article grid → Articles collection */}
      <CollectionBlock
        label="Article grid"
        collection="Articles"
        href="/admin/collections/articles"
        defaultHeading="Latest Articles"
        defaultLimit={9}
        note="Each card shows its cover image, category tags, title and excerpt — set per-article in Collections → Articles."
      />
    </div>
  );
}
