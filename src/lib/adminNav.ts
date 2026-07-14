import type { IconName } from "@/components/admin/AdminIcon";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: IconName;
};

export type AdminNavGroup = {
  heading?: string;
  items: AdminNavItem[];
};

/**
 * Admin sidebar navigation. Collections map 1:1 to the Prisma collection
 * tables; Content maps to Sections/Pages; Library to media + settings.
 */
export const ADMIN_NAV: AdminNavGroup[] = [
  {
    items: [{ label: "Dashboard", href: "/admin", icon: "dashboard" }],
  },
  {
    heading: "Content",
    items: [
      { label: "Sections", href: "/admin/sections", icon: "sections" },
      { label: "Pages", href: "/admin/pages", icon: "pages" },
      { label: "Programs & Masterclasses", href: "/admin/training", icon: "training" },
      { label: "Ventures", href: "/admin/ventures", icon: "sections" },
      { label: "Enrollments", href: "/admin/enrollments", icon: "enrollments" },
      { label: "Messages", href: "/admin/messages", icon: "mail" },
      { label: "Subscribers", href: "/admin/subscribers", icon: "articles" },
    ],
  },
  {
    heading: "Collections",
    items: [
      { label: "Press", href: "/admin/collections/press", icon: "press" },
      { label: "Events", href: "/admin/collections/events", icon: "events" },
      { label: "Videos", href: "/admin/collections/videos", icon: "videos" },
      { label: "Articles", href: "/admin/collections/articles", icon: "articles" },
      { label: "Resources", href: "/admin/collections/resources", icon: "resources" },
    ],
  },
  {
    heading: "Library",
    items: [
      { label: "Media", href: "/admin/media", icon: "media" },
      { label: "Settings", href: "/admin/settings", icon: "settings" },
    ],
  },
];
