export type BaseLanguage = "ky" | "ru";
export type TargetLanguage = "de" | "en";
export type LanguagePair = `${BaseLanguage}-${TargetLanguage}`;
export type CEFRLevel = "A0" | "A1" | "A2" | "B1" | "B2" | "C1";
export type Theme = "dark" | "light";
export type InterfaceLanguage = "ky" | "ru";
export type AppPage = "home" | "dictionary" | "profile" | "settings" | "leaderboard";
export type DailyGoalTier = "casual" | "serious" | "insane";

export type UserRole = "USER" | "MODERATOR" | "ADMIN";

/** Public user row for admin directory (no password) */
export interface DirectoryUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserSuggestion {
  id: string;
  userId: string;
  userEmail: string;
  text: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  password: string;
  targetLanguage: TargetLanguage;
  createdAt: string;
  /** Hidden from settings UI — managed in admin panel only */
  role: UserRole;
}

/** Legacy UI/dictionary shape — curriculum source uses `CurriculumWord` */
export interface Word {
  id: string;
  term: string;
  /** IPA / phonetic string */
  transcription?: string;
  pronunciation: string;
  readingGuide: string;
  definitionKy: string;
  definitionRu: string;
  exampleSentence?: string;
  partOfSpeech?: string;
  level: CEFRLevel;
  targetLang: TargetLanguage;
}

export type { CurriculumWord, LessonModule } from "./curriculum";
export type { VocabularyItem, SampleSentence } from "./vocabulary";
export type { FeedbackState } from "./feedback";
export { INITIAL_FEEDBACK, createFeedback } from "./feedback";
export type {
  LessonStage,
  QuizQuestion,
  QuizOption,
  SentenceExercise,
  SpeakingExercise,
  LessonSessionState,
  LessonWorkflowData,
} from "./lessonWorkflow";

export interface VocabularyCard extends Word {
  /** Canonical foreign lemma — use for single-word Stage 3 drills */
  word: string;
  translationKy: string;
  translationRu: string;
  sampleSentence: import("./vocabulary").SampleSentence;
  audioLocale: string;
  imageUrl?: string | null;
}

export interface Lesson {
  id: string;
  level: CEFRLevel;
  number: number;
  title: string;
  titleKy: string;
  titleRu: string;
  description: string;
  descriptionKy: string;
  descriptionRu: string;
  vocabulary: VocabularyCard[];
  estimatedMinutes: number;
}

export interface LevelProgress {
  level: CEFRLevel;
  completedLessons: number;
  totalLessons: number;
  wordsLearned: number;
}

export interface AppSettings {
  dailyReminders: boolean;
  achievementSounds: boolean;
  systemNotifications: boolean;
  theme: Theme;
  interfaceLanguage: InterfaceLanguage;
}

export interface SRSRecord {
  wordId: string;
  boxNumber: number;
  nextReviewDate: string;
  lastReviewed: string;
}

export interface Achievement {
  id: string;
  titleKy: string;
  titleRu: string;
  descriptionKy: string;
  descriptionRu: string;
  icon: string;
  xpReward: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatarUrl: string;
  weeklyXp: number;
  country: string;
  isCurrentUser?: boolean;
}

export interface AppState {
  languagePair: LanguagePair;
  selectedLevel: CEFRLevel;
  settings: AppSettings;
  streak: number;
  lastStudyDate: string | null;
  totalWordsLearned: number;
  recentLessonIds: string[];
  levelProgress: Record<CEFRLevel, LevelProgress>;
  completedLessonIds: string[];
  passedQuizLessonIds: string[];
  perfectQuizCount: number;
  xp: number;
  dailyXp: number;
  dailyXpDate: string;
  dailyGoalTier: DailyGoalTier;
  hearts: number;
  lastHeartRegenAt: string;
  srsRecords: Record<string, SRSRecord>;
  unlockedAchievements: string[];
  pendingAchievement: string | null;
  activeLessonSession: import("./lessonWorkflow").LessonSessionState | null;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends AuthCredentials {
  name: string;
  targetLanguage: TargetLanguage;
}

export interface ProfileUpdateData {
  name?: string;
  avatarUrl?: string;
  password?: string;
  targetLanguage?: TargetLanguage;
}

export interface PhoneticTip {
  id: string;
  targetLang: TargetLanguage;
  sound: string;
  exampleWord: string;
  kyrgyzMapping: string;
  titleKy: string;
  titleRu: string;
  bodyKy: string;
  bodyRu: string;
}
