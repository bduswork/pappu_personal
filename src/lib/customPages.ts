/**
 * Admin-created custom pages. Each is a standalone page (banner + rich body)
 * assigned to a sidebar section, reachable at /<slug>. Stored in the `settings`
 * table under key "customPages" as JSON (an array). Publish status is tracked
 * via the shared pageStatus system, keyed by the page's href ("/<slug>").
 * (Client-safe: no Prisma here.)
 */

export type CustomPageSection = "abm" | "ventures";

export type CustomPage = {
  id: string;
  slug: string;
  label: string; // sidebar text + page title
  section: CustomPageSection;
  banner: { image: string; headline: string };
  body: string; // rich-text HTML
};

export type CustomPagesData = { pages: CustomPage[] };

/** Slugs that would collide with built-in routes — cannot be used by a custom page. */
export const RESERVED_SLUGS = new Set<string>([
  // Built-in (site) pages
  "blog",
  "builds-software",
  "case-studies",
  "contact",
  "my-story",
  "nexalinx-asl",
  "podcast",
  "press-kit",
  "products",
  "resources",
  "speaking",
  "the-book",
  "training",
  "ventures",
  "research",
  "global-experience",
  // System routes
  "admin",
  "api",
  "login",
  "",
]);

/** URL-safe slug from a label. */
export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "page"
  );
}

/**
 * Pick a unique, non-reserved slug for a new page: `base`, then `base-2`, etc.
 * `taken` is the set of slugs already used by other custom pages.
 */
export function uniqueSlug(base: string, taken: Set<string>): string {
  let slug = slugify(base);
  if (!RESERVED_SLUGS.has(slug) && !taken.has(slug)) return slug;
  for (let i = 2; i < 1000; i++) {
    const candidate = `${slug}-${i}`;
    if (!RESERVED_SLUGS.has(candidate) && !taken.has(candidate)) return candidate;
  }
  return `${slug}-${Date.now().toString(36)}`;
}

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

function coercePage(v: Partial<CustomPage>, i: number): CustomPage {
  const section: CustomPageSection = v.section === "ventures" ? "ventures" : "abm";
  const banner = (v.banner ?? {}) as Partial<CustomPage["banner"]>;
  return {
    id: str(v.id) || `cp-${i}`,
    slug: slugify(str(v.slug) || `page-${i}`),
    label: str(v.label) || "New Page",
    section,
    banner: { image: str(banner.image), headline: str(banner.headline) },
    body: str(v.body),
  };
}

/** Merge stored value over defaults so the shape always stays valid. */
export function withCustomPagesDefaults(value: unknown): CustomPagesData {
  const v = (value ?? {}) as Partial<CustomPagesData>;
  const pages = Array.isArray(v.pages) ? v.pages.map((p, i) => coercePage(p, i)) : [];
  return { pages };
}
