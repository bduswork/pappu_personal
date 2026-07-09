import { prisma } from "../prisma";
import { pageKey } from "../pageContent";
import {
  withNexalinxAslDefaults,
  type NexalinxAslContent,
} from "./nexalinxAsl";

/** Server-only reader for the Nexalinx · ASL page content. */
export async function getNexalinxAsl(): Promise<NexalinxAslContent> {
  const row = await prisma.setting.findUnique({
    where: { key: pageKey("nexalinx-asl") },
  });
  return withNexalinxAslDefaults(row?.value);
}
