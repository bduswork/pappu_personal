import { prisma } from "./prisma";
import {
  withNavDefaults,
  resolveNavSections,
  type NavSectionMeta,
  type NavSection,
} from "./navigation";

/** Editable section meta (for admin) — reads Setting key "nav", merged w/ defaults. */
export async function getNavMeta(): Promise<NavSectionMeta[]> {
  const row = await prisma.setting.findUnique({ where: { key: "nav" } });
  return withNavDefaults(row?.value).sections;
}

/** Fully-resolved sidebar sections (active only, ordered, with code links). */
export async function getSidebarSections(): Promise<NavSection[]> {
  return resolveNavSections(await getNavMeta());
}
