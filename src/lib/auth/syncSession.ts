import type { User } from "@/types";

/** Mirrors server session cookie for API route authorization */
export async function syncAuthSession(user: User | null): Promise<void> {
  try {
    if (user) {
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          role: user.role,
        }),
      });
      return;
    }

    await fetch("/api/auth/session", {
      method: "DELETE",
      credentials: "include",
    });
  } catch {
    // Non-blocking — client auth still works offline
  }
}
