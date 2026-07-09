/**
 * Registry of dynamic page content. Each page slug maps to a defaults-merge
 * function; the generic /api/pages/[slug] route and readers use it. Add a new
 * page by registering its `withDefaults` here. (Client-safe: no Prisma.)
 */
import { withBuildsDefaults } from "./pages/buildsSoftware";

export const PAGE_REGISTRY: Record<string, (v: unknown) => unknown> = {
  "builds-software": withBuildsDefaults,
};

/** Settings-table key for a page's stored content. */
export function pageKey(slug: string): string {
  return `page:${slug}`;
}
