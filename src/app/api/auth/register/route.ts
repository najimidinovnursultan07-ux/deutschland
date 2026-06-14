import { NextResponse } from "next/server";
import { attachSessionCookie } from "@/lib/auth/cookies";
import {
  createAuthUser,
  emailAlreadyRegistered,
} from "@/lib/auth/userRepository";
import { notifyUserRegistered } from "@/lib/telegram/notifications";
import { PersistentStorageError } from "@/lib/storage/jsonStore";
import type { TargetLanguage } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
      targetLanguage?: TargetLanguage;
    };

    if (!body.email?.trim() || !body.password || !body.name?.trim()) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (await emailAlreadyRegistered(body.email)) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const user = await createAuthUser({
      name: body.name,
      email: body.email,
      password: body.password,
      targetLanguage: body.targetLanguage ?? "de",
    });

    notifyUserRegistered({
      name: user.name,
      email: user.email,
      targetLanguage: user.targetLanguage,
    });

    return attachSessionCookie(user);
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_EXISTS") {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    if (error instanceof PersistentStorageError) {
      console.error("[POST /api/auth/register]", error.message);
      return NextResponse.json(
        { error: "Server storage is not configured" },
        { status: 503 }
      );
    }
    console.error("[POST /api/auth/register]", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
