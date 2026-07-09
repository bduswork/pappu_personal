import { prisma } from "./prisma";
import { withDefaults, type SiteSettings } from "./siteSettings";

/**
 * Server-only: read site settings straight from Postgres (no self-fetch).
 * Used by server components (e.g. the public home page).
 */
export async function getSettings(): Promise<SiteSettings> {
  const row = await prisma.setting.findUnique({ where: { key: "site" } });
  return withDefaults(row?.value);
}
