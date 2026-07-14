import { prisma } from "./prisma";
import { withCustomPagesDefaults, type CustomPage } from "./customPages";

const KEY = "customPages";

/** Server-only: all custom pages (any status). */
export async function getCustomPages(): Promise<CustomPage[]> {
  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  return withCustomPagesDefaults(row?.value).pages;
}

/** A single custom page by slug, or null. */
export async function getCustomPageBySlug(slug: string): Promise<CustomPage | null> {
  const pages = await getCustomPages();
  return pages.find((p) => p.slug === slug) ?? null;
}
