import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withSubscribersDefaults } from "@/lib/subscribers";

export const dynamic = "force-dynamic";

const KEY = "subscribers";

/** GET /api/subscribers — admin list (newest first). */
export async function GET() {
  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  const subscribers = withSubscribersDefaults(row?.value).subscribers.sort((a, b) =>
    (b.createdAt || "").localeCompare(a.createdAt || "")
  );
  return NextResponse.json({ subscribers });
}

/** DELETE /api/subscribers?id=... — remove one subscriber. */
export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  const next = withSubscribersDefaults(row?.value).subscribers.filter((s) => s.id !== id);
  const value = { subscribers: next };
  await prisma.setting.upsert({
    where: { key: KEY },
    create: { key: KEY, value },
    update: { value },
  });
  return NextResponse.json({ ok: true });
}
