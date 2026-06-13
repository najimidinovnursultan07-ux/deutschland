import { ROOT_ADMIN_EMAIL, normalizeEmail } from "@/lib/admin";
import type { User } from "@/types";

const ROOT_ADMIN_ID = "user_root_admin_local";

/**
 * Development only: ensures the root admin exists in localStorage auth
 * with the password from NEXT_PUBLIC_DEV_ADMIN_PASSWORD.
 */
export function bootstrapLocalRootAdmin(users: User[]): User[] {
  if (process.env.NODE_ENV !== "development") {
    return users;
  }

  const devPassword = process.env.NEXT_PUBLIC_DEV_ADMIN_PASSWORD?.trim();
  if (!devPassword) {
    return users;
  }

  const email = normalizeEmail(ROOT_ADMIN_EMAIL);
  const existingIndex = users.findIndex(
    (u) => normalizeEmail(u.email) === email
  );

  if (existingIndex >= 0) {
    return users.map((u, index) =>
      index === existingIndex
        ? {
            ...u,
            email,
            password: devPassword,
            role: "ADMIN",
          }
        : u
    );
  }

  const seeded: User = {
    id: ROOT_ADMIN_ID,
    name: "Nursultan",
    email,
    password: devPassword,
    avatarUrl:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=nursultan-admin",
    targetLanguage: "de",
    createdAt: new Date().toISOString(),
    role: "ADMIN",
  };

  return [...users, seeded];
}
