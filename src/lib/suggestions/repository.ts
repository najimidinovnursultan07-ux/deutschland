import { promises as fs } from "fs";
import path from "path";
import type { UserSuggestion } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "suggestions.json");

type StoredSuggestion = UserSuggestion & {
  /** @deprecated legacy field */
  message?: string;
};

async function ensureStore(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
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

export async function listSuggestions(): Promise<UserSuggestion[]> {
  await ensureStore();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  const parsed = JSON.parse(raw) as StoredSuggestion[];
  return parsed
    .map(normalizeSuggestion)
    .filter((s) => s.text.trim().length > 0)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function addSuggestion(
  input: Omit<UserSuggestion, "id" | "createdAt">
): Promise<UserSuggestion> {
  await ensureStore();
  const existing = await listSuggestions();
  const entry: UserSuggestion = {
    id: `sug_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    userId: input.userId,
    userEmail: input.userEmail.trim().toLowerCase(),
    text: input.text.trim(),
    createdAt: new Date().toISOString(),
  };

  const next = [entry, ...existing];
  await fs.writeFile(DATA_FILE, JSON.stringify(next, null, 2), "utf8");
  return entry;
}
