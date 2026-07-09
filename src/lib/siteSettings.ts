/**
 * Site-wide settings shape — the single source of truth used by the API,
 * the admin Settings screen, and the public home page. Stored in the
 * `settings` table under key "site" as JSON.
 */

export type BannerType = "image" | "video";

export type SiteSettings = {
  home: {
    bannerType: BannerType;
    bannerImage: string;
    bannerVideo: string;
    eyebrow: string;
    headline: string;
    subtitle: string;
    cta1Label: string;
    cta1Link: string;
    cta2Label: string;
    cta2Link: string;
  };
  contact: { phone: string; email: string; address: string };
  social: Record<string, string>;
  newsletter: { heading: string; provider: string };
  topBanner: { enabled: boolean; text: string; link: string };
  seo: { title: string; description: string };
  footer: { copyright: string };
};

export const SOCIAL_PLATFORMS = [
  "X",
  "Facebook",
  "LinkedIn",
  "YouTube",
  "Instagram",
  "TikTok",
  "Threads",
] as const;

export const DEFAULT_SETTINGS: SiteSettings = {
  home: {
    bannerType: "image",
    bannerImage: "",
    bannerVideo: "",
    eyebrow: "ABM Whaiduzzaman",
    headline:
      "I build technology, train entrepreneurs, and create brands that last.",
    subtitle:
      "Three pillars, one mission — turning ideas into products, founders into operators, and ventures into lasting brands.",
    cta1Label: "My Story",
    cta1Link: "/my-story",
    cta2Label: "Book a Session",
    cta2Link: "/contact",
  },
  contact: {
    phone: "+880 1791-001818",
    email: "pappow@gmail.com",
    address: "Kha-116/1, South Badda, Dhaka-1212",
  },
  social: Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p, ""])),
  newsletter: { heading: "Sign up for my weekly newsletter", provider: "" },
  topBanner: { enabled: false, text: "", link: "" },
  seo: {
    title: "ABM Whaiduzzaman",
    description: "Builds technology · trains entrepreneurs · creates brands",
  },
  footer: { copyright: "© ABM Whaiduzzaman 2026" },
};

/** Deep-merge stored settings over defaults so missing keys stay valid. */
export function withDefaults(value: unknown): SiteSettings {
  const v = (value ?? {}) as Partial<SiteSettings>;
  return {
    home: { ...DEFAULT_SETTINGS.home, ...(v.home ?? {}) },
    contact: { ...DEFAULT_SETTINGS.contact, ...(v.contact ?? {}) },
    social: { ...DEFAULT_SETTINGS.social, ...(v.social ?? {}) },
    newsletter: { ...DEFAULT_SETTINGS.newsletter, ...(v.newsletter ?? {}) },
    topBanner: { ...DEFAULT_SETTINGS.topBanner, ...(v.topBanner ?? {}) },
    seo: { ...DEFAULT_SETTINGS.seo, ...(v.seo ?? {}) },
    footer: { ...DEFAULT_SETTINGS.footer, ...(v.footer ?? {}) },
  };
}
