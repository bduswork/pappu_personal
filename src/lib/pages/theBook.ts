/**
 * "The Book" page content — a single self-contained book page (banner, cover,
 * title, description, highlights, buy links). Stored under key "page:the-book".
 * (Client-safe: no Prisma here.)
 */

export type BuyLink = { id: string; label: string; url: string };

export type TheBookContent = {
  banner: { image: string; text: string };
  cover: string;
  title: string;
  subtitle: string;
  description: string; // rich-text HTML
  highlights: string[];
  buyLinks: BuyLink[];
};

export const DEFAULT_THE_BOOK: TheBookContent = {
  banner: {
    image: "",
    text: "In addition to leading technology teams, ABM Whaiduzzaman shares his focus philosophy in book form.",
  },
  cover: "",
  title: "One-Focus",
  subtitle: "The Entrepreneur's Discipline",
  description:
    "<p>A practical guide to building a focused, disciplined business — drawn from two decades architecting large-scale systems and mentoring founders through One-Focus.</p>",
  highlights: [
    "Find your single, defining focus",
    "Turn ideas into shippable products",
    "Build disciplined operating habits",
    "Lead teams without losing the plot",
  ],
  buyLinks: [
    { id: "1", label: "Rokomari", url: "" },
    { id: "2", label: "Amazon", url: "" },
  ],
};

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

function coerceLink(v: Partial<BuyLink>, i: number): BuyLink {
  return { id: str(v.id) || `b-${i}`, label: str(v.label), url: str(v.url) };
}

export function withTheBookDefaults(value: unknown): TheBookContent {
  const v = (value ?? {}) as Partial<TheBookContent>;
  return {
    banner: { ...DEFAULT_THE_BOOK.banner, ...(v.banner ?? {}) },
    cover: str(v.cover),
    title: typeof v.title === "string" ? v.title : DEFAULT_THE_BOOK.title,
    subtitle: typeof v.subtitle === "string" ? v.subtitle : DEFAULT_THE_BOOK.subtitle,
    description:
      typeof v.description === "string" ? v.description : DEFAULT_THE_BOOK.description,
    highlights: Array.isArray(v.highlights)
      ? v.highlights.map((h) => str(h)).filter(Boolean)
      : DEFAULT_THE_BOOK.highlights,
    buyLinks: Array.isArray(v.buyLinks)
      ? v.buyLinks.map(coerceLink)
      : DEFAULT_THE_BOOK.buyLinks,
  };
}
