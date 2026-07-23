import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB guard

/**
 * GET /api/media — admin listing (newest first). Returns metadata only; the
 * `data` bytea column is deliberately excluded so the response stays small.
 */
export async function GET() {
  const media = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      url: true,
      mimeType: true,
      alt: true,
      sizeBytes: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ media });
}

/**
 * POST /api/media — upload an image and store it in Postgres.
 * Send the raw image bytes as the body with an `image/*` Content-Type
 * (avoids multipart parsing). Optional `X-Filename` header for the alt/name.
 */
export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    return NextResponse.json(
      { error: "Send raw image bytes with an image/* Content-Type header." },
      { status: 415 }
    );
  }

  const bytes = Buffer.from(await req.arrayBuffer());
  if (bytes.length === 0) {
    return NextResponse.json({ error: "Empty body." }, { status: 400 });
  }
  if (bytes.length > MAX_BYTES) {
    return NextResponse.json({ error: "Image exceeds 8 MB." }, { status: 413 });
  }

  const asset = await prisma.mediaAsset.create({
    data: {
      data: bytes,
      mimeType: contentType,
      kind: "IMAGE",
      provider: "DATABASE",
      alt: req.headers.get("x-filename") ?? null,
      sizeBytes: bytes.length,
    },
  });

  const url = `/api/media/${asset.id}`;
  await prisma.mediaAsset.update({ where: { id: asset.id }, data: { url } });

  return NextResponse.json({ id: asset.id, url });
}
