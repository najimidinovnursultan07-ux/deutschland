import { NextResponse } from "next/server";
import { attachSessionCookie } from "@/lib/auth/cookies";
import { authenticateUser } from "@/lib/auth/userRepository";
import {
  notifyFailedLogin,
  notifyUserLogin,
} from "@/lib/telegram/notifications";
import { PersistentStorageError } from "@/lib/storage/jsonStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim() ?? "";
    const password = body.password?.trim() ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { code: "VALIDATION_ERROR", error: "Email and password are required" },
        { status: 400 },
      );
    }

    const result = await authenticateUser(email, password);

    if (!result.ok) {
      notifyFailedLogin(email);

      if (result.reason === "USER_NOT_FOUND") {
        return NextResponse.json(
          {
            code: "EMAIL_NOT_FOUND",
            error: "No account found for this email",
          },
          { status: 401 },
        );
      }

      return NextResponse.json(
        {
          code: "WRONG_PASSWORD",
          error: "Incorrect password",
        },
        { status: 401 },
      );
    }

    notifyUserLogin({
      name: result.user.name,
      email: result.user.email,
    });

    return attachSessionCookie(result.user);
  } catch (error) {
    if (error instanceof PersistentStorageError) {
      console.error("[POST /api/auth/login]", error.message);
      return NextResponse.json(
        {
          code: "STORAGE_ERROR",
          error: "Server storage is not configured",
        },
        { status: 503 },
      );
    }
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json(
      { code: "SERVER_ERROR", error: "Login failed" },
      { status: 500 },
    );
  }
}
