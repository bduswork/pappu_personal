/**
 * Registry of dynamic page content. Each page slug maps to a defaults-merge
 * function; the generic /api/pages/[slug] route and readers use it. Add a new
 * page by registering its `withDefaults` here. (Client-safe: no Prisma.)
 */
import { withBuildsDefaults } from "./pages/buildsSoftware";
import { withMyStoryDefaults } from "./pages/myStory";
import { withNexalinxAslDefaults } from "./pages/nexalinxAsl";
import { withProductsDefaults } from "./pages/products";
import { withCaseStudiesDefaults } from "./pages/caseStudies";
import { withPressKitDefaults } from "./pages/pressKit";
import { withSpeakingDefaults } from "./pages/speaking";
import { withTheBookDefaults } from "./pages/theBook";

export const PAGE_REGISTRY: Record<string, (v: unknown) => unknown> = {
  "builds-software": withBuildsDefaults,
  "my-story": withMyStoryDefaults,
  "nexalinx-asl": withNexalinxAslDefaults,
  products: withProductsDefaults,
  "case-studies": withCaseStudiesDefaults,
  "press-kit": withPressKitDefaults,
  speaking: withSpeakingDefaults,
  "the-book": withTheBookDefaults,
};

/** Settings-table key for a page's stored content. */
export function pageKey(slug: string): string {
  return `page:${slug}`;
}
