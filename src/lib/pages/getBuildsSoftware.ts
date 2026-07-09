import { prisma } from "../prisma";
import { pageKey } from "../pageContent";
import { withBuildsDefaults, type BuildsSoftwareContent } from "./buildsSoftware";

/** Server-only reader for the Builds Software page content. */
export async function getBuildsSoftware(): Promise<BuildsSoftwareContent> {
  const row = await prisma.setting.findUnique({
    where: { key: pageKey("builds-software") },
  });
  return withBuildsDefaults(row?.value);
}
