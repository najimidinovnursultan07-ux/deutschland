"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ListenButton } from "@/components/ui/ListenButton";
import { HeartsDisplay } from "./HeartsDisplay";
import { HeartsModal } from "./HeartsModal";
import { ConfettiOverlay } from "./ConfettiOverlay";
import { getUiString } from "@/lib/constants";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import {
  getWordEmoji,
  getWordImageUrl,
  hasVisualImage,
} from "@/lib/wordImages";
import { getLevelVocabularyPool, toVocabularyCard } from "@/data/curriculum";
import { useAppStore } from "@/store/appStore";
import type { Lesson, VocabularyCard } from "@/types";
import { cn } from "@/lib/utils";

const QUIZ_QUESTION_COUNT = 5;

interface VisualLessonQuizProps {
  lesson: Lesson;
  targetLang: "de" | "en";
}

interface QuizOption {
  card: VocabularyCard;
  label: string;
  imageUrl: string | null;
  emoji: string;
}

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

function buildVisualQuestion(
  card: VocabularyCard,
  lessonPool: VocabularyCard[],
  levelPool: VocabularyCard[],
  interfaceLang: "ky" | "ru"
): {
  prompt: VocabularyCard;
  options: QuizOption[];
  correctId: string;
} {
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
    prompt: card,
    options,
    correctId: card.id,
  };
}

export function VisualLessonQuiz({ lesson, targetLang }: VisualLessonQuizProps) {
  const router = useRouter();
  const interfaceLang = useInterfaceLang();
  const loseHeart = useAppStore((s) => s.loseHeart);
  const hearts = useAppStore((s) => s.hearts);
  const reviewSRSWord = useAppStore((s) => s.reviewSRSWord);
  const passLessonQuiz = useAppStore((s) => s.passLessonQuiz);
  const syncHearts = useAppStore((s) => s.syncHearts);

  const questions = useMemo(() => {
    const lessonPool = lesson.vocabulary;
    const levelWords = getLevelVocabularyPool(lesson.level, targetLang);
    const levelPool = levelWords.map((w) =>
      toVocabularyCard(w, targetLang, lesson.level)
    );
    const shuffled = [...lessonPool].sort(() => Math.random() - 0.5);
    const count = Math.min(QUIZ_QUESTION_COUNT, lessonPool.length);
    return shuffled
      .slice(0, count)
      .map((card) =>
        buildVisualQuestion(card, lessonPool, levelPool, interfaceLang)
      );
  }, [lesson, interfaceLang, targetLang]);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showHeartsModal, setShowHeartsModal] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const current = questions[questionIndex];

  const handleSelect = (optionId: string) => {
    if (feedback) return;
    setSelectedId(optionId);
    const isCorrect = optionId === current.correctId;

    if (isCorrect) {
      setFeedback("correct");
      reviewSRSWord(current.prompt.id, true);
    } else {
      setFeedback("wrong");
      setMistakes((m) => m + 1);
      reviewSRSWord(current.prompt.id, false);
      syncHearts();
      if (!loseHeart()) {
        setTimeout(() => setShowHeartsModal(true), 500);
        return;
      }
    }

    setTimeout(() => {
      if (questionIndex + 1 >= questions.length) {
        const totalMistakes = isCorrect ? mistakes : mistakes + 1;
        const perfect = totalMistakes === 0;
        passLessonQuiz(
          lesson.id,
          lesson.level,
          lesson.vocabulary.map((v) => v.id),
          perfect
        );
        setCompleted(true);
        setShowConfetti(true);
      } else {
        setQuestionIndex((i) => i + 1);
        setSelectedId(null);
        setFeedback(null);
      }
    }, 900);
  };

  const handleFinish = () => {
    router.push("/?completed=1");
  };

  if (showHeartsModal) {
    return (
      <HeartsModal
        onClose={() => router.push(`/lessons/${encodeURIComponent(lesson.id)}`)}
      />
    );
  }

  if (completed) {
    return (
      <>
        <ConfettiOverlay active={showConfetti} />
        <GlassCard className="mx-auto max-w-md border-emerald-400/30 bg-slate-950/60 text-center backdrop-blur-xl animate-slide-up">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white">
            {getUiString(interfaceLang, "lessonComplete")}
          </h2>
          <p className="mt-2 text-violet-200">
            {getUiString(interfaceLang, "completionXp")}
          </p>
          <Button className="mt-6 w-full" size="lg" onClick={handleFinish}>
            {getUiString(interfaceLang, "returnHome")}
          </Button>
        </GlassCard>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <HeartsDisplay />
        <span className="text-sm text-white/50">
          {getUiString(interfaceLang, "quizProgress")}: {questionIndex + 1}/
          {questions.length}
        </span>
      </div>

      <GlassCard className="border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <p className="mb-1 text-xs uppercase tracking-wide text-violet-300">
          {getUiString(interfaceLang, "selectTranslation")}
        </p>
        <div className="flex items-center justify-between gap-3">
          <p className="text-2xl font-bold tracking-tight text-white">
            {current.prompt.term}
          </p>
          <ListenButton text={current.prompt.term} targetLang={targetLang} />
        </div>
        <p className="mt-1 text-xs text-violet-300">
          {current.prompt.readingGuide}
        </p>
      </GlassCard>

      <div className="grid grid-cols-2 gap-3">
        {current.options.map((option) => {
          const isSelected = selectedId === option.card.id;
          const isCorrect = option.card.id === current.correctId;

          return (
            <button
              key={option.card.id}
              type="button"
              disabled={!!feedback || hearts <= 0}
              onClick={() => handleSelect(option.card.id)}
              className={cn(
                "overflow-hidden rounded-2xl border text-left transition-all",
                "border-white/15 bg-white/5 hover:bg-white/10",
                feedback && isSelected && isCorrect && "border-emerald-400/60 bg-emerald-500/20",
                feedback && isSelected && !isCorrect && "border-red-400/60 bg-red-500/20",
                feedback && !isSelected && isCorrect && "border-emerald-400/30"
              )}
            >
              {option.imageUrl ? (
                <div className="relative aspect-[4/3] w-full bg-white/5">
                  <Image
                    src={option.imageUrl}
                    alt={option.label}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-white/5 text-5xl">
                  {option.emoji}
                </div>
              )}
              <div className="flex items-center justify-between gap-2 p-3">
                <span className="text-sm font-medium text-white">
                  {option.label}
                </span>
                {feedback && isCorrect && (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                )}
                {feedback && isSelected && !isCorrect && (
                  <XCircle size={16} className="text-red-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
