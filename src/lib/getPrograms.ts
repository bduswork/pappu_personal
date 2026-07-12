import { prisma } from "./prisma";
import {
  withProgramsDefaults,
  plainBrand,
  programStatus,
  type Program,
} from "./programs";
import type { NavLink } from "./navigation";

/** All programs (admin + public readers), from Setting key "programs". */
export async function getPrograms(): Promise<Program[]> {
  const row = await prisma.setting.findUnique({ where: { key: "programs" } });
  return withProgramsDefaults(row?.value).programs;
}

/** A single published program by slug (public page). */
export async function getProgramBySlug(slug: string): Promise<Program | null> {
  const programs = await getPrograms();
  return programs.find((p) => p.slug === slug) ?? null;
}

/** Published program links for the sidebar "Programs & Master Classes" dropdown. */
export async function getProgramNavLinks(): Promise<NavLink[]> {
  const programs = await getPrograms();
  return programs
    .filter((p) => p.published)
    .map((p) => ({
      label: plainBrand(p.name),
      href: `/training/${p.slug}`,
      startAt: p.startAt,
      endAt: p.endAt,
    }));
}

/** The single program to spotlight on the home page: an ongoing one, else the
 *  nearest upcoming one (published only). */
export async function getFeaturedProgram(): Promise<Program | null> {
  const now = Date.now();
  const published = (await getPrograms()).filter((p) => p.published);
  const ongoing = published.find((p) => programStatus(p, now) === "ONGOING");
  if (ongoing) return ongoing;
  const upcoming = published
    .filter((p) => programStatus(p, now) === "UPCOMING")
    .sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt));
  return upcoming[0] ?? null;
}
