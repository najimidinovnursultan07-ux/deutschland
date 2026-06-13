import { readJsonArray, writeJsonArray } from "@/lib/storage/jsonStore";
import type { UserSuggestion } from "@/types";

const SUGGESTIONS_KEY = "lingua:suggestions";

type StoredSuggestion = UserSuggestion & {
  message?: string;
};

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

export async function listSuggestions(): Promise<UserSuggestion[]> {
  const raw = await readJsonArray<StoredSuggestion>(SUGGESTIONS_KEY);
  return sortSuggestions(raw.map(normalizeSuggestion));
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

  await writeJsonArray(SUGGESTIONS_KEY, [entry, ...existing]);
  return entry;
}
