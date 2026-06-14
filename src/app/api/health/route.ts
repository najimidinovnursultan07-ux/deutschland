import { NextResponse } from "next/server";
import { getStorageDiagnostics } from "@/lib/storage/jsonStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const diagnostics = getStorageDiagnostics();
  const ok =
    !diagnostics.vercel ||
    (diagnostics.redisConfigured && diagnostics.sessionSecretConfigured);

  return NextResponse.json(
    {
      ok,
      storage: diagnostics.redisConfigured ? "redis" : "unconfigured",
      session: diagnostics.sessionSecretConfigured ? "configured" : "missing",
      platform: diagnostics.vercel ? "vercel" : "local",
      ...(ok ? {} : { missingEnv: diagnostics.missing }),
    },
    { status: ok ? 200 : 503 },
  );
}
