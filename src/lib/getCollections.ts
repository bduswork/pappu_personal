import { prisma } from "./prisma";
import { withCollection, type CollectionItem, type CollectionType } from "./collections";

const key = (type: CollectionType) => `collection:${type}`;

/** All items in a collection (admin). */
export async function getCollection(type: CollectionType): Promise<CollectionItem[]> {
  const row = await prisma.setting.findUnique({ where: { key: key(type) } });
  return withCollection(type, row?.value);
}

/** Published items only (public pages). */
export async function getPublishedItems(type: CollectionType): Promise<CollectionItem[]> {
  return (await getCollection(type)).filter((i) => i.published === true);
}
