import { NextResponse } from "next/server";
import { readSessionFromCookieHeader } from "@/lib/auth/session";
import { findAuthUserById, toPublicUser } from "@/lib/auth/userRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = readSessionFromCookieHeader(request.headers.get("cookie"));
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stored = await findAuthUserById(session.id);
    if (!stored) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ user: toPublicUser(stored) });
  } catch (error) {
    console.error("[GET /api/auth/me]", error);
    return NextResponse.json({ error: "Failed to load session" }, { status: 500 });
  }
}
