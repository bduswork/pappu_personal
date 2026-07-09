import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withNavDefaults } from "@/lib/navigation";

export const dynamic = "force-dynamic";

const KEY = "nav";

/** GET /api/sections — the sidebar section meta (defaults if never saved). */
export async function GET() {
  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  return NextResponse.json(withNavDefaults(row?.value));
}

/** PUT /api/sections — save the sidebar section meta. */
export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const value = withNavDefaults(body);
  const row = await prisma.setting.upsert({
    where: { key: KEY },
    create: { key: KEY, value },
    update: { value },
  });
  return NextResponse.json(withNavDefaults(row.value));
}
