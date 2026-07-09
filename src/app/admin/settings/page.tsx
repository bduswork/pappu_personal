"use client";

import { useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import { Card, PageHeader, Toggle, btnPrimary } from "@/components/admin/ui";

const SOCIAL_PLATFORMS = [
  "X",
  "Facebook",
  "LinkedIn",
  "YouTube",
  "Instagram",
  "TikTok",
  "Threads",
] as const;

function SectionCard({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-ink">{title}</h2>
        {hint && <p className="text-xs text-ink-faint">{hint}</p>}
      </div>
      {children}
    </Card>
  );
}

export default function SettingsPage() {
  // ── Home hero / banner ──
  const [bannerType, setBannerType] = useState<"image" | "video">("image");
  const [bannerImage, setBannerImage] = useState("");
  const [bannerVideo, setBannerVideo] = useState("");
  const [eyebrow, setEyebrow] = useState("ABM Whaiduzzaman");
  const [headline, setHeadline] = useState(
    "I build technology, train entrepreneurs, and create brands that last."
  );
  const [subtitle, setSubtitle] = useState(
    "Three pillars, one mission — turning ideas into products, founders into operators, and ventures into lasting brands."
  );
  const [cta1Label, setCta1Label] = useState("My Story");
  const [cta1Link, setCta1Link] = useState("/my-story");
  const [cta2Label, setCta2Label] = useState("Book a Session");
  const [cta2Link, setCta2Link] = useState("/contact");

  // ── Contact ──
  const [phone, setPhone] = useState("+880 1791-001818");
  const [email, setEmail] = useState("pappow@gmail.com");
  const [address, setAddress] = useState("Kha-116/1, South Badda, Dhaka-1212");

  // ── Social ──
  const [socials, setSocials] = useState<Record<string, string>>(
    Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p, ""]))
  );

  // ── Newsletter ──
  const [nlHeading, setNlHeading] = useState("Sign up for my weekly newsletter");
  const [nlProvider, setNlProvider] = useState("");

  // ── Top banner ──
  const [tbEnabled, setTbEnabled] = useState(false);
  const [tbText, setTbText] = useState("");
  const [tbLink, setTbLink] = useState("");

  // ── SEO / footer ──
  const [seoTitle, setSeoTitle] = useState("ABM Whaiduzzaman");
  const [seoDesc, setSeoDesc] = useState(
    "Builds technology · trains entrepreneurs · creates brands"
  );
  const [copyright, setCopyright] = useState("© ABM Whaiduzzaman 2026");

  return (
    <div>
      <PageHeader
        title="Site Settings"
        description="Global content — the home page, contact details, social links, newsletter and footer. Changes here affect the whole public site."
        action={
          <button type="button" className={btnPrimary}>
            Save changes
          </button>
        }
      />

      <div className="space-y-6">
        {/* ── Home hero / banner ── */}
        <SectionCard title="Home banner" hint="The hero at the top of the home page.">
          {/* banner type switch */}
          <div className="mb-4">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Banner background
            </span>
            <div className="inline-flex rounded-lg border border-line p-0.5">
              {(["image", "video"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setBannerType(t)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                    bannerType === t
                      ? "bg-brand-green text-white"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <AdminIcon name={t === "image" ? "media" : "videos"} className="h-4 w-4" />
                  {t === "image" ? "Image" : "YouTube video"}
                </button>
              ))}
            </div>
          </div>

          {bannerType === "image" ? (
            <div className="max-w-md">
              <ImageField value={bannerImage} onChange={setBannerImage} label="Banner image" boxClass="aspect-video w-full" />
            </div>
          ) : (
            <Field
              label="YouTube video URL"
              value={bannerVideo}
              onChange={setBannerVideo}
              placeholder="https://youtube.com/watch?v=…  (plays muted behind the hero)"
            />
          )}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Eyebrow" value={eyebrow} onChange={setEyebrow} />
            <div className="sm:col-span-2">
              <Field label="Headline" textarea value={headline} onChange={setHeadline} rows={2} />
            </div>
            <div className="sm:col-span-2">
              <Field label="Subtitle" textarea value={subtitle} onChange={setSubtitle} />
            </div>
            <Field label="Primary button label" value={cta1Label} onChange={setCta1Label} />
            <Field label="Primary button link" value={cta1Link} onChange={setCta1Link} />
            <Field label="Secondary button label" value={cta2Label} onChange={setCta2Label} />
            <Field label="Secondary button link" value={cta2Link} onChange={setCta2Link} />
          </div>
        </SectionCard>

        {/* ── Contact ── */}
        <SectionCard title="Contact details" hint="Shown on the Contact page and in the sidebar.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone" value={phone} onChange={setPhone} />
            <Field label="Email" value={email} onChange={setEmail} />
            <div className="sm:col-span-2">
              <Field label="Address" value={address} onChange={setAddress} />
            </div>
          </div>
        </SectionCard>

        {/* ── Social links ── */}
        <SectionCard title="Social links" hint="Icons in the sidebar and footer link to these.">
          <div className="grid gap-3 sm:grid-cols-2">
            {SOCIAL_PLATFORMS.map((p) => (
              <Field
                key={p}
                label={p}
                value={socials[p]}
                onChange={(v) => setSocials((s) => ({ ...s, [p]: v }))}
                placeholder="https://…"
              />
            ))}
          </div>
        </SectionCard>

        {/* ── Newsletter ── */}
        <SectionCard title="Newsletter" hint="The signup band at the bottom of pages.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Heading" value={nlHeading} onChange={setNlHeading} />
            <Field label="Provider endpoint" value={nlProvider} onChange={setNlProvider} placeholder="Mailchimp / ConvertKit URL" />
          </div>
        </SectionCard>

        {/* ── Top banner ── */}
        <SectionCard title="Top banner" hint="The optional strip across the very top (like a promo).">
          <label className="mb-4 flex items-center gap-2 text-sm font-medium text-ink">
            <Toggle checked={tbEnabled} onChange={() => setTbEnabled((v) => !v)} label="Enable top banner" />
            Show the top banner
          </label>
          {tbEnabled && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Text" value={tbText} onChange={setTbText} placeholder="e.g. Check out the new book!" />
              <Field label="Link" value={tbLink} onChange={setTbLink} placeholder="https://…" />
            </div>
          )}
        </SectionCard>

        {/* ── SEO & footer ── */}
        <SectionCard title="SEO & footer">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Default page title" value={seoTitle} onChange={setSeoTitle} />
            <Field label="Footer copyright" value={copyright} onChange={setCopyright} />
            <div className="sm:col-span-2">
              <Field label="Default meta description" textarea value={seoDesc} onChange={setSeoDesc} />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
