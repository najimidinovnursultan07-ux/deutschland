import { createHmac, timingSafeEqual } from "crypto";
import { isRootAdmin, normalizeEmail, resolveUserRole } from "@/lib/admin";
import type { UserRole } from "@/types";

const COOKIE_NAME = "lingua_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getSessionSecret(): string {
  return (
    process.env.SESSION_SECRET ??
    "lingua-dev-session-secret-change-in-production"
  );
}

export interface SessionPayload {
  id: string;
  email: string;
  role: UserRole;
  exp: number;
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}

export function createSessionToken(input: {
  id: string;
  email: string;
  role?: UserRole;
}): string {
  const email = normalizeEmail(input.email);
  const role = resolveUserRole(email, input.role);
  const payload: SessionPayload = {
    id: input.id,
    email,
    role,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", getSessionSecret())
    .update(data)
    .digest("base64url");
  return `${data}.${sig}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [data, sig] = parts;
  const expected = createHmac("sha256", getSessionSecret())
    .update(data)
    .digest("base64url");

  try {
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expected);
    if (
      sigBuf.length !== expectedBuf.length ||
      !timingSafeEqual(sigBuf, expectedBuf)
    ) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf8")
    ) as SessionPayload;

    if (!payload.id || !payload.email || !payload.role || !payload.exp) {
      return null;
    }
    if (Date.now() > payload.exp) return null;

    const email = normalizeEmail(payload.email);
    return {
      ...payload,
      email,
      role: resolveUserRole(email, payload.role),
    };
  } catch {
    return null;
  }
}

export function readSessionFromCookieHeader(
  cookieHeader: string | null
): SessionPayload | null {
  if (!cookieHeader) return null;

  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));

  if (!match) return null;
  const token = decodeURIComponent(match.slice(COOKIE_NAME.length + 1));
  return verifySessionToken(token);
}

export function isModeratorOrRootAdmin(
  email: string,
  role: UserRole
): boolean {
  return role === "MODERATOR" || isRootAdmin(email);
}
