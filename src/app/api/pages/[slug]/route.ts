import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PAGE_REGISTRY, pageKey } from "@/lib/pageContent";

export const dynamic = "force-dynamic";

/** GET /api/pages/[slug] — a page's content (defaults if never saved). */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const withDefaults = PAGE_REGISTRY[slug];
  if (!withDefaults) {
    return NextResponse.json({ error: "Unknown page." }, { status: 404 });
  }
  const row = await prisma.setting.findUnique({ where: { key: pageKey(slug) } });
  return NextResponse.json(withDefaults(row?.value));
}

/** PUT /api/pages/[slug] — save a page's content. */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const withDefaults = PAGE_REGISTRY[slug];
  if (!withDefaults) {
    return NextResponse.json({ error: "Unknown page." }, { status: 404 });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const value = withDefaults(body) as object;
  const key = pageKey(slug);
  const row = await prisma.setting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
  return NextResponse.json(withDefaults(row.value));
}
