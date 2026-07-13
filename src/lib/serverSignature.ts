/**
 * Server-only signature image processing (uses `sharp`; do NOT import from a
 * client component). Turns a photo of a handwritten signature — even on lined
 * paper — into a clean white-on-transparent PNG for the blue sidebar, and
 * builds a matching square favicon tile so the browser-tab icon stays legible.
 */
import sharp from "sharp";

// Luminance cutoffs: below DARK = solid ink, above LIGHT = paper (transparent).
// FLOOR drops faint paper haze / ruled lines, then the remainder is rescaled.
const DARK = 58;
const LIGHT = 112;
const FLOOR = 90;

/** Remove the paper background: ink → white, paper → transparent, trimmed tight. */
export async function cleanSignature(input: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(input)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const L = data[i];
    let a = (LIGHT - L) / (LIGHT - DARK);
    a = a < 0 ? 0 : a > 1 ? 1 : a;
    let alpha = Math.round(a * 255);
    alpha = alpha < FLOOR ? 0 : Math.round(((alpha - FLOOR) / (255 - FLOOR)) * 255);
    const o = i * 4;
    rgba[o] = 255;
    rgba[o + 1] = 255;
    rgba[o + 2] = 255;
    rgba[o + 3] = alpha;
  }

  return sharp(rgba, { raw: { width, height, channels: 4 } })
    .trim({ background: { r: 255, g: 255, b: 255, alpha: 0 }, threshold: 12 })
    .png()
    .toBuffer();
}

/**
 * Build a 512×512 favicon tile: the cleaned signature on the sidebar gradient.
 * The signature spans the full width (no left/right padding); the gradient only
 * fills the top/bottom needed to make the icon square.
 */
export async function signatureFavicon(cleanPng: Buffer): Promise<Buffer> {
  const S = 512;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="38%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#4338ca"/>
    </linearGradient></defs>
    <rect width="${S}" height="${S}" fill="url(#g)"/></svg>`;
  const tile = await sharp(Buffer.from(svg)).png().toBuffer();

  // Full width — signature edge-to-edge horizontally, centered vertically.
  const sigResized = await sharp(cleanPng).resize({ width: S }).toBuffer();
  const sm = await sharp(sigResized).metadata();
  const top = Math.round((S - (sm.height ?? 0)) / 2);

  return sharp(tile)
    .composite([{ input: sigResized, top, left: 0 }])
    .png()
    .toBuffer();
}
