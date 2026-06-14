import { isRootAdmin, normalizeEmail, resolveUserRole, ROOT_ADMIN_EMAIL } from "@/lib/admin";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  createRedisClient,
  isRedisConfigured,
  readJsonArray,
  writeJsonArray,
} from "@/lib/storage/jsonStore";
import { getDirectoryUserByEmail, upsertDirectoryUser } from "@/lib/users/repository";
import type { PublicUser, TargetLanguage, UserRole } from "@/types";

const AUTH_USERS_KEY = "lingua:auth-users";
const AUTH_USERS_HASH_KEY = "lingua:auth-users-by-email";

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

async function migrateLegacyAuthArrayIfNeeded(): Promise<void> {
  if (!isRedisConfigured()) return;

  const redis = createRedisClient();
  const hashCount = await redis.hlen(AUTH_USERS_HASH_KEY);
  if (hashCount > 0) return;

  const legacy = await redis.get<StoredAuthUser[]>(AUTH_USERS_KEY);
  if (!Array.isArray(legacy) || legacy.length === 0) return;

  const entries: Record<string, StoredAuthUser> = {};
  for (const user of legacy) {
    entries[normalizeEmail(user.email)] = {
      ...user,
      email: normalizeEmail(user.email),
    };
  }

  await redis.hset(AUTH_USERS_HASH_KEY, entries);
}

async function listAuthUsersFromFile(): Promise<StoredAuthUser[]> {
  const users = await readJsonArray<StoredAuthUser>(AUTH_USERS_KEY);
  return users.map((user) => ({
    ...user,
    email: normalizeEmail(user.email),
  }));
}

async function saveAuthUsersToFile(users: StoredAuthUser[]): Promise<void> {
  await writeJsonArray(AUTH_USERS_KEY, users);
}

async function listAuthUsers(): Promise<StoredAuthUser[]> {
  if (isRedisConfigured()) {
    await migrateLegacyAuthArrayIfNeeded();
    const redis = createRedisClient();
    const all = await redis.hgetall<Record<string, StoredAuthUser>>(
      AUTH_USERS_HASH_KEY
    );
    if (!all) return [];
    return Object.values(all).map((user) => ({
      ...user,
      email: normalizeEmail(user.email),
    }));
  }

  return listAuthUsersFromFile();
}

async function findAuthUserByEmailInStore(
  email: string
): Promise<StoredAuthUser | null> {
  const normalized = normalizeEmail(email);

  if (isRedisConfigured()) {
    await migrateLegacyAuthArrayIfNeeded();
    const redis = createRedisClient();
    const user = await redis.hget<StoredAuthUser>(AUTH_USERS_HASH_KEY, normalized);
    return user ? { ...user, email: normalized } : null;
  }

  const users = await listAuthUsersFromFile();
  return users.find((u) => normalizeEmail(u.email) === normalized) ?? null;
}

async function upsertAuthUserInStore(user: StoredAuthUser): Promise<void> {
  const normalized = normalizeEmail(user.email);
  const record = { ...user, email: normalized };

  if (isRedisConfigured()) {
    const redis = createRedisClient();
    await redis.hset(AUTH_USERS_HASH_KEY, { [normalized]: record });
    return;
  }

  const users = await listAuthUsersFromFile();
  const index = users.findIndex(
    (u) => u.id === record.id || normalizeEmail(u.email) === normalized
  );
  const next =
    index >= 0
      ? users.map((u, i) => (i === index ? record : u))
      : [record, ...users];
  await saveAuthUsersToFile(next);
}

async function insertAuthUserIfAbsent(user: StoredAuthUser): Promise<boolean> {
  const normalized = normalizeEmail(user.email);
  const record = { ...user, email: normalized };

  if (isRedisConfigured()) {
    const redis = createRedisClient();
    const added = await redis.hsetnx(AUTH_USERS_HASH_KEY, normalized, record);
    return added === 1;
  }

  const existing = await findAuthUserByEmailInStore(normalized);
  if (existing) return false;
  await upsertAuthUserInStore(record);
  return true;
}

export async function findAuthUserByEmail(
  email: string
): Promise<StoredAuthUser | null> {
  return findAuthUserByEmailInStore(email);
}

export async function findAuthUserById(
  id: string
): Promise<StoredAuthUser | null> {
  const users = await listAuthUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function emailAlreadyRegistered(email: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  const authUser = await findAuthUserByEmailInStore(normalized);
  if (authUser) return true;
  const directoryUser = await getDirectoryUserByEmail(normalized);
  return Boolean(directoryUser);
}

export async function ensureRootAdminAccount(): Promise<void> {
  const existing = await findAuthUserByEmailInStore(ROOT_ADMIN_EMAIL);
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

  if (await emailAlreadyRegistered(email)) {
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

  const inserted = await insertAuthUserIfAbsent(user);
  if (!inserted) {
    throw new Error("EMAIL_EXISTS");
  }

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

  const user = await findAuthUserByEmailInStore(email);
  if (!user) return null;

  const valid = await verifyPassword(password.trim(), user.passwordHash);
  if (!valid) return null;

  const role = resolveUserRole(user.email, user.role);
  const updated: StoredAuthUser = {
    ...user,
    role,
    updatedAt: new Date().toISOString(),
  };

  await upsertAuthUserInStore(updated);

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
  const current = users.find((u) => u.id === userId);
  if (!current) return null;

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

  await upsertAuthUserInStore(updated);

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

  await upsertAuthUserInStore(updated);
  await upsertDirectoryUser({
    id: updated.id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
  });

  return toPublicUser(updated);
}
