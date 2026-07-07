"use client";

import { useState } from "react";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import CollectionBlock from "@/components/admin/CollectionBlock";

export default function ResourcesEditor() {
  const [banner, setBanner] = useState("");
  const [headline, setHeadline] = useState("Free Resources");
  const [intro, setIntro] = useState(
    "Free templates, guides and tools for founders and technologists."
  );

  return (
    <div>
      <EditorHeader
        title="Edit: Free Resources"
        description="A banner, then downloadable resources — added in Collections → Resources."
        viewHref="/resources"
      />

      <BlockCard label="Banner" hint="background image + heading">
        <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
          <ImageField value={banner} onChange={setBanner} label="Banner image" boxClass="aspect-video w-full" />
          <div className="space-y-4">
            <Field label="Headline" value={headline} onChange={setHeadline} />
            <Field label="Intro" textarea value={intro} onChange={setIntro} />
          </div>
        </div>
      </BlockCard>

      <CollectionBlock
        label="Resources"
        collection="Resources"
        href="/admin/collections/resources"
        defaultHeading="Free Resources"
        defaultLimit={12}
      />
    </div>
  );
}
