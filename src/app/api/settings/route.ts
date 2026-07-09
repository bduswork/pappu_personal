import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withDefaults } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";

const KEY = "site";

/** GET /api/settings — the current site settings (defaults if never saved). */
export async function GET() {
  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  return NextResponse.json(withDefaults(row?.value));
}

/** PUT /api/settings — save the site settings. */
export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const value = withDefaults(body);
  const row = await prisma.setting.upsert({
    where: { key: KEY },
    create: { key: KEY, value },
    update: { value },
  });
  return NextResponse.json(withDefaults(row.value));
}
