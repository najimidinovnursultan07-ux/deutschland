import type { DailyGoalTier, SRSRecord } from "@/types";

export const MAX_HEARTS = 5;
export const HEART_REFILL_XP_COST = 200;
export const HEART_REGEN_MINUTES = 30;

export const DAILY_GOAL_CONFIG: Record<
  DailyGoalTier,
  { minutes: number; xpTarget: number; labelKy: string; labelRu: string }
> = {
  casual: {
    minutes: 15,
    xpTarget: 50,
    labelKy: "Жеңил (15м / 50 XP)",
    labelRu: "Лёгкий (15м / 50 XP)",
  },
  serious: {
    minutes: 30,
    xpTarget: 100,
    labelKy: "Олуттуу (30м / 100 XP)",
    labelRu: "Серьёзный (30м / 100 XP)",
  },
  insane: {
    minutes: 60,
    xpTarget: 200,
    labelKy: "Күчтүү (60м / 200 XP)",
    labelRu: "Интенсивный (60м / 200 XP)",
  },
};

/** Box intervals in days: box 1 = 1 day, box 2 = 3 days, ... box 5 = 30 days */
export const SRS_BOX_INTERVALS_DAYS = [1, 3, 7, 14, 30];

export function getNextReviewDate(boxNumber: number): string {
  const days =
    SRS_BOX_INTERVALS_DAYS[Math.min(boxNumber - 1, SRS_BOX_INTERVALS_DAYS.length - 1)];
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function createSRSRecord(wordId: string): SRSRecord {
  const today = new Date().toISOString().split("T")[0];
  return {
    wordId,
    boxNumber: 1,
    nextReviewDate: today,
    lastReviewed: today,
  };
}

export function advanceSRS(record: SRSRecord): SRSRecord {
  const newBox = Math.min(5, record.boxNumber + 1);
  return {
    ...record,
    boxNumber: newBox,
    nextReviewDate: getNextReviewDate(newBox),
    lastReviewed: new Date().toISOString().split("T")[0],
  };
}

export function demoteSRS(record: SRSRecord): SRSRecord {
  return {
    ...record,
    boxNumber: 1,
    nextReviewDate: new Date().toISOString().split("T")[0],
    lastReviewed: new Date().toISOString().split("T")[0],
  };
}

export function countDueReviews(
  srsRecords: Record<string, SRSRecord>
): number {
  const today = new Date().toISOString().split("T")[0];
  return Object.values(srsRecords).filter((r) => r.nextReviewDate <= today)
    .length;
}

export function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export function calcRegeneratedHearts(
  hearts: number,
  lastHeartRegenAt: string
): { hearts: number; lastHeartRegenAt: string } {
  if (hearts >= MAX_HEARTS) {
    return { hearts, lastHeartRegenAt };
  }
  const elapsed = Date.now() - new Date(lastHeartRegenAt).getTime();
  const regenCount = Math.floor(elapsed / (HEART_REGEN_MINUTES * 60 * 1000));
  if (regenCount <= 0) return { hearts, lastHeartRegenAt };
  const newHearts = Math.min(MAX_HEARTS, hearts + regenCount);
  const newTimestamp = new Date(
    new Date(lastHeartRegenAt).getTime() +
      regenCount * HEART_REGEN_MINUTES * 60 * 1000
  ).toISOString();
  return { hearts: newHearts, lastHeartRegenAt: newTimestamp };
}

export const ACHIEVEMENTS = [
  {
    id: "golden-pen",
    titleKy: "Алтын калем",
    titleRu: "Золотое перо",
    descriptionKy: "100 сөз үйрөнүү",
    descriptionRu: "Выучить 100 слов",
    icon: "✒️",
    xpReward: 100,
    check: (s: AchievementState) => s.totalWordsLearned >= 100,
  },
  {
    id: "steadfast",
    titleKy: "Чыдамкай",
    titleRu: "Стойкий",
    descriptionKy: "7 күн катар серия",
    descriptionRu: "7-дневная серия",
    icon: "🔥",
    xpReward: 150,
    check: (s: AchievementState) => s.streak >= 7,
  },
  {
    id: "sniper",
    titleKy: "Снайпер",
    titleRu: "Снайпер",
    descriptionKy: "5 сабакты 100% туура",
    descriptionRu: "5 уроков на 100%",
    icon: "🎯",
    xpReward: 200,
    check: (s: AchievementState) => s.perfectQuizCount >= 5,
  },
] as const;

export interface AchievementState {
  totalWordsLearned: number;
  streak: number;
  perfectQuizCount: number;
}

export const MOCK_LEADERBOARD = [
  { id: "lb1", name: "Айгүл К.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aigul", weeklyXp: 1240, country: "🇰🇬" },
  { id: "lb2", name: "Max W.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=MaxW", weeklyXp: 1180, country: "🇩🇪" },
  { id: "lb3", name: "Светлана М.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Svetlana", weeklyXp: 1050, country: "🇷🇺" },
  { id: "lb4", name: "Nursultan B.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nurs", weeklyXp: 980, country: "🇰🇬" },
  { id: "lb5", name: "Emma L.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=EmmaL", weeklyXp: 920, country: "🇬🇧" },
  { id: "lb6", name: "Дмитрий П.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry", weeklyXp: 870, country: "🇷🇺" },
  { id: "lb7", name: "Aizada T.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aizada", weeklyXp: 810, country: "🇰🇬" },
  { id: "lb8", name: "Hans K.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=HansK", weeklyXp: 760, country: "🇩🇪" },
  { id: "lb9", name: "Olivia R.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia", weeklyXp: 700, country: "🇺🇸" },
];

export const PHONETIC_TIPS = [
  {
    id: "de-oe",
    targetLang: "de" as const,
    sound: "Ö",
    exampleWord: "Möbel",
    kyrgyzMapping: "Ө (Өрдөк)",
    titleKy: "Лайфхак: Немис 'Ö'",
    titleRu: "Лайфхак: Немецкое 'Ö'",
    bodyKy:
      "Немисче 'Ö' үнүн кыргызча 'Ө' сыяктуу айтыңыз — мисалы: Möbel = МЁ-бель, Өрдөк сыяктуу.",
    bodyRu:
      "Произносите немецкое 'Ö' как кыргызское 'Ө' — например: Möbel, как в слове Өрдөк.",
  },
  {
    id: "de-ue",
    targetLang: "de" as const,
    sound: "Ü",
    exampleWord: "Tschüss",
    kyrgyzMapping: "Ү (Үтүк)",
    titleKy: "Лайфхак: Немис 'Ü'",
    titleRu: "Лайфхак: Немецкое 'Ü'",
    bodyKy:
      "Немисче 'Ü' кыргызча 'Ү' менен бирдей — Tschüss (Чюс) = Үтүк сыяктуу тартып айтыңыз.",
    bodyRu:
      "Немецкое 'Ü' соответствует кыргызскому 'Ү' — Tschüss произносите как в слове Үтүк.",
  },
  {
    id: "en-th",
    targetLang: "en" as const,
    sound: "th",
    exampleWord: "think / three",
    kyrgyzMapping: "Тил + тиш",
    titleKy: "Лайфхак: Англис 'th'",
    titleRu: "Лайфхак: Английское 'th'",
    bodyKy:
      "'th' үнүн айтуу үчүн тилиңизди жеңил тиштериңиздин ортосуна койуңуз — think, three сыяктуу. Кыргызча 'т' менен 'с' ортосундагы үн.",
    bodyRu:
      "Для 'th' положите язык между зубами — как в think, three. Это звук между русскими 'т' и 'с'.",
  },
];
