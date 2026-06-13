import { NextResponse } from "next/server";
import { readSessionFromCookieHeader } from "@/lib/auth/session";
import { isAuthorizedToViewSuggestionsByClaims } from "@/lib/suggestions/auth";
import { addSuggestion, listSuggestions } from "@/lib/suggestions/repository";

export async function GET(request: Request) {
  const session = readSessionFromCookieHeader(request.headers.get("cookie"));

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !isAuthorizedToViewSuggestionsByClaims(session.email, session.role)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const suggestions = await listSuggestions();
  return NextResponse.json({ suggestions });
}

export async function POST(request: Request) {
  const session = readSessionFromCookieHeader(request.headers.get("cookie"));

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { text?: string };

  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  const suggestion = await addSuggestion({
    userId: session.id,
    userEmail: session.email,
    text,
  });

  return NextResponse.json({ suggestion }, { status: 201 });
}
