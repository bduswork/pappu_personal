import { prisma } from "../prisma";
import { pageKey } from "../pageContent";
import { withMyStoryDefaults, type MyStoryContent } from "./myStory";

/** Server-only reader for the My Story page content. */
export async function getMyStory(): Promise<MyStoryContent> {
  const row = await prisma.setting.findUnique({
    where: { key: pageKey("my-story") },
  });
  return withMyStoryDefaults(row?.value);
}
