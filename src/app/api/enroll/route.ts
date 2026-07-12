import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/** POST /api/enroll — a public Book-a-Session / enroll submission. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = str(body.name).slice(0, 200);
  const email = str(body.email).slice(0, 200);
  const whatsapp = str(body.whatsapp).slice(0, 60);
  const message = str(body.message).slice(0, 3000);
  const programSlug = str(body.programSlug).slice(0, 200);
  const programName = str(body.programName).slice(0, 200);

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 }
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  await prisma.enrollment.create({
    data: {
      name,
      email,
      whatsapp: whatsapp || null,
      message: message || null,
      programSlug: programSlug || null,
      programName: programName || null,
    },
  });

  return NextResponse.json({ ok: true });
}
