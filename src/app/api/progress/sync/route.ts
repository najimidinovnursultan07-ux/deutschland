import { NextResponse } from "next/server";
import { readSessionFromCookieHeader } from "@/lib/auth/session";
import { upsertUserProgress } from "@/lib/progress/repository";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = readSessionFromCookieHeader(request.headers.get("cookie"));

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      name?: string;
      avatarUrl?: string;
      xp?: number;
      dailyXp?: number;
      passedLessonCount?: number;
    };

    const progress = await upsertUserProgress({
      userId: session.id,
      name: body.name?.trim() || session.email,
      email: session.email,
      avatarUrl: body.avatarUrl ?? "",
      xp: typeof body.xp === "number" ? body.xp : 0,
      dailyXp: typeof body.dailyXp === "number" ? body.dailyXp : 0,
      passedLessonCount:
        typeof body.passedLessonCount === "number" ? body.passedLessonCount : 0,
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("[POST /api/progress/sync]", error);
    return NextResponse.json(
      { error: "Failed to sync progress" },
      { status: 500 }
    );
  }
}
