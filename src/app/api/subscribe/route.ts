import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withSubscribersDefaults, isEmail } from "@/lib/subscribers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const KEY = "subscribers";

/** POST /api/subscribe — public newsletter signup. Validates + de-duplicates. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";

  if (!isEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  const current = withSubscribersDefaults(row?.value).subscribers;

  // Already subscribed → succeed silently (idempotent).
  if (current.some((s) => s.email === email)) {
    return NextResponse.json({ ok: true });
  }

  const subscriber = {
    id: `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    email,
    createdAt: new Date().toISOString(),
  };
  const value = { subscribers: [...current, subscriber] };

  await prisma.setting.upsert({
    where: { key: KEY },
    create: { key: KEY, value },
    update: { value },
  });

  return NextResponse.json({ ok: true });
}
