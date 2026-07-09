/**
 * Sidebar navigation model.
 *
 * Two stable pillars drive the sidebar:
 *   ABM Whaiduzzaman · builds technology   (with a Training dropdown)
 *   Ventures         · creates brands
 *
 * Training programs (One-Focus, etc.) are NOT a pillar — they're a dynamic
 * dropdown under ABM. Admin creates a program, flips it active, and it appears
 * here. Each program is a single landing page (/training/<slug>).
 *
 * Kept as plain data so it can later be sourced from the database.
 */

export type NavLink = {
  label: string;
  href: string;
};

/** Expandable "Training Entrepreneurs / SME" dropdown, listing active programs. */
export type TrainingGroup = {
  label: string;
  programs: NavLink[];
};

/**
 * The editable half of a section — what the admin Sections screen manages and
 * persists to the database (Setting key "nav"). The page links themselves live
 * in code (SECTION_CONTENT) for now, keyed by `key`, and become editable during
 * the per-page dynamic work.
 */
export type NavSectionMeta = {
  key: string;
  title: string;
  tagline: string;
  accent: "green" | "blue";
  isActive: boolean;
};

/** The code-defined page links for a section. */
export type SectionContent = {
  links: NavLink[];
  /** Optional "Programs and Master Classes" dropdown, rendered after `links`. */
  training?: TrainingGroup;
  /** Links rendered after the dropdown (e.g. The Book, Blog, Podcast…). */
  linksAfter?: NavLink[];
};

/** A fully-resolved sidebar section: editable meta + its page links. */
export type NavSection = NavSectionMeta & SectionContent;

export const BRAND = {
  name: "ABM WHAIDUZZAMAN",
  tagline: "builds technology",
};

/** Standalone global link shown at the bottom of the sidebar (above social). */
export const CONTACT_LINK: NavLink = { label: "Contact", href: "/contact" };

export const NAV_SECTIONS: NavSection[] = [
  {
    key: "abm",
    isActive: true,
    title: "ABM WHAIDUZZAMAN",
    tagline: "builds technology",
    accent: "blue",
    links: [
      { label: "Builds Software", href: "/builds-software" },
      { label: "My Story", href: "/my-story" },
      { label: "Nexalinx · ASL", href: "/nexalinx-asl" },
      { label: "Products & Platforms", href: "/products" },
      { label: "Clients & Case Studies", href: "/case-studies" },
      { label: "Press Kit", href: "/press-kit" },
      { label: "Speaking & Consulting", href: "/speaking" },
    ],
    training: {
      label: "Programs and Master Classes",
      programs: [
        // Active programs (admin-managed). One-Focus is the first.
        { label: "One-Focus", href: "/training/one-focus" },
      ],
    },
    linksAfter: [
      { label: "The Book", href: "/the-book" },
      { label: "Blog & Articles", href: "/blog" },
      { label: "Podcast & Videos", href: "/podcast" },
      { label: "Free Resources", href: "/resources" },
    ],
  },
  {
    key: "ventures",
    isActive: true,
    title: "VENTURES",
    tagline: "creates brands",
    accent: "blue",
    links: [
      { label: "Zariya Living", href: "/ventures/zariya-living" },
      { label: "Heritique", href: "/ventures/heritique" },
      { label: "AVA", href: "/ventures/ava" },
      { label: "Invest & Partner", href: "/ventures/invest" },
    ],
  },
];

/** Code-defined page links, keyed by section `key`. */
export const SECTION_CONTENT: Record<string, SectionContent> = Object.fromEntries(
  NAV_SECTIONS.map((s) => [
    s.key,
    { links: s.links, training: s.training, linksAfter: s.linksAfter },
  ])
);

/** How many pages a section owns (links + after-links; the training dropdown
 *  is a program list, not a page — matches the count shown in the sidebar). */
export function pagesInSection(key: string): number {
  const c = SECTION_CONTENT[key];
  if (!c) return 0;
  return c.links.length + (c.linksAfter?.length ?? 0);
}

/** The editable defaults, derived from the code sections above. */
export const DEFAULT_NAV_META: NavSectionMeta[] = NAV_SECTIONS.map(
  ({ key, title, tagline, accent, isActive }) => ({
    key,
    title,
    tagline,
    accent,
    isActive,
  })
);

export type NavData = { sections: NavSectionMeta[] };

/** Merge stored nav meta over defaults so the shape always stays valid. */
export function withNavDefaults(value: unknown): NavData {
  const v = (value ?? {}) as Partial<NavData>;
  const sections =
    Array.isArray(v.sections) && v.sections.length > 0
      ? (v.sections as NavSectionMeta[]).map(
          (s): NavSectionMeta => ({
            key: String(s.key ?? ""),
            title: String(s.title ?? ""),
            tagline: String(s.tagline ?? ""),
            accent: s.accent === "green" ? "green" : "blue",
            isActive: s.isActive !== false,
          })
        )
      : DEFAULT_NAV_META;
  return { sections };
}

/** Resolve editable meta + code links into full sidebar sections (active only,
 *  in stored order). Sections with no code content render header-only. */
export function resolveNavSections(meta: NavSectionMeta[]): NavSection[] {
  return meta
    .filter((m) => m.isActive)
    .map((m) => ({ ...m, ...(SECTION_CONTENT[m.key] ?? { links: [] }) }));
}

export type SocialLink = {
  label: string;
  href: string;
  icon: "x" | "facebook" | "linkedin" | "youtube" | "instagram";
};

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "X", href: "#", icon: "x" },
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "YouTube", href: "#", icon: "youtube" },
  { label: "Instagram", href: "#", icon: "instagram" },
];
