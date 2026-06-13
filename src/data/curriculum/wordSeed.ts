import type { SampleSentence } from "@/types/vocabulary";

export interface WordSeed {
  foreign: string;
  /** Canonical lemma when foreign is an expanded phrase (e.g. "Zahl drei" → "drei") */
  lemma?: string;
  pronunciation: string;
  readingGuide: string;
  translationKg: string;
  translationRu: string;
  partOfSpeech: string;
  /** Optional hand-authored sample sentence override */
  sampleSentence?: SampleSentence;
}
