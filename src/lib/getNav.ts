import { prisma } from "./prisma";
import {
  withNavDefaults,
  resolveNavSections,
  GLOBAL_LINKS,
  type NavSectionMeta,
  type NavSection,
  type NavLink,
} from "./navigation";
import { getPageStatusMap } from "./getPageStatus";
import { isPublished } from "./pageStatus";
import { getProgramNavLinks } from "./getPrograms";
import { getVentureNavLinks } from "./getVentures";
import { getCustomPages } from "./getCustomPages";

/** Standalone bottom-of-sidebar links (Research, Global Experience, Contact),
 *  filtered to the published ones. */
export async function getGlobalLinks(): Promise<NavLink[]> {
  const status = await getPageStatusMap();
  return GLOBAL_LINKS.filter((l) => isPublished(status, l.href));
}

/** Editable section meta (for admin) — reads Setting key "nav", merged w/ defaults. */
export async function getNavMeta(): Promise<NavSectionMeta[]> {
  const row = await prisma.setting.findUnique({ where: { key: "nav" } });
  return withNavDefaults(row?.value).sections;
}

/** Fully-resolved sidebar sections (active only, ordered, published links only,
 *  with the Programs dropdown filled from published programs in the DB). */
export async function getSidebarSections(): Promise<NavSection[]> {
  const [meta, status, programLinks, ventureLinks, customPages] = await Promise.all([
    getNavMeta(),
    getPageStatusMap(),
    getProgramNavLinks(),
    getVentureNavLinks(),
    getCustomPages(),
  ]);
  const pub = (href: string) => isPublished(status, href);
  return resolveNavSections(meta)
    .map((s) => {
      // Admin-created pages assigned to this section (published only), appended
      // at the bottom of the section.
      const customLinks = customPages
        .filter((p) => p.section === s.key && pub(`/${p.slug}`))
        .map((p) => ({ label: p.label, href: `/${p.slug}` }));
      return {
        ...s,
        // Ventures: live brand pages first, then the fixed (published) links.
        links:
          s.key === "ventures"
            ? [...ventureLinks, ...s.links.filter((l) => pub(l.href))]
            : s.links.filter((l) => pub(l.href)),
        linksAfter: [...(s.linksAfter?.filter((l) => pub(l.href)) ?? []), ...customLinks],
        // Replace the code-defined program list with the live published programs.
        training:
          s.training && programLinks.length > 0
            ? { ...s.training, programs: programLinks }
            : undefined,
      };
    })
    // Drop a section only if it has nothing left to show at all.
    .filter(
      (s) =>
        s.links.length > 0 ||
        (s.linksAfter && s.linksAfter.length > 0) ||
        (s.training && s.training.programs.length > 0)
    );
}
