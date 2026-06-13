import type { CEFRLevel } from "@/types";

export interface VocabEntry {
  term: string;
  pronunciation: string;
  readingGuide: string;
  definitionKy: string;
  definitionRu: string;
  partOfSpeech: string;
  exampleSentence?: string;
  level: CEFRLevel;
}
