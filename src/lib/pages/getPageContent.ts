import { prisma } from "../prisma";
import { PAGE_REGISTRY, pageKey } from "../pageContent";

/** Generic server reader: a page's stored content, merged with its defaults. */
export async function getPageContent<T = unknown>(slug: string): Promise<T> {
  const withDefaults = PAGE_REGISTRY[slug];
  const row = await prisma.setting.findUnique({ where: { key: pageKey(slug) } });
  const value = withDefaults ? withDefaults(row?.value) : (row?.value ?? {});
  return value as T;
}
