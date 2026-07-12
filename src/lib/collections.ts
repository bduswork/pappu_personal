/**
 * Reusable content collections (Articles, Videos, Resources). Each collection
 * is stored in the `settings` table under key "collection:<type>" as a JSON
 * array of items. The admin manages them via CollectionEditor; the public
 * pages render the published items. (Client-safe: no Prisma here.)
 */

export type CollectionItem = Record<string, string | boolean>;
export type CollectionType =
  | "articles"
  | "videos"
  | "resources"
  | "events"
  | "press";

type Schema = { keys: string[]; bools: string[] };

const SCHEMA: Record<CollectionType, Schema> = {
  articles: {
    keys: ["id", "cover", "title", "categories", "date", "excerpt", "link", "content"],
    bools: ["published"],
  },
  videos: {
    keys: ["id", "youtubeUrl", "title", "category", "date", "thumbnail", "description"],
    bools: ["published"],
  },
  resources: {
    keys: ["id", "cover", "title", "format", "description", "file"],
    bools: ["published"],
  },
  events: {
    keys: ["id", "name", "date", "location", "kind", "link", "videoUrl"],
    bools: ["published"],
  },
  press: {
    keys: ["id", "cover", "title", "outlet", "date", "link", "excerpt"],
    bools: ["published"],
  },
};

export const COLLECTION_TYPES = Object.keys(SCHEMA) as CollectionType[];

export function isCollectionType(t: string): t is CollectionType {
  return (COLLECTION_TYPES as string[]).includes(t);
}

/** Seed content shown until the admin adds their own. */
const DEFAULT_ITEMS: Record<CollectionType, CollectionItem[]> = {
  articles: [
    {
      id: "a1",
      cover: "",
      title: "The discipline of doing one thing well",
      categories: "Focus",
      date: "2026-06-15",
      excerpt:
        "Why focus beats hustle — lessons from 18 years of building software and mentoring founders.",
      link: "",
      content: "",
      published: true,
    },
    {
      id: "a2",
      cover: "",
      title: "Lessons from scaling Nexalinx",
      categories: "Business",
      date: "2026-05-10",
      excerpt:
        "What building a healthcare & government SaaS taught me about architecture at scale.",
      link: "",
      content: "",
      published: true,
    },
  ],
  videos: [],
  events: [],
  press: [],
  resources: [
    {
      id: "r1",
      cover: "",
      title: "Founder's One-Page Business Plan",
      format: "PDF",
      description: "A single-page template to pressure-test any business idea.",
      file: "",
      published: true,
    },
    {
      id: "r2",
      cover: "",
      title: "Weekly Focus Tracker",
      format: "Sheet",
      description: "Plan the one thing that matters each week.",
      file: "",
      published: true,
    },
  ],
};

const str = (v: unknown) => (typeof v === "string" ? v : "");

/** Coerce/validate a stored collection; missing/invalid → the seed defaults. */
export function withCollection(type: CollectionType, value: unknown): CollectionItem[] {
  if (!Array.isArray(value)) return DEFAULT_ITEMS[type];
  const s = SCHEMA[type];
  return value.map((raw, i) => {
    const v = (raw ?? {}) as Record<string, unknown>;
    const item: CollectionItem = {};
    for (const k of s.keys) item[k] = str(v[k]);
    if (!item.id) item.id = `${type}-${i}`;
    for (const b of s.bools) item[b] = v[b] === true;
    return item;
  });
}
