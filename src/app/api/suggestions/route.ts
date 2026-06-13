import { NextResponse } from "next/server";
import { readSessionFromCookieHeader } from "@/lib/auth/session";
import { sendSuggestionToTelegram } from "@/lib/telegram/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = readSessionFromCookieHeader(request.headers.get("cookie"));

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { text?: string };

    const text = body.text?.trim();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    await sendSuggestionToTelegram(session.email, text);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/suggestions]", error);
    return NextResponse.json(
      { error: "Failed to send suggestion" },
      { status: 500 }
    );
  }
}
