import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withCustomPagesDefaults } from "@/lib/customPages";

export const dynamic = "force-dynamic";

const KEY = "customPages";

/** GET /api/custom-pages — all custom pages. */
export async function GET() {
  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  return NextResponse.json(withCustomPagesDefaults(row?.value));
}

/** PUT /api/custom-pages — save the full custom-pages array. */
export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const value = withCustomPagesDefaults(body);
  const row = await prisma.setting.upsert({
    where: { key: KEY },
    create: { key: KEY, value },
    update: { value },
  });
  return NextResponse.json(withCustomPagesDefaults(row.value));
}
