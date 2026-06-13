import { createSessionToken, getSessionCookieName } from "@/lib/auth/session";
import type { PublicUser } from "@/types";
import { NextResponse } from "next/server";

const COOKIE_NAME = getSessionCookieName();

export function attachSessionCookie(
  user: PublicUser
): NextResponse {
  const token = createSessionToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.json({ user });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export function clearSessionCookie(): NextResponse {
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
