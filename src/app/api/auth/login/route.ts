import { NextResponse } from "next/server";
import { attachSessionCookie } from "@/lib/auth/cookies";
import { authenticateUser } from "@/lib/auth/userRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!body.email?.trim() || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await authenticateUser(body.email, body.password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return attachSessionCookie(user);
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
