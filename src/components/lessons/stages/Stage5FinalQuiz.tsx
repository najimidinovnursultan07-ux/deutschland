"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ListenButton } from "@/components/ui/ListenButton";
import { ConfettiOverlay } from "@/components/gamification/ConfettiOverlay";
import { HeartsModal } from "@/components/gamification/HeartsModal";
import { AnswerFeedbackBanner } from "@/components/lessons/AnswerFeedbackBanner";
import { getUiString } from "@/lib/constants";
import { getQuizCorrectAnswerLabel } from "@/lib/lessonQuiz";
import {
  playCorrectSound,
  playHeartLostSound,
  playWrongSound,
} from "@/lib/sounds";
import { useAppStore } from "@/store/appStore";
import type { QuizQuestion } from "@/types";
import type { TargetLanguage } from "@/types";
import {
  INITIAL_FEEDBACK,
  createFeedback,
  type FeedbackState,
} from "@/types/feedback";
import { cn } from "@/lib/utils";

const FINAL_HEARTS = 3;

interface Stage5FinalQuizProps {
  questions: QuizQuestion[];
  index: number;
  interfaceLang: "ky" | "ru";
  targetLang: TargetLanguage;
  soundsEnabled: boolean;
  startedAt: number;
  onIndexChange: (next: number) => void;
  onComplete: (perfect: boolean) => void;
  embedded?: boolean;
}

export function Stage5FinalQuiz({
  questions,
  index,
  interfaceLang,
  targetLang,
  soundsEnabled,
  startedAt,
  onIndexChange,
  onComplete,
  embedded = false,
}: Stage5FinalQuizProps) {
  const router = useRouter();
  const reviewSRSWord = useAppStore((s) => s.reviewSRSWord);

  const [hearts, setHearts] = useState(FINAL_HEARTS);
  const [mistakes, setMistakes] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(INITIAL_FEEDBACK);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHeartsModal, setShowHeartsModal] = useState(false);

  const current = questions[index];
  const correctAnswerText = getQuizCorrectAnswerLabel(current, interfaceLang);
  const isLocked = feedback.isChecked;

  useEffect(() => {
    setSelectedId(null);
    setFeedback(INITIAL_FEEDBACK);
  }, [index, current.id]);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  const handleSelect = (optionId: string) => {
    if (isLocked || hearts <= 0) return;
    setSelectedId(optionId);
    const isCorrect = optionId === current.correctId;
    setFeedback(createFeedback(isCorrect, correctAnswerText));

    if (isCorrect) {
      playCorrectSound(soundsEnabled);
      reviewSRSWord(current.prompt.id, true);
    } else {
      setMistakes((m) => m + 1);
      playWrongSound(soundsEnabled);
      playHeartLostSound(soundsEnabled);
      reviewSRSWord(current.prompt.id, false);
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      if (nextHearts <= 0) {
        setTimeout(() => setShowHeartsModal(true), 3200);
        return;
      }
    }

    const advanceDelay = isCorrect ? 900 : 2800;
    setTimeout(() => {
      if (index + 1 >= questions.length) {
        const totalMistakes = isCorrect ? mistakes : mistakes + 1;
        setFinished(true);
        setShowConfetti(true);
        onComplete(totalMistakes === 0);
      } else {
        onIndexChange(index + 1);
      }
    }, advanceDelay);
  };

  if (showHeartsModal) {
    return (
      <HeartsModal
        onClose={() => router.push("/")}
      />
    );
  }

  if (finished) {
    const completionBlock = (
      <>
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-400" />
        <h2 className="text-2xl font-bold text-white">
          {getUiString(interfaceLang, "lessonComplete")}
        </h2>
        <p className="mt-2 text-violet-200">
          {getUiString(interfaceLang, "completionXp")}
        </p>
        <p className="mt-1 text-sm text-white/50">
          <Clock size={14} className="mr-1 inline" />
          {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}
        </p>
        <Button
          className="mt-6 w-full"
          size="lg"
          onClick={() => router.push("/?completed=1")}
        >
          {getUiString(interfaceLang, "returnHome")}
        </Button>
      </>
    );

    return (
      <>
        <ConfettiOverlay active={showConfetti} />
        {embedded ? (
          <div className="w-full text-center">{completionBlock}</div>
        ) : (
          <GlassCard className="w-full border-emerald-400/30 bg-slate-950/60 p-4 text-center backdrop-blur-xl md:p-6">
            {completionBlock}
          </GlassCard>
        )}
      </>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-5">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1">
          {Array.from({ length: FINAL_HEARTS }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "text-lg transition-opacity",
                i < hearts ? "opacity-100" : "opacity-20"
              )}
            >
              ❤️
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm text-white/50">
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")}
          </span>
          <span>
            {index + 1}/{questions.length}
          </span>
        </div>
      </div>

      {embedded ? (
        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-violet-300">
            {getUiString(interfaceLang, "stage5Hint")}
          </p>
          <div className="flex min-w-0 items-center justify-between gap-3">
            <p className="min-w-0 flex-1 break-words text-xl font-bold text-white sm:text-2xl">
              {current.prompt.term}
            </p>
            <ListenButton text={current.prompt.term} targetLang={targetLang} />
          </div>
        </div>
      ) : (
        <GlassCard className="w-full border-white/10 bg-slate-950/50 p-4 backdrop-blur-xl md:p-6">
          <p className="mb-1 text-xs uppercase tracking-wide text-violet-300">
            {getUiString(interfaceLang, "stage5Hint")}
          </p>
          <div className="flex min-w-0 items-center justify-between gap-3">
            <p className="min-w-0 flex-1 break-words text-xl font-bold text-white sm:text-2xl">
              {current.prompt.term}
            </p>
            <ListenButton text={current.prompt.term} targetLang={targetLang} />
          </div>
        </GlassCard>
      )}

      <AnswerFeedbackBanner feedback={feedback} interfaceLang={interfaceLang} />

      <div className="grid w-full min-w-0 grid-cols-2 gap-2 sm:gap-3">
        {current.options.map((option) => {
          const isSelected = selectedId === option.card.id;
          const isCorrect = option.card.id === current.correctId;
          return (
            <button
              key={option.card.id}
              type="button"
              disabled={isLocked || hearts <= 0}
              onClick={() => handleSelect(option.card.id)}
              className={cn(
                "min-w-0 overflow-hidden rounded-2xl border text-left transition-all",
                "border-white/15 bg-white/5 hover:bg-white/10",
                isLocked &&
                  isSelected &&
                  isCorrect &&
                  "border-emerald-400/60 bg-emerald-500/20",
                isLocked &&
                  isSelected &&
                  !isCorrect &&
                  "border-red-400/60 bg-red-500/20",
                isLocked && !isSelected && isCorrect && "border-emerald-400/30"
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
              <div className="flex min-w-0 items-center justify-between gap-2 p-2 sm:p-3">
                <span className="min-w-0 break-words text-xs font-medium text-white sm:text-sm">
                  {option.label}
                </span>
                {isLocked && isCorrect && (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                )}
                {isLocked && isSelected && !isCorrect && (
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
