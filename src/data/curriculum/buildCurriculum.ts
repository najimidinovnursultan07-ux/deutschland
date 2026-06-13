import { CEFR_LEVELS } from "@/lib/constants";
import {
  LESSON_CATALOG,
  LESSONS_PER_LEVEL,
  WORDS_PER_LESSON,
} from "./lessonCatalog";
import { getThemePool, resolveTheme } from "./lexicon";
import { applyVerifiedPair } from "./verifiedPairs";
import { buildSampleSentence } from "./sampleSentences";
import type { WordSeed } from "./wordSeed";
import type { CurriculumWord, LessonModule } from "@/types/curriculum";
import type { CEFRLevel, TargetLanguage } from "@/types";

function withLemma(seed: WordSeed, foreign: string): WordSeed {
  const lemma = seed.lemma ?? seed.foreign;
  return { ...seed, foreign, lemma };
}

const themeSlotCounters = new Map<string, number>();

function slotKey(level: CEFRLevel, theme: string, lang: TargetLanguage): string {
  return `${level}:${lang}:${resolveTheme(theme)}`;
}

function expandPool(pool: WordSeed[], lang: TargetLanguage): WordSeed[] {
  const expanded: WordSeed[] = [];
  for (const seed of pool) {
    expanded.push(seed);
    if (lang === "de") {
      if (seed.partOfSpeech === "noun") {
        expanded.push(withLemma(seed, `ein ${seed.foreign}`));
        expanded.push(withLemma(seed, `mit ${seed.foreign}`));
      } else if (seed.partOfSpeech === "adjective") {
        expanded.push(withLemma(seed, `sehr ${seed.foreign}`));
        expanded.push(withLemma(seed, `nicht ${seed.foreign}`));
      } else if (seed.partOfSpeech === "verb") {
        expanded.push(withLemma(seed, `ich ${seed.foreign}`));
      }
    } else {
      if (seed.partOfSpeech === "noun") {
        expanded.push(withLemma(seed, `a ${seed.foreign}`));
        expanded.push(withLemma(seed, `the ${seed.foreign}`));
      } else if (seed.partOfSpeech === "adjective") {
        expanded.push(withLemma(seed, `very ${seed.foreign}`));
        expanded.push(withLemma(seed, `not ${seed.foreign}`));
      } else if (seed.partOfSpeech === "verb") {
        expanded.push(withLemma(seed, `I ${seed.foreign}`));
      }
    }
  }
  return expanded;
}

function pickWords(
  pool: WordSeed[],
  level: CEFRLevel,
  theme: string,
  lang: TargetLanguage
): WordSeed[] {
  if (pool.length === 0) return [];

  const expanded = expandPool(pool, lang);
  const key = slotKey(level, theme, lang);
  const slot = themeSlotCounters.get(key) ?? 0;
  themeSlotCounters.set(key, slot + 1);

  const start = slot * WORDS_PER_LESSON;
  const picked: WordSeed[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < expanded.length && picked.length < WORDS_PER_LESSON; i++) {
    const word = expanded[(start + i) % expanded.length];
    if (seen.has(word.foreign)) continue;
    seen.add(word.foreign);
    picked.push(word);
  }

  return picked;
}

function toCurriculumWord(
  seed: WordSeed,
  level: CEFRLevel,
  lessonNumber: number,
  theme: string,
  lang: TargetLanguage,
  index: number
): CurriculumWord {
  const word = (seed.lemma ?? seed.foreign).trim();
  const sampleSentence = buildSampleSentence(seed, lang);

  return {
    id: `${level}-L${lessonNumber}-W${index + 1}-${lang}`,
    word,
    foreign: seed.foreign,
    translationKg: seed.translationKg,
    translationRu: seed.translationRu,
    theme,
    transcription: seed.pronunciation,
    pronunciation: seed.pronunciation,
    readingGuide: seed.readingGuide,
    partOfSpeech: seed.partOfSpeech,
    sampleSentence,
    exampleSentence: sampleSentence.foreign,
    imageKey: word.toLowerCase().replace(/\s+/g, "-"),
  };
}

function buildLesson(
  level: CEFRLevel,
  lessonNumber: number,
  targetLang: TargetLanguage
): LessonModule {
  const catalog = LESSON_CATALOG[level][lessonNumber - 1];
  const theme = catalog.theme;
  const pool = getThemePool(targetLang, theme);
  const seeds = pickWords(pool, level, theme, targetLang);

  const words = seeds.map((seed, i) =>
    toCurriculumWord(
      applyVerifiedPair(seed),
      level,
      lessonNumber,
      theme,
      targetLang,
      i
    )
  );

  const targetLabelKy = targetLang === "de" ? "немисче" : "англисче";
  const targetLabelRu = targetLang === "de" ? "немецком" : "английском";

  return {
    id: `${level}-lesson-${lessonNumber}-${targetLang}`,
    level,
    number: lessonNumber,
    theme,
    titleKy: `Сабак ${lessonNumber}: ${catalog.titleKy}`,
    titleRu: `Урок ${lessonNumber}: ${catalog.titleRu}`,
    descriptionKy: `${level} — ${catalog.titleKy} (${targetLabelKy})`,
    descriptionRu: `Уровень ${level} — ${catalog.titleRu} (на ${targetLabelRu})`,
    targetLang,
    words,
    estimatedMinutes: 12 + (lessonNumber % 4),
  };
}

function buildAll(): Record<TargetLanguage, Record<CEFRLevel, LessonModule[]>> {
  themeSlotCounters.clear();

  const result: Record<TargetLanguage, Record<CEFRLevel, LessonModule[]>> = {
    de: {} as Record<CEFRLevel, LessonModule[]>,
    en: {} as Record<CEFRLevel, LessonModule[]>,
  };

  for (const lang of ["de", "en"] as TargetLanguage[]) {
    for (const level of CEFR_LEVELS) {
      result[lang][level] = Array.from({ length: LESSONS_PER_LEVEL }, (_, i) =>
        buildLesson(level, i + 1, lang)
      );
    }
  }

  return result;
}

let cached: ReturnType<typeof buildAll> | null = null;

export function getCurriculumIndex(): ReturnType<typeof buildAll> {
  if (!cached) cached = buildAll();
  return cached;
}

export function getLessonModule(
  level: CEFRLevel,
  lessonNumber: number,
  targetLang: TargetLanguage
): LessonModule {
  return getCurriculumIndex()[targetLang][level][lessonNumber - 1];
}

export function getLessonModuleById(
  lessonId: string,
  targetLang: TargetLanguage
): LessonModule | undefined {
  const match = lessonId.match(/^([A-Z]\d)-lesson-(\d+)/);
  if (!match) return undefined;
  const level = match[1] as CEFRLevel;
  const number = parseInt(match[2], 10);
  if (number < 1 || number > LESSONS_PER_LEVEL) return undefined;
  return getLessonModule(level, number, targetLang);
}

export function getLevelVocabularyPool(
  level: CEFRLevel,
  targetLang: TargetLanguage
): CurriculumWord[] {
  const lessons = getCurriculumIndex()[targetLang][level];
  const seen = new Set<string>();
  const pool: CurriculumWord[] = [];
  for (const lesson of lessons) {
    for (const word of lesson.words) {
      if (seen.has(word.id)) continue;
      seen.add(word.id);
      pool.push(word);
    }
  }
  return pool;
}
