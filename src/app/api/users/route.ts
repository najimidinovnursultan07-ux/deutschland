import { NextResponse } from "next/server";
import { readSessionFromCookieHeader } from "@/lib/auth/session";
import { isRootAdmin } from "@/lib/admin";
import {
  listPublicUsers,
  updateAuthUserRole,
} from "@/lib/auth/userRepository";
import type { DirectoryUser, UserRole } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toDirectoryUser(user: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}): DirectoryUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.createdAt,
  };
}

export async function GET(request: Request) {
  try {
    const session = readSessionFromCookieHeader(request.headers.get("cookie"));

    if (!session || !isRootAdmin(session.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await listPublicUsers();
    return NextResponse.json({
      users: users.map(toDirectoryUser),
    });
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

    const updated = await updateAuthUserRole(body.userId, body.role);
    if (!updated) {
      return NextResponse.json(
        { error: "User not found or cannot be modified" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: toDirectoryUser(updated) });
  } catch (error) {
    console.error("[PATCH /api/users]", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}
