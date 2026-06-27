import { NextResponse } from "next/server";

/**
 * Pass-through middleware with a strict matcher so static assets, API routes,
 * and PWA files are never intercepted (avoids per-asset Edge latency).
 */
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|manifest.json|sw.js|worker-.*|.*\\..*).*)",
  ],
};
