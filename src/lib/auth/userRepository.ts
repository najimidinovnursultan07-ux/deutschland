import { isRootAdmin, normalizeEmail, resolveUserRole, ROOT_ADMIN_EMAIL } from "@/lib/admin";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { readJsonArray, writeJsonArray } from "@/lib/storage/jsonStore";
import { upsertDirectoryUser } from "@/lib/users/repository";
import type { PublicUser, TargetLanguage, UserRole } from "@/types";

const AUTH_USERS_KEY = "lingua:auth-users";

export interface StoredAuthUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  avatarUrl: string;
  targetLanguage: TargetLanguage;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function toPublicUser(user: StoredAuthUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    targetLanguage: user.targetLanguage,
    createdAt: user.createdAt,
    role: resolveUserRole(user.email, user.role),
  };
}

async function listAuthUsers(): Promise<StoredAuthUser[]> {
  return readJsonArray<StoredAuthUser>(AUTH_USERS_KEY);
}

async function saveAuthUsers(users: StoredAuthUser[]): Promise<void> {
  await writeJsonArray(AUTH_USERS_KEY, users);
}

export async function findAuthUserByEmail(
  email: string
): Promise<StoredAuthUser | null> {
  const normalized = normalizeEmail(email);
  const users = await listAuthUsers();
  return users.find((u) => normalizeEmail(u.email) === normalized) ?? null;
}

export async function findAuthUserById(
  id: string
): Promise<StoredAuthUser | null> {
  const users = await listAuthUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function ensureRootAdminAccount(): Promise<void> {
  const existing = await findAuthUserByEmail(ROOT_ADMIN_EMAIL);
  if (existing) return;

  const password =
    process.env.ROOT_ADMIN_PASSWORD ??
    process.env.NEXT_PUBLIC_DEV_ADMIN_PASSWORD;

  if (!password?.trim()) return;

  await createAuthUser({
    name: "Nursultan",
    email: ROOT_ADMIN_EMAIL,
    password: password.trim(),
    targetLanguage: "de",
  });
}

export async function createAuthUser(input: {
  name: string;
  email: string;
  password: string;
  targetLanguage: TargetLanguage;
}): Promise<PublicUser> {
  const email = normalizeEmail(input.email);
  const existing = await findAuthUserByEmail(email);
  if (existing) {
    throw new Error("EMAIL_EXISTS");
  }

  const now = new Date().toISOString();
  const passwordHash = await hashPassword(input.password.trim());
  const role = isRootAdmin(email) ? "ADMIN" : "USER";

  const user: StoredAuthUser = {
    id: generateId(),
    email,
    passwordHash,
    name: input.name.trim() || email,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(input.name.trim() || email)}`,
    targetLanguage: input.targetLanguage,
    role,
    createdAt: now,
    updatedAt: now,
  };

  const users = await listAuthUsers();
  await saveAuthUsers([user, ...users]);
  await upsertDirectoryUser({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return toPublicUser(user);
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<PublicUser | null> {
  await ensureRootAdminAccount();

  const user = await findAuthUserByEmail(email);
  if (!user) return null;

  const valid = await verifyPassword(password.trim(), user.passwordHash);
  if (!valid) return null;

  const role = resolveUserRole(user.email, user.role);
  const updated: StoredAuthUser = {
    ...user,
    role,
    updatedAt: new Date().toISOString(),
  };

  const users = await listAuthUsers();
  await saveAuthUsers(
    users.map((u) => (u.id === user.id ? updated : u))
  );

  await upsertDirectoryUser({
    id: updated.id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
  });

  return toPublicUser(updated);
}

export async function updateAuthUserProfile(
  userId: string,
  input: {
    name?: string;
    avatarUrl?: string;
    targetLanguage?: TargetLanguage;
    password?: string;
    currentPassword?: string;
  }
): Promise<PublicUser | null> {
  const users = await listAuthUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index < 0) return null;

  const current = users[index];

  if (input.password) {
    if (!input.currentPassword) {
      throw new Error("CURRENT_PASSWORD_REQUIRED");
    }
    const valid = await verifyPassword(
      input.currentPassword,
      current.passwordHash
    );
    if (!valid) throw new Error("INVALID_PASSWORD");
  }

  const updated: StoredAuthUser = {
    ...current,
    name: input.name?.trim() || current.name,
    avatarUrl: input.avatarUrl ?? current.avatarUrl,
    targetLanguage: input.targetLanguage ?? current.targetLanguage,
    passwordHash: input.password
      ? await hashPassword(input.password)
      : current.passwordHash,
    role: resolveUserRole(current.email, current.role),
    updatedAt: new Date().toISOString(),
  };

  const next = [...users];
  next[index] = updated;
  await saveAuthUsers(next);

  await upsertDirectoryUser({
    id: updated.id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
  });

  return toPublicUser(updated);
}

export async function listPublicUsers(): Promise<PublicUser[]> {
  await ensureRootAdminAccount();
  const users = await listAuthUsers();
  return users.map(toPublicUser);
}

export async function updateAuthUserRole(
  userId: string,
  role: UserRole
): Promise<PublicUser | null> {
  const users = await listAuthUsers();
  const target = users.find((u) => u.id === userId);
  if (!target || isRootAdmin(target.email)) return null;

  const nextRole: UserRole = role === "MODERATOR" ? "MODERATOR" : "USER";
  const updated: StoredAuthUser = {
    ...target,
    role: nextRole,
    updatedAt: new Date().toISOString(),
  };

  await saveAuthUsers(users.map((u) => (u.id === userId ? updated : u)));
  await upsertDirectoryUser({
    id: updated.id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
  });

  return toPublicUser(updated);
}
