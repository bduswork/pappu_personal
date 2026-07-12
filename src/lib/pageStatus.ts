/**
 * Per-page publish status (PUBLISHED / DRAFT), keyed by public href. Stored in
 * the `settings` table under key "pageStatus" as JSON — only overrides are
 * stored; anything unset falls back to a sensible default.
 * (Client-safe: no Prisma here.)
 */

export type PageStatus = "PUBLISHED" | "DRAFT";

export type PageStatusMap = Record<string, PageStatus>;

/** Pages that are live by default (built + ready). Everything else defaults to DRAFT. */
export const DEFAULT_PUBLISHED: string[] = [
  "/builds-software",
  "/my-story",
  "/nexalinx-asl",
  "/products",
  "/case-studies",
  "/press-kit",
  "/speaking",
  "/the-book",
  "/contact",
  "/blog",
  "/podcast",
  "/resources",
  "/ventures/invest",
];

/** The status for an href: stored override wins, else the built-in default. */
export function statusOf(map: PageStatusMap, href: string): PageStatus {
  const stored = map[href];
  if (stored === "PUBLISHED" || stored === "DRAFT") return stored;
  return DEFAULT_PUBLISHED.includes(href) ? "PUBLISHED" : "DRAFT";
}

export function isPublished(map: PageStatusMap, href: string): boolean {
  return statusOf(map, href) === "PUBLISHED";
}

/** Keep only valid PUBLISHED/DRAFT string entries. */
export function withStatusDefaults(value: unknown): PageStatusMap {
  const v = (value ?? {}) as Record<string, unknown>;
  const out: PageStatusMap = {};
  for (const [k, val] of Object.entries(v)) {
    if (val === "PUBLISHED" || val === "DRAFT") out[k] = val;
  }
  return out;
}
