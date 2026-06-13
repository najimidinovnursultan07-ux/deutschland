import type { User } from "@/types";
import type { DirectoryUser } from "@/types";

/** Mirrors server session cookie for API route authorization */
export async function syncAuthSession(
  user: User | null
): Promise<DirectoryUser | null> {
  try {
    if (user) {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }),
      });

      if (!res.ok) return null;

      const data = (await res.json()) as { user?: DirectoryUser };
      return data.user ?? null;
    }

    await fetch("/api/auth/session", {
      method: "DELETE",
      credentials: "include",
    });
    return null;
  } catch {
    return null;
  }
}
