import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withProgramsDefaults } from "@/lib/programs";

export const dynamic = "force-dynamic";

const KEY = "programs";

/** GET /api/programs — all programs (defaults/seed if never saved). */
export async function GET() {
  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  return NextResponse.json(withProgramsDefaults(row?.value));
}

/** PUT /api/programs — save the full programs array. */
export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const value = withProgramsDefaults(body);
  const row = await prisma.setting.upsert({
    where: { key: KEY },
    create: { key: KEY, value },
    update: { value },
  });
  return NextResponse.json(withProgramsDefaults(row.value));
}
