import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cleanSignature, signatureFavicon } from "@/lib/serverSignature";

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // sharp is a native module — needs the Node runtime

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB guard

/** Store a PNG buffer as a DATABASE-backed MediaAsset and return its URL. */
async function storePng(bytes: Buffer, alt: string): Promise<string> {
  const asset = await prisma.mediaAsset.create({
    data: {
      data: new Uint8Array(bytes),
      mimeType: "image/png",
      kind: "IMAGE",
      provider: "DATABASE",
      alt,
      sizeBytes: bytes.length,
    },
  });
  const url = `/api/media/${asset.id}`;
  await prisma.mediaAsset.update({ where: { id: asset.id }, data: { url } });
  return url;
}

/**
 * POST /api/signature — upload a signature photo (raw image bytes, image/*
 * Content-Type). The background is removed automatically and a matching favicon
 * tile is generated. Returns { signature, favicon } — both DATABASE media URLs.
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

  try {
    const clean = await cleanSignature(bytes);
    const tile = await signatureFavicon(clean);
    const [signature, favicon] = await Promise.all([
      storePng(clean, "brand signature"),
      storePng(tile, "favicon"),
    ]);
    return NextResponse.json({ signature, favicon });
  } catch {
    return NextResponse.json(
      { error: "Could not process that image. Try a clearer photo of the signature." },
      { status: 500 }
    );
  }
}
