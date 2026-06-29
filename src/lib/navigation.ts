/**
 * Sidebar navigation model.
 *
 * Kept as plain data so it can later be sourced from the database and
 * edited from the /admin panel without touching the layout components.
 * The three "pillars" mirror the brand architecture:
 *   builds technology · trains entrepreneurs · creates brands
 */

export type NavLink = {
  label: string;
  href: string;
};

export type NavSection = {
  /** Pillar title, e.g. "ABM WHAIDUZZAMAN" */
  title: string;
  /** Tagline under the title, e.g. "builds technology" */
  tagline: string;
  /** Accent used for the active state of this pillar */
  accent: "green" | "blue";
  links: NavLink[];
};

export const BRAND = {
  name: "ABM WHAIDUZZAMAN",
  tagline: "builds technology",
};

export const NAV_SECTIONS: NavSection[] = [
  {
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
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "ONE-FOCUS",
    tagline: "trains entrepreneurs",
    accent: "green",
    links: [
      { label: "About One-Focus", href: "/one-focus" },
      { label: "Programs & Masterclasses", href: "/one-focus/programs" },
      { label: "The Book", href: "/one-focus/book" },
      { label: "Blog & Articles", href: "/blog" },
      { label: "Podcast & Videos", href: "/podcast" },
      { label: "Free Resources", href: "/resources" },
      { label: "The Academy", href: "/academy" },
      { label: "Book a Session", href: "/book-a-session" },
    ],
  },
  {
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
