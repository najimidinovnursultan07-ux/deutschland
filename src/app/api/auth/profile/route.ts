import { NextResponse } from "next/server";
import { readSessionFromCookieHeader } from "@/lib/auth/session";
import { updateAuthUserProfile } from "@/lib/auth/userRepository";
import type { TargetLanguage } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  try {
    const session = readSessionFromCookieHeader(request.headers.get("cookie"));
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      name?: string;
      avatarUrl?: string;
      targetLanguage?: TargetLanguage;
      password?: string;
      currentPassword?: string;
    };

    const user = await updateAuthUserProfile(session.id, body);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_PASSWORD") {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }
      if (error.message === "CURRENT_PASSWORD_REQUIRED") {
        return NextResponse.json(
          { error: "Current password is required" },
          { status: 400 }
        );
      }
    }
    console.error("[PATCH /api/auth/profile]", error);
    return NextResponse.json({ error: "Profile update failed" }, { status: 500 });
  }
}
