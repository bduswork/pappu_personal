import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { EnrollmentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

/** GET /api/enrollments — all enroll submissions, newest first. */
export async function GET() {
  const enrollments = await prisma.enrollment.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ enrollments });
}

/** PATCH /api/enrollments — update status. Body: { id, status }. */
export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const status = body?.status as EnrollmentStatus;
  if (!id || !["NEW", "CONTACTED", "ENROLLED"].includes(status)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const updated = await prisma.enrollment.update({ where: { id }, data: { status } });
  return NextResponse.json({ enrollment: updated });
}

/** DELETE /api/enrollments?id=… — delete a submission. */
export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  await prisma.enrollment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
