import type { CEFRLevel, TargetLanguage } from "./index";

/** Contextual sentence pair for Stage 3 (builder) and Stage 4 (speaking) */
export interface SampleSentence {
  foreign: string;
  nativeKy: string;
  nativeRu: string;
}

/**
 * Canonical vocabulary record — single-word translation + full sample sentence.
 * UI layers may alias fields (term, definitionKy) for backward compatibility.
 */
export interface VocabularyItem {
  id: string;
  /** Canonical foreign lemma (e.g. "drei", "eins", "Ambivalenz") */
  word: string;
  transcription: string;
  readingGuide: string;
  translationKy: string;
  translationRu: string;
  level: CEFRLevel;
  targetLang: TargetLanguage;
  partOfSpeech?: string;
  sampleSentence: SampleSentence;
}
