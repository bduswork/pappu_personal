/**
 * Ventures — a dynamic list of brand-profile pages (Zariya Living, Heritique,
 * AVA, …). Stored as a JSON array in the `settings` table under key "ventures".
 * (Client-safe: no Prisma here.)
 */

export type Gallery = { id: string; url: string };

export type Venture = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  hero: string;
  logo: string;
  about: string; // rich-text HTML
  website: string;
  gallery: Gallery[];
  ctaLabel: string;
  ctaLink: string;
  published: boolean;
};

export type VenturesData = { ventures: Venture[] };

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "venture"
  );
}

export const DEFAULT_VENTURES: Venture[] = [
  {
    id: "v-zariya",
    slug: "zariya-living",
    name: "Zariya Living",
    tagline: "Thoughtful living for the modern home",
    hero: "",
    logo: "",
    about:
      "<p>Zariya Living is a lifestyle & home brand crafting products for the modern home.</p>",
    website: "",
    gallery: [],
    ctaLabel: "Visit site",
    ctaLink: "",
    published: true,
  },
  {
    id: "v-heritique",
    slug: "heritique",
    name: "Heritique",
    tagline: "Where heritage meets modern craft",
    hero: "",
    logo: "",
    about:
      "<p>Heritique blends heritage craftsmanship with contemporary design.</p>",
    website: "",
    gallery: [],
    ctaLabel: "Visit site",
    ctaLink: "",
    published: true,
  },
  {
    id: "v-ava",
    slug: "ava",
    name: "AVA",
    tagline: "A brand for the next generation",
    hero: "",
    logo: "",
    about: "<p>AVA is a modern brand built for the next generation.</p>",
    website: "",
    gallery: [],
    ctaLabel: "Visit site",
    ctaLink: "",
    published: true,
  },
];

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

function coerceGallery(v: Partial<Gallery>, i: number): Gallery {
  return { id: str(v.id) || `g-${i}`, url: str(v.url) };
}

function coerceVenture(v: Partial<Venture>, i: number): Venture {
  const name = str(v.name);
  return {
    id: str(v.id) || `v-${i}`,
    slug: str(v.slug) || slugify(name) || `venture-${i}`,
    name,
    tagline: str(v.tagline),
    hero: str(v.hero),
    logo: str(v.logo),
    about: str(v.about),
    website: str(v.website),
    gallery: Array.isArray(v.gallery) ? v.gallery.map(coerceGallery) : [],
    ctaLabel: str(v.ctaLabel) || "Visit site",
    ctaLink: str(v.ctaLink),
    published: v.published !== false,
  };
}

export function withVenturesDefaults(value: unknown): VenturesData {
  const v = (value ?? {}) as Partial<VenturesData>;
  const ventures = Array.isArray(v.ventures)
    ? v.ventures.map(coerceVenture)
    : DEFAULT_VENTURES;
  return { ventures };
}
