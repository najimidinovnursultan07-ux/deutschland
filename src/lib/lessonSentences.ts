import type { Lesson, VocabularyCard } from "@/types";
import type { SentenceExercise, SpeakingExercise } from "@/types/lessonWorkflow";

/** Split by spaces — works for single-word chips and multi-word sentences */
export function parseCorrectChips(correctAnswer: string): string[] {
  return correctAnswer
    .trim()
    .replace(/[.!?;:]+$/, "")
    .split(/\s+/)
    .filter(Boolean);
}

type SentenceExerciseMode = "word" | "sentence";

function buildWordExercise(card: VocabularyCard): SentenceExercise {
  const correctAnswer = card.word.trim();
  const tokens = parseCorrectChips(correctAnswer);

  return {
    id: `sent-${card.id}-word`,
    wordId: card.id,
    promptKy: card.translationKy,
    promptRu: card.translationRu,
    correctAnswer,
    tokens,
    fullForeign: correctAnswer,
  };
}

function buildSentenceExercise(card: VocabularyCard): SentenceExercise {
  const { sampleSentence } = card;
  const correctAnswer = sampleSentence.foreign.trim();
  const tokens = parseCorrectChips(correctAnswer);

  return {
    id: `sent-${card.id}`,
    wordId: card.id,
    promptKy: sampleSentence.nativeKy,
    promptRu: sampleSentence.nativeRu,
    correctAnswer,
    tokens,
    fullForeign: correctAnswer,
  };
}

function buildExercise(
  card: VocabularyCard,
  mode: SentenceExerciseMode
): SentenceExercise {
  return mode === "word"
    ? buildWordExercise(card)
    : buildSentenceExercise(card);
}

export function buildSentenceExercises(
  lesson: Lesson,
  count = 5
): SentenceExercise[] {
  const pool = [...lesson.vocabulary].sort(() => Math.random() - 0.5);

  return pool.slice(0, Math.min(count, pool.length)).map((card, i) => {
    const lemma = card.word.trim();
    const isMultiWordLemma = parseCorrectChips(lemma).length > 1;
    const mode: SentenceExerciseMode =
      isMultiWordLemma ? "sentence" : i % 2 === 0 ? "word" : "sentence";
    return buildExercise(card, mode);
  });
}

export function buildSpeakingExercises(
  sentences: SentenceExercise[],
  count = 4
): SpeakingExercise[] {
  return sentences.slice(0, count).map((s) => ({
    id: `speak-${s.id}`,
    promptKy: s.promptKy,
    promptRu: s.promptRu,
    expectedForeign: s.correctAnswer.replace(/[.!?]+$/, ""),
  }));
}

export function getDistractorChips(
  exercise: SentenceExercise,
  allExercises: SentenceExercise[],
  extra = 3
): string[] {
  const correct = new Set(parseCorrectChips(exercise.correctAnswer));
  const pool = allExercises
    .flatMap((e) => parseCorrectChips(e.correctAnswer))
    .filter((t) => !correct.has(t));
  const unique = Array.from(new Set(pool)).sort(() => Math.random() - 0.5);
  return unique.slice(0, extra);
}

export function normalizeSpeech(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function speechMatches(expected: string, spoken: string): boolean {
  const a = normalizeSpeech(expected);
  const b = normalizeSpeech(spoken);
  if (a === b) return true;
  if (b.includes(a) || a.includes(b)) return true;
  const aWords = a.split(" ");
  const bWords = b.split(" ");
  const overlap = aWords.filter((w) => bWords.includes(w)).length;
  return overlap >= Math.ceil(aWords.length * 0.75);
}
