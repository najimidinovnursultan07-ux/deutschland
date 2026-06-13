import { NextResponse } from "next/server";
import { readSessionFromCookieHeader } from "@/lib/auth/session";
import { upsertDirectoryUser } from "@/lib/users/repository";
import type { UserRole } from "@/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = readSessionFromCookieHeader(request.headers.get("cookie"));

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      name?: string;
      role?: UserRole;
    };

    const user = await upsertDirectoryUser({
      id: session.id,
      name: body.name?.trim() || session.email,
      email: session.email,
      role: body.role ?? session.role,
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[POST /api/users/sync]", error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
}
