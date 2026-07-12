import { prisma } from "./prisma";
import { withVenturesDefaults, type Venture } from "./ventures";
import type { NavLink } from "./navigation";

/** All ventures (admin + public readers), from Setting key "ventures". */
export async function getVentures(): Promise<Venture[]> {
  const row = await prisma.setting.findUnique({ where: { key: "ventures" } });
  return withVenturesDefaults(row?.value).ventures;
}

/** A single published venture by slug (public page). */
export async function getVentureBySlug(slug: string): Promise<Venture | null> {
  const ventures = await getVentures();
  return ventures.find((v) => v.slug === slug) ?? null;
}

/** Published venture links for the sidebar Ventures pillar. */
export async function getVentureNavLinks(): Promise<NavLink[]> {
  const ventures = await getVentures();
  return ventures
    .filter((v) => v.published)
    .map((v) => ({ label: v.name, href: `/ventures/${v.slug}` }));
}
