import { NextResponse } from "next/server";
import {
  createSessionToken,
  getSessionCookieName,
} from "@/lib/auth/session";
import type { UserRole } from "@/types";

const COOKIE_NAME = getSessionCookieName();

export async function POST(request: Request) {
  const body = (await request.json()) as {
    id?: string;
    email?: string;
    role?: UserRole;
  };

  if (!body.id || !body.email) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  const token = createSessionToken({
    id: body.id,
    email: body.email,
    role: body.role,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
