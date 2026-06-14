import { Redis } from "@upstash/redis";
import { promises as fs } from "fs";
import path from "path";

export class PersistentStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PersistentStorageError";
  }
}

function getRedisUrl(): string | undefined {
  return process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
}

function getRedisToken(): string | undefined {
  return (
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  );
}

export function isRedisConfigured(): boolean {
  return Boolean(getRedisUrl() && getRedisToken());
}

export function isProductionDeployment(): boolean {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}

/** Auth/progress must use Redis on Vercel — filesystem is not durable there. */
export function assertPersistentStorage(): void {
  if (process.env.VERCEL === "1" && !isRedisConfigured()) {
    throw new PersistentStorageError(
      "Persistent storage is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in your deployment environment.",
    );
  }
}

export function createRedisClient(): Redis {
  const url = getRedisUrl();
  const token = getRedisToken();
  if (!url || !token) {
    throw new PersistentStorageError("Redis credentials are not configured");
  }
  return new Redis({ url, token });
}

function getFilePath(key: string): string {
  const safeName = key.replace(/[^a-z0-9:_-]/gi, "_");
  return path.join(process.cwd(), "data", `${safeName}.json`);
}

async function ensureFileStore(filePath: string): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]", "utf8");
  }
}

export async function readJsonArray<T>(key: string): Promise<T[]> {
  assertPersistentStorage();

  if (isRedisConfigured()) {
    const redis = createRedisClient();
    const raw = await redis.get<T[]>(key);
    return Array.isArray(raw) ? raw : [];
  }

  const filePath = getFilePath(key);
  await ensureFileStore(filePath);
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as T[];
  return Array.isArray(parsed) ? parsed : [];
}

export async function writeJsonArray<T>(key: string, items: T[]): Promise<void> {
  assertPersistentStorage();

  if (isRedisConfigured()) {
    const redis = createRedisClient();
    await redis.set(key, items);
    return;
  }

  const filePath = getFilePath(key);
  await ensureFileStore(filePath);
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8");
}

async function ensureObjectFileStore(filePath: string): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "{}", "utf8");
  }
}

export async function readJsonObject<T extends Record<string, unknown>>(
  key: string
): Promise<T> {
  assertPersistentStorage();

  if (isRedisConfigured()) {
    const redis = createRedisClient();
    const raw = await redis.get<T>(key);
    return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : ({} as T);
  }

  const filePath = getFilePath(key);
  await ensureObjectFileStore(filePath);
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as T;
  return parsed && typeof parsed === "object" && !Array.isArray(parsed)
    ? parsed
    : ({} as T);
}

export async function writeJsonObject<T extends Record<string, unknown>>(
  key: string,
  value: T
): Promise<void> {
  assertPersistentStorage();

  if (isRedisConfigured()) {
    const redis = createRedisClient();
    await redis.set(key, value);
    return;
  }

  const filePath = getFilePath(key);
  await ensureObjectFileStore(filePath);
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}
