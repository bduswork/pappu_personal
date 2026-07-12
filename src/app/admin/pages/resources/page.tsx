"use client";

import { useEffect, useState } from "react";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import CollectionBlock from "@/components/admin/CollectionBlock";
import { usePageStatus } from "@/components/admin/usePageStatus";
import {
  DEFAULT_RESOURCES_PAGE,
  withResourcesPageDefaults,
} from "@/lib/pages/collectionPages";

export default function ResourcesEditor() {
  const [banner, setBanner] = useState(DEFAULT_RESOURCES_PAGE.banner);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const ps = usePageStatus("/resources");

  useEffect(() => {
    fetch("/api/pages/resources")
      .then((r) => r.json())
      .then((d) => setBanner(withResourcesPageDefaults(d).banner))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/pages/resources", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banner }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <EditorHeader
        title="Edit: Free Resources"
        description="A banner, then downloadable resources — added in Collections → Resources."
        viewHref="/resources"
        onSave={save}
        saving={saving}
        saved={saved}
        status={ps.status}
        onStatusChange={ps.change}
      />

      {loading ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : (
        <>
          <BlockCard label="Banner" hint="background image + heading">
            <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
              <ImageField value={banner.image} onChange={(v) => setBanner((b) => ({ ...b, image: v }))} label="Banner image" boxClass="aspect-video w-full" />
              <div className="space-y-4">
                <Field label="Headline" value={banner.headline} onChange={(v) => setBanner((b) => ({ ...b, headline: v }))} />
                <Field label="Intro" textarea value={banner.intro} onChange={(v) => setBanner((b) => ({ ...b, intro: v }))} />
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
        </>
      )}
    </div>
  );
}
