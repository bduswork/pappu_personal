import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/counts — unread/new counts for the admin sidebar badges.
 * (Admin-only; the proxy requires a session.)
 */
export async function GET() {
  const [enrollments, messages] = await Promise.all([
    prisma.enrollment.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
  ]);
  return NextResponse.json({ enrollments, messages });
}
