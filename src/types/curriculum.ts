import type { CEFRLevel, TargetLanguage } from "./index";
import type { SampleSentence } from "./vocabulary";

/** Core vocabulary model — single source of truth for the data layer */
export interface CurriculumWord {
  id: string;
  /** Canonical lemma for dictionary / single-word drills */
  word: string;
  /** Lesson display form (may be a phrase variant, e.g. "Zahl drei") */
  foreign: string;
  translationKg: string;
  translationRu: string;
  theme: string;
  transcription: string;
  /** @deprecated use transcription */
  pronunciation: string;
  readingGuide: string;
  partOfSpeech?: string;
  sampleSentence: SampleSentence;
  exampleSentence?: string;
  imageKey?: string;
}

/** One of exactly 50 lesson modules per CEFR level */
export interface LessonModule {
  id: string;
  level: CEFRLevel;
  number: number;
  theme: string;
  titleKy: string;
  titleRu: string;
  descriptionKy: string;
  descriptionRu: string;
  targetLang: TargetLanguage;
  words: CurriculumWord[];
  estimatedMinutes: number;
}

export interface LevelCatalogEntry {
  level: CEFRLevel;
  labelKy: string;
  labelRu: string;
  subtitleKy: string;
  subtitleRu: string;
}
