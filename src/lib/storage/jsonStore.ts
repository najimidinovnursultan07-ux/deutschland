import { Redis } from "@upstash/redis";
import { promises as fs } from "fs";
import path from "path";

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

function createRedisClient(): Redis {
  const url = getRedisUrl();
  const token = getRedisToken();
  if (!url || !token) {
    throw new Error("Redis credentials are not configured");
  }
  return new Redis({ url, token });
}

function getFilePath(key: string): string {
  const safeName = key.replace(/[^a-z0-9:_-]/gi, "_");
  if (process.env.VERCEL) {
    return path.join("/tmp", `${safeName}.json`);
  }
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
  if (isRedisConfigured()) {
    const redis = createRedisClient();
    await redis.set(key, items);
    return;
  }

  const filePath = getFilePath(key);
  await ensureFileStore(filePath);
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8");
}
