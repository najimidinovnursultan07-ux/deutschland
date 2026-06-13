import { clearSessionCookie } from "@/lib/auth/cookies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE() {
  return clearSessionCookie();
}
