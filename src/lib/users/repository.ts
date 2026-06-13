import { isRootAdmin, normalizeEmail, resolveUserRole } from "@/lib/admin";
import { readJsonArray, writeJsonArray } from "@/lib/storage/jsonStore";
import type { DirectoryUser, UserRole } from "@/types";

const USERS_KEY = "lingua:users";

function sortUsers(users: DirectoryUser[]): DirectoryUser[] {
  return [...users].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function listDirectoryUsers(): Promise<DirectoryUser[]> {
  const users = await readJsonArray<DirectoryUser>(USERS_KEY);
  return sortUsers(
    users.map((u) => ({
      ...u,
      email: normalizeEmail(u.email),
      role: resolveUserRole(u.email, u.role),
    }))
  );
}

export async function getDirectoryUserById(
  userId: string
): Promise<DirectoryUser | null> {
  const users = await listDirectoryUsers();
  return users.find((u) => u.id === userId) ?? null;
}

export async function getDirectoryUserByEmail(
  email: string
): Promise<DirectoryUser | null> {
  const normalized = normalizeEmail(email);
  const users = await listDirectoryUsers();
  return users.find((u) => u.email === normalized) ?? null;
}

export async function upsertDirectoryUser(input: {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
}): Promise<DirectoryUser> {
  const users = await listDirectoryUsers();
  const email = normalizeEmail(input.email);
  const now = new Date().toISOString();
  const existing = users.find((u) => u.id === input.id || u.email === email);

  const role = isRootAdmin(email)
    ? "ADMIN"
    : resolveUserRole(email, existing?.role ?? input.role ?? "USER");

  const entry: DirectoryUser = {
    id: input.id,
    name: input.name.trim() || existing?.name || email,
    email,
    role,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  const next = existing
    ? users.map((u) =>
        u.id === existing.id || u.email === email ? entry : u
      )
    : [entry, ...users];

  await writeJsonArray(USERS_KEY, next);
  return entry;
}

export async function updateDirectoryUserRole(
  userId: string,
  role: UserRole
): Promise<DirectoryUser | null> {
  const users = await listDirectoryUsers();
  const target = users.find((u) => u.id === userId);
  if (!target || isRootAdmin(target.email)) return null;

  const nextRole: UserRole = role === "MODERATOR" ? "MODERATOR" : "USER";
  const now = new Date().toISOString();

  const updated: DirectoryUser = {
    ...target,
    role: nextRole,
    updatedAt: now,
  };

  const next = users.map((u) => (u.id === userId ? updated : u));
  await writeJsonArray(USERS_KEY, next);
  return updated;
}
