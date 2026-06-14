import { clearSessionCookie } from "@/lib/auth/cookies";
import { readSessionFromCookieHeader } from "@/lib/auth/session";
import { notifyUserLogout } from "@/lib/telegram/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  const session = readSessionFromCookieHeader(request.headers.get("cookie"));
  if (session?.email) {
    notifyUserLogout(session.email);
  }

  return clearSessionCookie();
}
