import { NextResponse } from "next/server";
import { listLeaderboardEntries } from "@/lib/progress/repository";

export const runtime = "nodejs";

export async function GET() {
  try {
    const entries = await listLeaderboardEntries(200);
    return NextResponse.json(
      { entries },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[GET /api/leaderboard]", error);
    return NextResponse.json(
      { error: "Failed to load leaderboard" },
      { status: 500 }
    );
  }
}
