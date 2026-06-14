import { normalizeEmail } from "@/lib/admin";
import { readJsonArray, writeJsonArray } from "@/lib/storage/jsonStore";
import { listDirectoryUsers } from "@/lib/users/repository";
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

function defaultAvatar(name: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
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

/** All registered users merged with progress — sorted by total XP descending */
export async function listLeaderboardEntries(
  limit = 200
): Promise<LeaderboardEntry[]> {
  const [allProgress, registeredUsers] = await Promise.all([
    readJsonArray<StoredUserProgress>(PROGRESS_KEY),
    listDirectoryUsers(),
  ]);

  const progressByUserId = new Map(
    allProgress.map((progress) => [progress.userId, progress])
  );

  const entries: LeaderboardEntry[] = registeredUsers.map((user) => {
    const progress = progressByUserId.get(user.id);
    const totalXp = progress?.xp ?? 0;
    const dailyXp = progress?.dailyXp ?? 0;

    return {
      id: user.id,
      name: user.name,
      avatarUrl: progress?.avatarUrl ?? defaultAvatar(user.name),
      weeklyXp: computeWeeklyXp(dailyXp, totalXp),
      totalXp,
      passedLessonCount: progress?.passedLessonCount ?? 0,
    };
  });

  return entries
    .sort((a, b) => b.totalXp - a.totalXp || b.weeklyXp - a.weeklyXp)
    .slice(0, limit);
}
