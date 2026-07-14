import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "./lib/session";

/**
 * Admin gate (Next.js "proxy", formerly middleware). Everything under /admin and
 * every admin API requires a valid session cookie; otherwise pages redirect to
 * /login and APIs return 401.
 *
 * Public exceptions (no auth): the login/auth endpoints, the public form APIs
 * (contact, enroll), the health probe, and GET image serving (/api/media/<id>).
 */

const PUBLIC_API = [
  /^\/api\/health(\/|$)/,
  /^\/api\/contact(\/|$)/,
  /^\/api\/enroll(\/|$)/,
  /^\/api\/subscribe(\/|$)/,
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Auth endpoints are always reachable.
  if (pathname.startsWith("/api/auth")) return NextResponse.next();

  const isApi = pathname.startsWith("/api");

  if (isApi) {
    if (PUBLIC_API.some((re) => re.test(pathname))) return NextResponse.next();
    // Public image serving: GET /api/media/<id> (uploads/POST still require auth).
    if (req.method === "GET" && /^\/api\/media\/[^/]+$/.test(pathname)) {
      return NextResponse.next();
    }
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);
  if (session) return NextResponse.next();

  // Not authenticated.
  if (isApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  // Gate the admin UI and all API routes (public exceptions handled above).
  matcher: ["/admin", "/admin/:path*", "/api/:path*"],
};
