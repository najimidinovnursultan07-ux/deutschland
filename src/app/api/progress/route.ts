import { NextResponse } from "next/server";
import { readSessionFromCookieHeader } from "@/lib/auth/session";
import { findAuthUserById } from "@/lib/auth/userRepository";
import {
  loadAppState,
  saveAppState,
  type PersistedAppState,
} from "@/lib/progress/appStateRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = readSessionFromCookieHeader(request.headers.get("cookie"));
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const state = await loadAppState(session.id);
    return NextResponse.json(
      { state },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[GET /api/progress]", error);
    return NextResponse.json(
      { error: "Failed to load progress" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = readSessionFromCookieHeader(request.headers.get("cookie"));
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stored = await findAuthUserById(session.id);
    if (!stored) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { state?: PersistedAppState };
    if (!body.state) {
      return NextResponse.json({ error: "State is required" }, { status: 400 });
    }

    const saved = await saveAppState(session.id, body.state, {
      name: stored.name,
      email: stored.email,
      avatarUrl: stored.avatarUrl,
    });

    return NextResponse.json({ state: saved });
  } catch (error) {
    console.error("[PUT /api/progress]", error);
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
}
