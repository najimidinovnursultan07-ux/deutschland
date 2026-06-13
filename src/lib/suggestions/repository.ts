import { Redis } from "@upstash/redis";
import { promises as fs } from "fs";
import path from "path";
import type { UserSuggestion } from "@/types";

const KV_KEY = "lingua:suggestions";

type StoredSuggestion = UserSuggestion & {
  /** @deprecated legacy field */
  message?: string;
};

function getRedisUrl(): string | undefined {
  return process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
}

function getRedisToken(): string | undefined {
  return (
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
  );
}

function isRedisConfigured(): boolean {
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

function getFilePath(): string {
  if (process.env.VERCEL) {
    return path.join("/tmp", "suggestions.json");
  }
  return path.join(process.cwd(), "data", "suggestions.json");
}

function normalizeSuggestion(raw: StoredSuggestion): UserSuggestion {
  return {
    id: raw.id,
    userId: raw.userId,
    userEmail: raw.userEmail,
    text: raw.text ?? raw.message ?? "",
    createdAt: raw.createdAt,
  };
}

function sortSuggestions(items: UserSuggestion[]): UserSuggestion[] {
  return items
    .filter((s) => s.text.trim().length > 0)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

async function readFromRedis(): Promise<UserSuggestion[]> {
  const redis = createRedisClient();
  const raw = await redis.get<StoredSuggestion[]>(KV_KEY);
  if (!raw || !Array.isArray(raw)) return [];
  return sortSuggestions(raw.map(normalizeSuggestion));
}

async function writeToRedis(items: UserSuggestion[]): Promise<void> {
  const redis = createRedisClient();
  await redis.set(KV_KEY, items);
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

async function readFromFile(): Promise<UserSuggestion[]> {
  const filePath = getFilePath();
  await ensureFileStore(filePath);
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as StoredSuggestion[];
  return sortSuggestions(parsed.map(normalizeSuggestion));
}

async function writeToFile(items: UserSuggestion[]): Promise<void> {
  const filePath = getFilePath();
  await ensureFileStore(filePath);
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8");
}

export async function listSuggestions(): Promise<UserSuggestion[]> {
  if (isRedisConfigured()) {
    return readFromRedis();
  }
  return readFromFile();
}

export async function addSuggestion(
  input: Omit<UserSuggestion, "id" | "createdAt">
): Promise<UserSuggestion> {
  const existing = await listSuggestions();
  const entry: UserSuggestion = {
    id: `sug_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    userId: input.userId,
    userEmail: input.userEmail.trim().toLowerCase(),
    text: input.text.trim(),
    createdAt: new Date().toISOString(),
  };

  const next = [entry, ...existing];

  if (isRedisConfigured()) {
    await writeToRedis(next);
  } else {
    await writeToFile(next);
  }

  return entry;
}
