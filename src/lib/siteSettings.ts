/**
 * Site-wide settings shape — the single source of truth used by the API,
 * the admin Settings screen, and the public home page. Stored in the
 * `settings` table under key "site" as JSON.
 */

export type BannerType = "image" | "video";

export type Pillar = {
  id: string;
  brand: string;
  title: string;
  body: string;
  link: string;
  cta: string;
  accent: "green" | "blue";
};

export type SiteSettings = {
  brand: { signature: string; favicon: string };
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
  contact: { phone: string; email: string; whatsapp: string; address: string };
  social: Record<string, string>;
  newsletter: { heading: string; provider: string };
  topBanner: { enabled: boolean; text: string; link: string };
  pillars: Pillar[];
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
  brand: { signature: "", favicon: "" },
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
    whatsapp: "",
    address: "Kha-116/1, South Badda, Dhaka-1212",
  },
  social: Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p, ""])),
  newsletter: { heading: "Sign up for my weekly newsletter", provider: "" },
  topBanner: { enabled: false, text: "", link: "" },
  pillars: [
    {
      id: "p1",
      brand: "ABM Whaiduzzaman",
      title: "Builds Technology",
      body: "Software, products, and platforms — from Nexalinx & ASL to client work and case studies.",
      link: "/builds-software",
      cta: "Explore the work",
      accent: "blue",
    },
    {
      id: "p2",
      brand: "FORCE Progression™",
      title: "Trains Entrepreneurs",
      body: "Programs, masterclasses, the book, podcast, and resources that sharpen founders to a single focus.",
      link: "/training/force-progression",
      cta: "Enter FORCE Progression™",
      accent: "green",
    },
    {
      id: "p3",
      brand: "Ventures",
      title: "Creates Brands",
      body: "Zariya Living, Heritique, AVA, and partnership opportunities for the next generation of brands.",
      link: "/ventures/zariya-living",
      cta: "Meet the ventures",
      accent: "blue",
    },
  ],
  seo: {
    title: "ABM Whaiduzzaman",
    description: "Builds technology · trains entrepreneurs · creates brands",
  },
  footer: { copyright: "© ABM Whaiduzzaman 2026" },
};

/**
 * Build a wa.me deep link from a phone/WhatsApp number and an optional
 * pre-filled message. Strips everything but digits (wa.me wants no +, spaces or
 * dashes). Returns "" if there's no usable number.
 */
export function waLink(number: string, text?: string): string {
  const digits = (number || "").replace(/\D/g, "");
  if (!digits) return "";
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
}

/** Extract an 11-char YouTube video id from a URL (watch, youtu.be, embed, shorts). */
export function youtubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/
  );
  return m ? m[1] : null;
}

/** Deep-merge stored settings over defaults so missing keys stay valid. */
export function withDefaults(value: unknown): SiteSettings {
  const v = (value ?? {}) as Partial<SiteSettings>;
  return {
    brand: { ...DEFAULT_SETTINGS.brand, ...(v.brand ?? {}) },
    home: { ...DEFAULT_SETTINGS.home, ...(v.home ?? {}) },
    contact: { ...DEFAULT_SETTINGS.contact, ...(v.contact ?? {}) },
    social: { ...DEFAULT_SETTINGS.social, ...(v.social ?? {}) },
    newsletter: { ...DEFAULT_SETTINGS.newsletter, ...(v.newsletter ?? {}) },
    topBanner: { ...DEFAULT_SETTINGS.topBanner, ...(v.topBanner ?? {}) },
    pillars: Array.isArray(v.pillars) ? (v.pillars as Pillar[]) : DEFAULT_SETTINGS.pillars,
    seo: { ...DEFAULT_SETTINGS.seo, ...(v.seo ?? {}) },
    footer: { ...DEFAULT_SETTINGS.footer, ...(v.footer ?? {}) },
  };
}
