import { prisma } from "./prisma";
import { withSubscribersDefaults, type Subscriber } from "./subscribers";

const KEY = "subscribers";

/** Server-only: all newsletter subscribers. */
export async function getSubscribers(): Promise<Subscriber[]> {
  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  return withSubscribersDefaults(row?.value).subscribers;
}
