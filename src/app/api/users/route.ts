import { NextResponse } from "next/server";
import { readSessionFromCookieHeader } from "@/lib/auth/session";
import { isRootAdmin } from "@/lib/admin";
import {
  listDirectoryUsers,
  updateDirectoryUserRole,
} from "@/lib/users/repository";
import type { UserRole } from "@/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const session = readSessionFromCookieHeader(request.headers.get("cookie"));

    if (!session || !isRootAdmin(session.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await listDirectoryUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error("[GET /api/users]", error);
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = readSessionFromCookieHeader(request.headers.get("cookie"));

    if (!session || !isRootAdmin(session.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as {
      userId?: string;
      role?: UserRole;
    };

    if (!body.userId || !body.role) {
      return NextResponse.json(
        { error: "userId and role are required" },
        { status: 400 }
      );
    }

    if (body.role !== "USER" && body.role !== "MODERATOR") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const updated = await updateDirectoryUserRole(body.userId, body.role);
    if (!updated) {
      return NextResponse.json(
        { error: "User not found or cannot be modified" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("[PATCH /api/users]", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}
