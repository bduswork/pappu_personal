import { prisma } from "./prisma";
import {
  withNavDefaults,
  resolveNavSections,
  type NavSectionMeta,
  type NavSection,
} from "./navigation";
import { getPageStatusMap } from "./getPageStatus";
import { isPublished } from "./pageStatus";
import { getProgramNavLinks } from "./getPrograms";

/** Editable section meta (for admin) — reads Setting key "nav", merged w/ defaults. */
export async function getNavMeta(): Promise<NavSectionMeta[]> {
  const row = await prisma.setting.findUnique({ where: { key: "nav" } });
  return withNavDefaults(row?.value).sections;
}

/** Fully-resolved sidebar sections (active only, ordered, published links only,
 *  with the Programs dropdown filled from published programs in the DB). */
export async function getSidebarSections(): Promise<NavSection[]> {
  const [meta, status, programLinks] = await Promise.all([
    getNavMeta(),
    getPageStatusMap(),
    getProgramNavLinks(),
  ]);
  const pub = (href: string) => isPublished(status, href);
  return resolveNavSections(meta)
    .map((s) => ({
      ...s,
      links: s.links.filter((l) => pub(l.href)),
      linksAfter: s.linksAfter?.filter((l) => pub(l.href)),
      // Replace the code-defined program list with the live published programs.
      training:
        s.training && programLinks.length > 0
          ? { ...s.training, programs: programLinks }
          : undefined,
    }))
    // Drop a section only if it has nothing left to show at all.
    .filter(
      (s) =>
        s.links.length > 0 ||
        (s.linksAfter && s.linksAfter.length > 0) ||
        (s.training && s.training.programs.length > 0)
    );
}
