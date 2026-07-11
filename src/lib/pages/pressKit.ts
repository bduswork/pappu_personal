/**
 * "Press Kit" page content — banner, biography, a downloadable one-sheet, a
 * headshots gallery, and recent-press items. Stored under key "page:press-kit".
 * (Client-safe: no Prisma here.)
 */

export type Photo = { id: string; url: string };

export type PressItem = {
  id: string;
  outlet: string;
  title: string;
  date: string;
  link: string;
  image: string;
};

export type PressKitContent = {
  banner: { image: string; headline: string };
  portrait: string; // large photo beside the biography
  bio: string; // rich-text HTML
  oneSheet: { url: string; label: string };
  photos: Photo[];
  press: PressItem[];
};

export const DEFAULT_PRESS_KIT: PressKitContent = {
  banner: { image: "", headline: "Press Kit" },
  portrait: "",
  bio: "<p>ABM Whaiduzzaman is a software architect and technology leader, currently CTO of Nexalinx, where he designs Hospital ERP and Government MIS platforms as scalable, HL7/DICOM-compliant SaaS.</p><p>Over 18+ years he has built large-scale billing, metering and enterprise systems for utilities, telecom, healthcare and banking across Bangladesh, China, the USA and Uganda — including telecom roaming for GrameenPhone, prepaid vending for Uganda's UMEME, and AMI/MDM platforms for national utilities.</p><p>He holds an MS in Computer Science from Jahangirnagar University, is PMP-certified, and is a member of BASIS and the Bangladesh Computer Society. He also trains entrepreneurs through One-Focus.</p>",
  oneSheet: { url: "", label: "Download one-sheet (PDF)" },
  photos: [],
  press: [],
};

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

function coercePhoto(v: Partial<Photo>, i: number): Photo {
  return { id: str(v.id) || `ph-${i}`, url: str(v.url) };
}

function coercePress(v: Partial<PressItem>, i: number): PressItem {
  return {
    id: str(v.id) || `pr-${i}`,
    outlet: str(v.outlet),
    title: str(v.title),
    date: str(v.date),
    link: str(v.link),
    image: str(v.image),
  };
}

export function withPressKitDefaults(value: unknown): PressKitContent {
  const v = (value ?? {}) as Partial<PressKitContent>;
  return {
    banner: { ...DEFAULT_PRESS_KIT.banner, ...(v.banner ?? {}) },
    portrait: str(v.portrait),
    bio: typeof v.bio === "string" ? v.bio : DEFAULT_PRESS_KIT.bio,
    oneSheet: { ...DEFAULT_PRESS_KIT.oneSheet, ...(v.oneSheet ?? {}) },
    photos: Array.isArray(v.photos) ? v.photos.map(coercePhoto) : DEFAULT_PRESS_KIT.photos,
    press: Array.isArray(v.press) ? v.press.map(coercePress) : DEFAULT_PRESS_KIT.press,
  };
}
