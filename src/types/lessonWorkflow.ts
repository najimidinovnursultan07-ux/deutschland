import type { CEFRLevel, TargetLanguage, VocabularyCard } from "./index";

export type LessonStage = 1 | 2 | 3 | 4 | 5;

export interface QuizQuestion {
  id: string;
  prompt: VocabularyCard;
  options: QuizOption[];
  correctId: string;
}

export interface QuizOption {
  card: VocabularyCard;
  label: string;
  imageUrl: string | null;
  emoji: string;
}

export interface SentenceExercise {
  id: string;
  wordId: string;
  promptKy: string;
  promptRu: string;
  /** Canonical foreign answer — single word or full sentence */
  correctAnswer: string;
  /** Derived chip sequence; prefer parseCorrectChips(correctAnswer) at runtime */
  tokens: string[];
  fullForeign: string;
}

export interface SpeakingExercise {
  id: string;
  promptKy: string;
  promptRu: string;
  expectedForeign: string;
}

export interface LessonSessionState {
  stage: LessonStage;
  vocabIndex: number;
  stage2Index: number;
  stage3Index: number;
  stage4Index: number;
  stage5Index: number;
  speakingBonusAwarded: boolean;
  startedAt: number;
}

export interface LessonWorkflowData {
  lessonId: string;
  level: CEFRLevel;
  targetLang: TargetLanguage;
  vocabulary: VocabularyCard[];
  stage2Questions: QuizQuestion[];
  sentenceExercises: SentenceExercise[];
  speakingExercises: SpeakingExercise[];
  finalQuestions: QuizQuestion[];
}
