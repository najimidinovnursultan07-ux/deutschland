import { readJsonArray, writeJsonArray } from "@/lib/storage/jsonStore";
import { normalizeEmail } from "@/lib/admin";
import type { LeaderboardEntry } from "@/types";

const PROGRESS_KEY = "lingua:progress";

export interface StoredUserProgress {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string;
  xp: number;
  dailyXp: number;
  passedLessonCount: number;
  updatedAt: string;
}

export function computeWeeklyXp(dailyXp: number, totalXp: number): number {
  return dailyXp + Math.floor(totalXp * 0.3);
}

/** Active = earned XP or completed at least one lesson quiz */
export function isActiveLeaderboardUser(progress: StoredUserProgress): boolean {
  return progress.xp > 0 || progress.passedLessonCount > 0;
}

export async function upsertUserProgress(input: {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string;
  xp: number;
  dailyXp: number;
  passedLessonCount: number;
}): Promise<StoredUserProgress> {
  const all = await readJsonArray<StoredUserProgress>(PROGRESS_KEY);
  const email = normalizeEmail(input.email);
  const now = new Date().toISOString();

  const entry: StoredUserProgress = {
    userId: input.userId,
    name: input.name.trim() || email,
    email,
    avatarUrl: input.avatarUrl,
    xp: Math.max(0, input.xp),
    dailyXp: Math.max(0, input.dailyXp),
    passedLessonCount: Math.max(0, input.passedLessonCount),
    updatedAt: now,
  };

  const existingIndex = all.findIndex((p) => p.userId === input.userId);
  const next =
    existingIndex >= 0
      ? all.map((p, i) => (i === existingIndex ? entry : p))
      : [...all, entry];

  await writeJsonArray(PROGRESS_KEY, next);
  return entry;
}

export async function listLeaderboardEntries(
  limit = 10
): Promise<LeaderboardEntry[]> {
  const all = await readJsonArray<StoredUserProgress>(PROGRESS_KEY);

  return all
    .filter(isActiveLeaderboardUser)
    .map((p) => ({
      id: p.userId,
      name: p.name,
      avatarUrl: p.avatarUrl,
      weeklyXp: computeWeeklyXp(p.dailyXp, p.xp),
      totalXp: p.xp,
      passedLessonCount: p.passedLessonCount,
    }))
    .sort((a, b) => b.weeklyXp - a.weeklyXp || b.totalXp - a.totalXp)
    .slice(0, limit);
}
