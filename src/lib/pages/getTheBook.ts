import { prisma } from "../prisma";
import { pageKey } from "../pageContent";
import { withTheBookDefaults, type TheBookContent } from "./theBook";

/** Server-only reader for The Book page content. */
export async function getTheBook(): Promise<TheBookContent> {
  const row = await prisma.setting.findUnique({
    where: { key: pageKey("the-book") },
  });
  return withTheBookDefaults(row?.value);
}
