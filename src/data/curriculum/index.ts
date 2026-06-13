export {
  LESSONS_PER_LEVEL,
  WORDS_PER_LESSON,
  LEVEL_CATALOG,
  LESSON_CATALOG,
} from "./lessonCatalog";

export {
  getCurriculumIndex,
  getLessonModule,
  getLessonModuleById,
  getLevelVocabularyPool,
} from "./buildCurriculum";

export { auditTranslation, applyVerifiedPair } from "./verifiedPairs";

import { TARGET_LOCALES } from "@/lib/constants";
import { getWordImageUrl } from "@/lib/wordImages";
import type { Lesson, VocabularyCard, CEFRLevel, TargetLanguage } from "@/types";
import type { CurriculumWord, LessonModule } from "@/types/curriculum";
import {
  getCurriculumIndex,
  getLessonModuleById,
} from "./buildCurriculum";
import { LESSONS_PER_LEVEL } from "./lessonCatalog";
import { CEFR_LEVELS } from "@/lib/constants";

export function toVocabularyCard(
  word: CurriculumWord,
  targetLang: TargetLanguage,
  level: CEFRLevel
): VocabularyCard {
  return {
    id: word.id,
    word: word.word,
    term: word.foreign,
    transcription: word.transcription,
    pronunciation: word.pronunciation,
    readingGuide: word.readingGuide,
    translationKy: word.translationKg,
    translationRu: word.translationRu,
    definitionKy: word.translationKg,
    definitionRu: word.translationRu,
    sampleSentence: word.sampleSentence,
    exampleSentence: word.sampleSentence.foreign,
    partOfSpeech: word.partOfSpeech,
    level,
    targetLang,
    audioLocale: TARGET_LOCALES[targetLang],
    imageUrl: getWordImageUrl(word.word),
  };
}

export function toLesson(lessonModule: LessonModule): Lesson {
  return {
    id: lessonModule.id,
    level: lessonModule.level,
    number: lessonModule.number,
    title: lessonModule.titleKy,
    titleKy: lessonModule.titleKy,
    titleRu: lessonModule.titleRu,
    description: lessonModule.descriptionKy,
    descriptionKy: lessonModule.descriptionKy,
    descriptionRu: lessonModule.descriptionRu,
    vocabulary: lessonModule.words.map((w) =>
      toVocabularyCard(w, lessonModule.targetLang, lessonModule.level)
    ),
    estimatedMinutes: lessonModule.estimatedMinutes,
  };
}

export function getLessonsForLevel(
  level: CEFRLevel,
  targetLang: TargetLanguage
): Lesson[] {
  return getCurriculumIndex()[targetLang][level].map(toLesson);
}

export function getLessonById(
  lessonId: string,
  targetLang: TargetLanguage
): Lesson | undefined {
  const lessonModule = getLessonModuleById(lessonId, targetLang);
  return lessonModule ? toLesson(lessonModule) : undefined;
}

export function getAllDictionaryWords(targetLang: TargetLanguage) {
  const seen = new Set<string>();
  const out: ReturnType<typeof toVocabularyCard>[] = [];

  for (const level of CEFR_LEVELS) {
    for (const lessonModule of getCurriculumIndex()[targetLang][level]) {
      for (const word of lessonModule.words) {
        if (seen.has(word.foreign)) continue;
        seen.add(word.foreign);
        out.push(toVocabularyCard(word, targetLang, level));
      }
    }
  }

  return out;
}

export function createInitialLevelProgress(): Record<
  CEFRLevel,
  import("@/types").LevelProgress
> {
  return CEFR_LEVELS.reduce(
    (acc, level) => {
      acc[level] = {
        level,
        completedLessons: 0,
        totalLessons: LESSONS_PER_LEVEL,
        wordsLearned: 0,
      };
      return acc;
    },
    {} as Record<CEFRLevel, import("@/types").LevelProgress>
  );
}

export function isLessonUnlocked(
  level: CEFRLevel,
  lessonNumber: number,
  passedQuizLessonIds: string[],
  targetLang: TargetLanguage
): boolean {
  if (lessonNumber === 1) return true;
  const prevId = `${level}-lesson-${lessonNumber - 1}-${targetLang}`;
  return passedQuizLessonIds.includes(prevId);
}
