"use client";

import { create } from "zustand";
import { createInitialLevelProgress } from "@/data/lessonFactory";
import {
  ACHIEVEMENTS,
  advanceSRS,
  calcRegeneratedHearts,
  countDueReviews,
  createSRSRecord,
  demoteSRS,
  DAILY_GOAL_CONFIG,
  HEART_REFILL_XP_COST,
  MAX_HEARTS,
  todayKey,
} from "@/lib/gamification";
import type { PersistedAppState } from "@/lib/progress/appStateRepository";
import type {
  AppSettings,
  AppState,
  CEFRLevel,
  DailyGoalTier,
  LanguagePair,
  SRSRecord,
} from "@/types";
import type { LessonSessionState } from "@/types/lessonWorkflow";

interface AppStore extends AppState {
  setLanguagePair: (pair: LanguagePair) => void;
  setSelectedLevel: (level: CEFRLevel) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  saveLessonSession: (session: LessonSessionState) => void;
  clearLessonSession: (lessonId?: string) => void;
  completeLesson: (lessonId: string, level: CEFRLevel, wordCount: number) => void;
  passLessonQuiz: (
    lessonId: string,
    level: CEFRLevel,
    wordIds: string[],
    perfect: boolean
  ) => void;
  addRecentLesson: (lessonId: string) => void;
  addXp: (amount: number) => void;
  setDailyGoalTier: (tier: DailyGoalTier) => void;
  loseHeart: () => boolean;
  refillHeartsWithXp: () => boolean;
  syncHearts: () => void;
  reviewSRSWord: (wordId: string, correct: boolean) => void;
  initSRSForWords: (wordIds: string[]) => void;
  clearPendingAchievement: () => void;
  getDueReviewCount: () => number;
  hydrateFromServer: (state: PersistedAppState) => void;
  exportPersistedState: () => PersistedAppState;
  resetProgress: () => void;
}

const defaultSettings: AppSettings = {
  dailyReminders: true,
  achievementSounds: true,
  systemNotifications: false,
  theme: "dark",
  interfaceLanguage: "ru",
};

function checkAchievements(
  state: AppState,
  unlocked: string[]
): string | null {
  const ctx = {
    totalWordsLearned: state.totalWordsLearned,
    streak: state.streak,
    perfectQuizCount: state.perfectQuizCount,
  };
  for (const ach of ACHIEVEMENTS) {
    if (!unlocked.includes(ach.id) && ach.check(ctx)) {
      return ach.id;
    }
  }
  return null;
}

function updateStreak(lastStudyDate: string | null, streak: number): {
  streak: number;
  lastStudyDate: string;
} {
  const today = todayKey();
  if (lastStudyDate === today) return { streak, lastStudyDate: today };
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split("T")[0];
  const newStreak = lastStudyDate === yesterdayKey ? streak + 1 : 1;
  return { streak: newStreak, lastStudyDate: today };
}

function resetDailyXpIfNeeded(dailyXp: number, dailyXpDate: string): {
  dailyXp: number;
  dailyXpDate: string;
} {
  const today = todayKey();
  if (dailyXpDate === today) return { dailyXp, dailyXpDate };
  return { dailyXp: 0, dailyXpDate: today };
}

function createDefaultAppState(): AppState {
  return {
    languagePair: "ru-de",
    selectedLevel: "A0",
    settings: defaultSettings,
    streak: 0,
    lastStudyDate: null,
    totalWordsLearned: 0,
    recentLessonIds: [],
    levelProgress: createInitialLevelProgress(),
    completedLessonIds: [],
    passedQuizLessonIds: [],
    perfectQuizCount: 0,
    xp: 0,
    dailyXp: 0,
    dailyXpDate: todayKey(),
    dailyGoalTier: "casual",
    hearts: MAX_HEARTS,
    lastHeartRegenAt: new Date().toISOString(),
    srsRecords: {},
    unlockedAchievements: [],
    pendingAchievement: null,
    activeLessonSession: null,
  };
}

export const useAppStore = create<AppStore>()((set, get) => ({
  ...createDefaultAppState(),

      saveLessonSession: (session) =>
        set({ activeLessonSession: session }),

      clearLessonSession: (lessonId) =>
        set((state) => {
          if (lessonId && state.activeLessonSession?.lessonId !== lessonId) {
            return state;
          }
          return { activeLessonSession: null };
        }),

      setLanguagePair: (pair) => {
        const base = pair.split("-")[0] as "ky" | "ru";
        set((state) => ({
          languagePair: pair,
          settings: { ...state.settings, interfaceLanguage: base },
        }));
      },

      setSelectedLevel: (level) => set({ selectedLevel: level }),

      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),

      addXp: (amount) =>
        set((state) => {
          const daily = resetDailyXpIfNeeded(state.dailyXp, state.dailyXpDate);
          const streakUpdate = updateStreak(state.lastStudyDate, state.streak);
          const newState: AppState = {
            ...state,
            xp: state.xp + amount,
            dailyXp: daily.dailyXp + amount,
            dailyXpDate: daily.dailyXpDate,
            ...streakUpdate,
          };
          const newUnlock = [...state.unlockedAchievements];
          const pending = checkAchievements(newState, newUnlock);
          if (pending) newUnlock.push(pending);
          return {
            ...newState,
            unlockedAchievements: newUnlock,
            pendingAchievement: pending ?? state.pendingAchievement,
          };
        }),

      setDailyGoalTier: (tier) => set({ dailyGoalTier: tier }),

      syncHearts: () =>
        set((state) => {
          const regen = calcRegeneratedHearts(
            state.hearts,
            state.lastHeartRegenAt
          );
          if (
            regen.hearts === state.hearts &&
            regen.lastHeartRegenAt === state.lastHeartRegenAt
          ) {
            return state;
          }
          return {
            hearts: regen.hearts,
            lastHeartRegenAt: regen.lastHeartRegenAt,
          };
        }),

      loseHeart: () => {
        get().syncHearts();
        const hearts = get().hearts;
        if (hearts <= 0) return false;
        set({
          hearts: hearts - 1,
          lastHeartRegenAt: new Date().toISOString(),
        });
        return get().hearts > 0;
      },

      refillHeartsWithXp: () => {
        const state = get();
        if (state.xp < HEART_REFILL_XP_COST) return false;
        set({
          xp: state.xp - HEART_REFILL_XP_COST,
          hearts: MAX_HEARTS,
          lastHeartRegenAt: new Date().toISOString(),
        });
        return true;
      },

      initSRSForWords: (wordIds) =>
        set((state) => {
          const srsRecords = { ...state.srsRecords };
          for (const id of wordIds) {
            if (!srsRecords[id]) {
              srsRecords[id] = createSRSRecord(id);
            }
          }
          return { srsRecords };
        }),

      reviewSRSWord: (wordId, correct) =>
        set((state) => {
          const existing = state.srsRecords[wordId] ?? createSRSRecord(wordId);
          const updated: SRSRecord = correct
            ? advanceSRS(existing)
            : demoteSRS(existing);
          const srsRecords = { ...state.srsRecords, [wordId]: updated };
          const xpGain = correct ? 5 : 0;
          if (xpGain > 0) get().addXp(xpGain);
          return { srsRecords };
        }),

      getDueReviewCount: () => countDueReviews(get().srsRecords),

      completeLesson: (lessonId, level, wordCount) => {
        const state = get();
        if (state.completedLessonIds.includes(lessonId)) return;

        const levelProgress = { ...state.levelProgress };
        const current = levelProgress[level];
        levelProgress[level] = {
          ...current,
          completedLessons: current.completedLessons + 1,
          wordsLearned: current.wordsLearned + wordCount,
        };

        const streakUpdate = updateStreak(state.lastStudyDate, state.streak);
        const newState: AppState = {
          ...state,
          completedLessonIds: [...state.completedLessonIds, lessonId],
          levelProgress,
          totalWordsLearned: state.totalWordsLearned + wordCount,
          ...streakUpdate,
        };
        const newUnlock = [...state.unlockedAchievements];
        const pending = checkAchievements(newState, newUnlock);
        if (pending) newUnlock.push(pending);

        set({
          ...newState,
          unlockedAchievements: newUnlock,
          pendingAchievement: pending ?? state.pendingAchievement,
        });
      },

      passLessonQuiz: (lessonId, level, wordIds, perfect) => {
        const state = get();
        if (state.passedQuizLessonIds.includes(lessonId)) return;

        get().initSRSForWords(wordIds);
        const wordCount = wordIds.length;
        get().completeLesson(lessonId, level, wordCount);
        get().addXp(50);
        get().addRecentLesson(lessonId);
        get().clearLessonSession(lessonId);

        set((s) => {
          const newUnlock = [...s.unlockedAchievements];
          const perfectQuizCount = perfect
            ? s.perfectQuizCount + 1
            : s.perfectQuizCount;
          const interim: AppState = { ...s, perfectQuizCount };
          const pending = checkAchievements(interim, newUnlock);
          if (pending) newUnlock.push(pending);
          return {
            passedQuizLessonIds: [...s.passedQuizLessonIds, lessonId],
            perfectQuizCount,
            unlockedAchievements: newUnlock,
            pendingAchievement: pending ?? s.pendingAchievement,
          };
        });
      },

      addRecentLesson: (lessonId) =>
        set((state) => ({
          recentLessonIds: [
            lessonId,
            ...state.recentLessonIds.filter((id) => id !== lessonId),
          ].slice(0, 5),
        })),

      clearPendingAchievement: () => set({ pendingAchievement: null }),

      hydrateFromServer: (state) =>
        set({
          ...get(),
          ...state,
          pendingAchievement: null,
        }),

      exportPersistedState: () => {
        const s = get();
        return {
          languagePair: s.languagePair,
          selectedLevel: s.selectedLevel,
          settings: s.settings,
          streak: s.streak,
          lastStudyDate: s.lastStudyDate,
          totalWordsLearned: s.totalWordsLearned,
          recentLessonIds: s.recentLessonIds,
          levelProgress: s.levelProgress,
          completedLessonIds: s.completedLessonIds,
          passedQuizLessonIds: s.passedQuizLessonIds,
          perfectQuizCount: s.perfectQuizCount,
          xp: s.xp,
          dailyXp: s.dailyXp,
          dailyXpDate: s.dailyXpDate,
          dailyGoalTier: s.dailyGoalTier,
          hearts: s.hearts,
          lastHeartRegenAt: s.lastHeartRegenAt,
          srsRecords: s.srsRecords,
          unlockedAchievements: s.unlockedAchievements,
          activeLessonSession: s.activeLessonSession,
        };
      },

      resetProgress: () => set(createDefaultAppState()),
}));

export function getTargetLangFromPair(pair: LanguagePair): "de" | "en" {
  return pair.split("-")[1] as "de" | "en";
}

export function getBaseLangFromPair(pair: LanguagePair): "ky" | "ru" {
  return pair.split("-")[0] as "ky" | "ru";
}

export function getDailyGoalTarget(tier: DailyGoalTier): number {
  return DAILY_GOAL_CONFIG[tier].xpTarget;
}
