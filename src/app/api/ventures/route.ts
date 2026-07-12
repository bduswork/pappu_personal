import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVenturesDefaults } from "@/lib/ventures";

export const dynamic = "force-dynamic";

const KEY = "ventures";

/** GET /api/ventures — all ventures (seed defaults if never saved). */
export async function GET() {
  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  return NextResponse.json(withVenturesDefaults(row?.value));
}

/** PUT /api/ventures — save the full ventures array. */
export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const value = withVenturesDefaults(body);
  const row = await prisma.setting.upsert({
    where: { key: KEY },
    create: { key: KEY, value },
    update: { value },
  });
  return NextResponse.json(withVenturesDefaults(row.value));
}
