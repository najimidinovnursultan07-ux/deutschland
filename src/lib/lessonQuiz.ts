import { getLevelVocabularyPool, toVocabularyCard } from "@/data/curriculum";
import {
  getWordEmoji,
  getWordImageUrl,
  hasVisualImage,
} from "@/lib/wordImages";
import type { Lesson, VocabularyCard } from "@/types";
import type { QuizOption, QuizQuestion } from "@/types/lessonWorkflow";
import type { TargetLanguage } from "@/types";

function uniqueByTranslation(
  cards: VocabularyCard[],
  interfaceLang: "ky" | "ru"
): VocabularyCard[] {
  const seen = new Set<string>();
  const out: VocabularyCard[] = [];
  for (const card of cards) {
    const label =
      interfaceLang === "ky" ? card.definitionKy : card.definitionRu;
    if (seen.has(label)) continue;
    seen.add(label);
    out.push(card);
  }
  return out;
}

export function buildQuizQuestion(
  card: VocabularyCard,
  lessonPool: VocabularyCard[],
  levelPool: VocabularyCard[],
  interfaceLang: "ky" | "ru"
): QuizQuestion {
  const correctLabel =
    interfaceLang === "ky" ? card.definitionKy : card.definitionRu;

  const distractorSource = uniqueByTranslation(
    [...levelPool, ...lessonPool].filter((c) => c.id !== card.id),
    interfaceLang
  )
    .filter(
      (c) =>
        (interfaceLang === "ky" ? c.definitionKy : c.definitionRu) !==
        correctLabel
    )
    .sort(() => Math.random() - 0.5);

  const distractors = distractorSource.slice(0, 3);

  const options: QuizOption[] = uniqueByTranslation(
    [card, ...distractors],
    interfaceLang
  )
    .slice(0, 4)
    .sort(() => Math.random() - 0.5)
    .map((c) => ({
      card: c,
      label: interfaceLang === "ky" ? c.definitionKy : c.definitionRu,
      imageUrl: hasVisualImage(c.term) ? getWordImageUrl(c.term) : null,
      emoji: getWordEmoji(c.term),
    }));

  return {
    id: `q-${card.id}`,
    prompt: card,
    options,
    correctId: card.id,
  };
}

export function getQuizCorrectAnswerLabel(
  question: QuizQuestion,
  interfaceLang: "ky" | "ru"
): string {
  const correct = question.options.find(
    (o) => o.card.id === question.correctId
  );
  if (correct) return correct.label;
  return interfaceLang === "ky"
    ? question.prompt.definitionKy
    : question.prompt.definitionRu;
}

export function buildLessonQuizQuestions(
  lesson: Lesson,
  targetLang: TargetLanguage,
  interfaceLang: "ky" | "ru",
  count: number
): QuizQuestion[] {
  const lessonPool = lesson.vocabulary;
  const levelWords = getLevelVocabularyPool(lesson.level, targetLang);
  const levelPool: VocabularyCard[] = levelWords.map((w) =>
    toVocabularyCard(w, targetLang, lesson.level)
  );

  const shuffled = [...lessonPool].sort(() => Math.random() - 0.5);
  return shuffled
    .slice(0, Math.min(count, lessonPool.length))
    .map((card) =>
      buildQuizQuestion(card, lessonPool, levelPool, interfaceLang)
    );
}
