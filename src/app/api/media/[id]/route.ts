import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** GET /api/media/[id] — serve the stored image bytes with long cache. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset?.data) {
    return new Response("Not found", { status: 404 });
  }
  const bytes = new Uint8Array(asset.data);
  return new Response(bytes, {
    headers: {
      "Content-Type": asset.mimeType ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(bytes.length),
    },
  });
}

/** DELETE /api/media/[id] — remove an asset from the library (admin only). */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.mediaAsset.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
