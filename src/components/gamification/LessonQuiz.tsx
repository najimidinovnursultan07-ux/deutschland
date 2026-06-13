"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ListenButton } from "@/components/ui/ListenButton";
import { PhoneticTipCards } from "./PhoneticTipCards";
import { HeartsDisplay } from "./HeartsDisplay";
import { HeartsModal } from "./HeartsModal";
import { useAppStore } from "@/store/appStore";
import type { InterfaceLanguage, Lesson } from "@/types";

interface LessonQuizProps {
  lesson: Lesson;
  interfaceLang: InterfaceLanguage;
  targetLang: "de" | "en";
  onComplete: (perfect: boolean) => void;
  onCancel: () => void;
}

type Phase = "tips" | "quiz" | "done";

export function LessonQuiz({
  lesson,
  interfaceLang,
  targetLang,
  onComplete,
  onCancel,
}: LessonQuizProps) {
  const loseHeart = useAppStore((s) => s.loseHeart);
  const hearts = useAppStore((s) => s.hearts);
  const reviewSRSWord = useAppStore((s) => s.reviewSRSWord);
  const syncHearts = useAppStore((s) => s.syncHearts);

  const [phase, setPhase] = useState<Phase>("tips");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [showHeartsModal, setShowHeartsModal] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const questions = useMemo(() => {
    return lesson.vocabulary.map((card) => {
      const correct =
        interfaceLang === "ky" ? card.definitionKy : card.definitionRu;
      const distractors = lesson.vocabulary
        .filter((c) => c.id !== card.id)
        .map((c) =>
          interfaceLang === "ky" ? c.definitionKy : c.definitionRu
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const options = [correct, ...distractors].sort(
        () => Math.random() - 0.5
      );
      return { card, correct, options };
    });
  }, [lesson, interfaceLang]);

  const current = questions[questionIndex];

  const handleAnswer = (option: string) => {
    if (feedback) return;
    setSelected(option);
    const isCorrect = option === current.correct;

    if (isCorrect) {
      setFeedback("correct");
      reviewSRSWord(current.card.id, true);
    } else {
      setFeedback("wrong");
      setMistakes((m) => m + 1);
      reviewSRSWord(current.card.id, false);
      syncHearts();
      const stillHasHearts = loseHeart();
      if (!stillHasHearts) {
        setTimeout(() => setShowHeartsModal(true), 600);
        return;
      }
    }

    setTimeout(() => {
      if (questionIndex + 1 >= questions.length) {
        setPhase("done");
      } else {
        setQuestionIndex((i) => i + 1);
        setSelected(null);
        setFeedback(null);
      }
    }, 800);
  };

  if (showHeartsModal) {
    return (
      <HeartsModal
        interfaceLang={interfaceLang}
        onClose={() => {
          setShowHeartsModal(false);
          onCancel();
        }}
      />
    );
  }

  if (phase === "tips") {
    return (
      <div className="space-y-4">
        <PhoneticTipCards targetLang={targetLang} interfaceLang={interfaceLang} />
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onCancel}>
            {interfaceLang === "ky" ? "Артка" : "Назад"}
          </Button>
          <Button onClick={() => setPhase("quiz")}>
            {interfaceLang === "ky" ? "Тестти баштоо" : "Начать тест"}
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    const perfect = mistakes === 0;
    return (
      <GlassCard className="text-center">
        <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-emerald-400" />
        <h3 className="text-lg font-bold text-white">
          {interfaceLang === "ky" ? "Сабак бүттү!" : "Урок завершён!"}
        </h3>
        <p className="mt-1 text-sm text-white/60">
          {perfect
            ? interfaceLang === "ky"
              ? "100% туура! +30 XP"
              : "100% верно! +30 XP"
            : interfaceLang === "ky"
              ? `${mistakes} ката · +15 XP`
              : `${mistakes} ошибок · +15 XP`}
        </p>
        <Button className="mt-4" onClick={() => onComplete(perfect)}>
          {interfaceLang === "ky" ? "Улантуу" : "Продолжить"}
        </Button>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <HeartsDisplay />
        <span className="text-sm text-white/50">
          {questionIndex + 1} / {questions.length}
        </span>
      </div>

      <GlassCard>
        <p className="mb-2 text-xs text-white/50">
          {interfaceLang === "ky" ? "Туура котормону тандаңыз" : "Выберите перевод"}
        </p>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xl font-bold text-white">{current.card.term}</p>
          <ListenButton text={current.card.term} targetLang={targetLang} />
        </div>
        <p className="mt-1 text-xs text-violet-300">{current.card.readingGuide}</p>
      </GlassCard>

      <div className="grid gap-2 sm:grid-cols-2">
        {current.options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === current.correct;
          let style = "border-white/15 bg-white/5 hover:bg-white/10";
          if (feedback && isSelected && isCorrect) {
            style = "border-emerald-400/50 bg-emerald-500/20";
          } else if (feedback && isSelected && !isCorrect) {
            style = "border-red-400/50 bg-red-500/20";
          } else if (feedback && isCorrect) {
            style = "border-emerald-400/30 bg-emerald-500/10";
          }

          return (
            <button
              key={option}
              type="button"
              disabled={!!feedback || hearts <= 0}
              onClick={() => handleAnswer(option)}
              className={`rounded-xl border p-4 text-left text-sm font-medium text-white transition-all ${style}`}
            >
              <span className="flex items-center justify-between gap-2">
                {option}
                {feedback && isCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
                {feedback && isSelected && !isCorrect && (
                  <XCircle size={16} className="text-red-400" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
