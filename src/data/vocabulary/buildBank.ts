import { LESSONS_PER_LEVEL, VOCAB_PER_LESSON } from "@/lib/constants";
import type { CEFRLevel, TargetLanguage } from "@/types";
import type { VocabEntry } from "./types";
import { GERMAN_TOPICS } from "./germanTopics";
import { ENGLISH_TOPICS } from "./englishTopics";
import { getWordsForLessonByTopic } from "./topicPools";

const WORDS_NEEDED = LESSONS_PER_LEVEL * VOCAB_PER_LESSON;

function flattenTopics(
  topics: Record<CEFRLevel, VocabEntry[]>
): Record<CEFRLevel, VocabEntry[]> {
  const result = {} as Record<CEFRLevel, VocabEntry[]>;

  for (const level of Object.keys(topics) as CEFRLevel[]) {
    const seen = new Set<string>();
    const unique: VocabEntry[] = [];

    for (const entry of topics[level]) {
      const key = entry.term.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push({ ...entry, level });
      }
    }

    result[level] = unique;
  }

  return result;
}

function expandWithPhrases(
  base: VocabEntry[],
  level: CEFRLevel,
  lang: TargetLanguage
): VocabEntry[] {
  if (base.length >= WORDS_NEEDED) return base.slice(0, WORDS_NEEDED);

  const expanded = [...base];
  const seen = new Set(base.map((w) => w.term.toLowerCase()));
  const nouns = base.filter((w) => w.partOfSpeech === "noun");
  const verbs = base.filter((w) => w.partOfSpeech === "verb");
  const adjs = base.filter((w) => w.partOfSpeech === "adjective");

  type PhraseBuilder = (n: VocabEntry, v: VocabEntry, a: VocabEntry) => string;

  const templates: PhraseBuilder[] =
    lang === "de"
      ? [
          (n) => `ein ${n.term}`,
          (n) => `die ${n.term}`,
          (n) => `der ${n.term}`,
          (n, v) => `${v.term} ${n.term}`,
          (n, _, a) => `${a.term} ${n.term}`,
          (n) => `mit ${n.term}`,
          (n) => `ohne ${n.term}`,
          (n) => `vom ${n.term}`,
        ]
      : [
          (n) => `a ${n.term}`,
          (n) => `the ${n.term}`,
          (n, v) => `to ${v.term} ${n.term}`,
          (n, _, a) => `${a.term} ${n.term}`,
          (n) => `with ${n.term}`,
          (n) => `without ${n.term}`,
          (n) => `from ${n.term}`,
        ];

  let round = 0;
  while (expanded.length < WORDS_NEEDED && round < 80) {
    for (let i = 0; i < nouns.length && expanded.length < WORDS_NEEDED; i++) {
      const noun = nouns[i];
      const verb = verbs[i % Math.max(verbs.length, 1)] ?? noun;
      const adj = adjs[i % Math.max(adjs.length, 1)] ?? noun;
      for (const tmpl of templates) {
        const term = tmpl(noun, verb, adj);
        const key = term.toLowerCase();
        if (!seen.has(key) && term !== noun.term) {
          seen.add(key);
          expanded.push({
            term,
            pronunciation: noun.pronunciation,
            readingGuide: noun.readingGuide,
            definitionKy: noun.definitionKy,
            definitionRu: noun.definitionRu,
            partOfSpeech: "phrase",
            exampleSentence:
              lang === "de" ? `Das ist ${term}.` : `This is ${term}.`,
            level,
          });
          if (expanded.length >= WORDS_NEEDED) break;
        }
      }
    }
    round++;
  }

  return expanded.slice(0, WORDS_NEEDED);
}

const germanBanks = flattenTopics(GERMAN_TOPICS);
const englishBanks = flattenTopics(ENGLISH_TOPICS);

const banks: Record<TargetLanguage, Record<CEFRLevel, VocabEntry[]>> = {
  de: {} as Record<CEFRLevel, VocabEntry[]>,
  en: {} as Record<CEFRLevel, VocabEntry[]>,
};

for (const level of Object.keys(germanBanks) as CEFRLevel[]) {
  banks.de[level] = expandWithPhrases(germanBanks[level], level, "de");
  banks.en[level] = expandWithPhrases(englishBanks[level], level, "en");
}

export function getWordBank(
  level: CEFRLevel,
  targetLang: TargetLanguage
): VocabEntry[] {
  return banks[targetLang][level];
}

export function getWordsForLesson(
  level: CEFRLevel,
  lessonNumber: number,
  targetLang: TargetLanguage
): VocabEntry[] {
  const topicWords = getWordsForLessonByTopic(lessonNumber, targetLang, level);
  if (topicWords.length >= VOCAB_PER_LESSON) {
    return topicWords;
  }
  const bank = getWordBank(level, targetLang);
  const start = (lessonNumber - 1) * VOCAB_PER_LESSON;
  return bank.slice(start, start + VOCAB_PER_LESSON);
}

export function getAllWordsForLang(targetLang: TargetLanguage): VocabEntry[] {
  const all: VocabEntry[] = [];
  const seen = new Set<string>();

  for (const level of Object.keys(banks[targetLang]) as CEFRLevel[]) {
    for (const entry of banks[targetLang][level]) {
      const key = entry.term.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        all.push(entry);
      }
    }
  }

  return all.sort((a, b) => a.term.localeCompare(b.term));
}
