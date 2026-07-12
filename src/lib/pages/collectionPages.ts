/**
 * Page content for the three collection-backed pages (Blog, Podcast, Resources).
 * Each stores the page's own chrome (banner/featured/intro) under key
 * "page:<slug>"; the list items come from the matching collection.
 * (Client-safe: no Prisma here.)
 */

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

/* ── Blog & Articles ─────────────────────────────── */
export type BlogContent = {
  featured: {
    image: string;
    eyebrow: string;
    title: string;
    excerpt: string;
    buttonLabel: string;
    buttonLink: string;
  };
};

export const DEFAULT_BLOG: BlogContent = {
  featured: {
    image: "",
    eyebrow: "By ABM Whaiduzzaman",
    title: "",
    excerpt: "",
    buttonLabel: "Read article",
    buttonLink: "",
  },
};

export function withBlogDefaults(value: unknown): BlogContent {
  const v = (value ?? {}) as Partial<BlogContent>;
  return { featured: { ...DEFAULT_BLOG.featured, ...(v.featured ?? {}) } };
}

/* ── Podcast & Videos ────────────────────────────── */
export type Platform = { id: string; label: string; url: string };
export type Testimonial = { id: string; quote: string; name: string };

export type PodcastContent = {
  banner: { image: string; headline: string };
  intro: string; // rich-text HTML
  platforms: Platform[];
  testimonials: Testimonial[];
};

export const DEFAULT_PODCAST: PodcastContent = {
  banner: { image: "", headline: "Podcast & Videos" },
  intro:
    "<p>Talks on software architecture, smart metering & AMI, telecom billing, healthcare IT, and disciplined entrepreneurship — plus interviews and fireside chats.</p>",
  platforms: [
    { id: "pl1", label: "Apple Podcasts", url: "" },
    { id: "pl2", label: "Spotify", url: "" },
    { id: "pl3", label: "YouTube", url: "" },
  ],
  testimonials: [],
};

function coercePlatform(v: Partial<Platform>, i: number): Platform {
  return { id: str(v.id) || `pl-${i}`, label: str(v.label), url: str(v.url) };
}
function coerceTestimonial(v: Partial<Testimonial>, i: number): Testimonial {
  return { id: str(v.id) || `t-${i}`, quote: str(v.quote), name: str(v.name) };
}

export function withPodcastDefaults(value: unknown): PodcastContent {
  const v = (value ?? {}) as Partial<PodcastContent>;
  return {
    banner: { ...DEFAULT_PODCAST.banner, ...(v.banner ?? {}) },
    intro: typeof v.intro === "string" ? v.intro : DEFAULT_PODCAST.intro,
    platforms: Array.isArray(v.platforms)
      ? v.platforms.map(coercePlatform)
      : DEFAULT_PODCAST.platforms,
    testimonials: Array.isArray(v.testimonials)
      ? v.testimonials.map(coerceTestimonial)
      : DEFAULT_PODCAST.testimonials,
  };
}

/* ── Free Resources ──────────────────────────────── */
export type ResourcesPageContent = {
  banner: { image: string; headline: string; intro: string };
};

export const DEFAULT_RESOURCES_PAGE: ResourcesPageContent = {
  banner: {
    image: "",
    headline: "Free Resources",
    intro: "Free templates, guides and tools for founders and technologists.",
  },
};

export function withResourcesPageDefaults(value: unknown): ResourcesPageContent {
  const v = (value ?? {}) as Partial<ResourcesPageContent>;
  return { banner: { ...DEFAULT_RESOURCES_PAGE.banner, ...(v.banner ?? {}) } };
}
