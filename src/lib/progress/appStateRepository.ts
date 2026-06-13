import { readJsonObject, writeJsonObject } from "@/lib/storage/jsonStore";
import { upsertUserProgress } from "@/lib/progress/repository";
import type { AppState } from "@/types";

const APP_STATE_KEY = "lingua:app-states";

export type PersistedAppState = Pick<
  AppState,
  | "languagePair"
  | "selectedLevel"
  | "settings"
  | "streak"
  | "lastStudyDate"
  | "totalWordsLearned"
  | "recentLessonIds"
  | "levelProgress"
  | "completedLessonIds"
  | "passedQuizLessonIds"
  | "perfectQuizCount"
  | "xp"
  | "dailyXp"
  | "dailyXpDate"
  | "dailyGoalTier"
  | "hearts"
  | "lastHeartRegenAt"
  | "srsRecords"
  | "unlockedAchievements"
  | "activeLessonSession"
>;

type StateMap = Record<string, PersistedAppState>;

export async function loadAppState(
  userId: string
): Promise<PersistedAppState | null> {
  const map = await readJsonObject<StateMap>(APP_STATE_KEY);
  return map[userId] ?? null;
}

export async function saveAppState(
  userId: string,
  state: PersistedAppState,
  profile: {
    name: string;
    email: string;
    avatarUrl: string;
  }
): Promise<PersistedAppState> {
  const map = await readJsonObject<StateMap>(APP_STATE_KEY);
  map[userId] = state;
  await writeJsonObject(APP_STATE_KEY, map);

  await upsertUserProgress({
    userId,
    name: profile.name,
    email: profile.email,
    avatarUrl: profile.avatarUrl,
    xp: state.xp,
    dailyXp: state.dailyXp,
    passedLessonCount: state.passedQuizLessonIds.length,
  });

  return state;
}
