import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isCollectionType, withCollection } from "@/lib/collections";

export const dynamic = "force-dynamic";

/** GET /api/collections/[type] — all items (seed defaults if never saved). */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  if (!isCollectionType(type)) {
    return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  }
  const row = await prisma.setting.findUnique({ where: { key: `collection:${type}` } });
  return NextResponse.json({ items: withCollection(type, row?.value) });
}

/** PUT /api/collections/[type] — save the items array. Body: { items }. */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  if (!isCollectionType(type)) {
    return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const value = withCollection(type, (body as { items?: unknown }).items);
  const dbKey = `collection:${type}`;
  const row = await prisma.setting.upsert({
    where: { key: dbKey },
    create: { key: dbKey, value },
    update: { value },
  });
  return NextResponse.json({ items: withCollection(type, row.value) });
}
