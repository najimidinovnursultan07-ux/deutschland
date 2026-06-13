"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, XCircle } from "lucide-react";
import { AnswerFeedbackBanner } from "@/components/lessons/AnswerFeedbackBanner";
import { GlassCard } from "@/components/ui/GlassCard";
import { getUiString } from "@/lib/constants";
import { getQuizCorrectAnswerLabel } from "@/lib/lessonQuiz";
import { speakText } from "@/lib/speech";
import { playCorrectSound, playWrongSound } from "@/lib/sounds";
import {
  INITIAL_FEEDBACK,
  createFeedback,
  type FeedbackState,
} from "@/types/feedback";
import type { QuizQuestion } from "@/types";
import type { TargetLanguage } from "@/types";
import { cn } from "@/lib/utils";

interface Stage2VisualMatchProps {
  questions: QuizQuestion[];
  index: number;
  interfaceLang: "ky" | "ru";
  targetLang: TargetLanguage;
  soundsEnabled: boolean;
  onCorrect: () => void;
  onWrong: () => void;
  embedded?: boolean;
}

export function Stage2VisualMatch({
  questions,
  index,
  interfaceLang,
  targetLang,
  soundsEnabled,
  onCorrect,
  onWrong,
  embedded = false,
}: Stage2VisualMatchProps) {
  const current = questions[index];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>(INITIAL_FEEDBACK);

  const correctAnswerText = getQuizCorrectAnswerLabel(current, interfaceLang);
  const isLocked = feedback.isChecked;

  useEffect(() => {
    setSelectedId(null);
    setFeedback(INITIAL_FEEDBACK);
    const t = setTimeout(() => {
      speakText(current.prompt.term, targetLang);
    }, 300);
    return () => clearTimeout(t);
  }, [current, targetLang]);

  const handleSelect = (optionId: string) => {
    if (isLocked) return;
    setSelectedId(optionId);
    const isCorrect = optionId === current.correctId;
    setFeedback(createFeedback(isCorrect, correctAnswerText));

    if (isCorrect) {
      playCorrectSound(soundsEnabled);
      setTimeout(onCorrect, 900);
    } else {
      playWrongSound(soundsEnabled);
      setTimeout(onWrong, 2800);
    }
  };

  const promptBlock = (
    <>
      <p className="mb-1 text-xs uppercase tracking-wide text-violet-300">
        {getUiString(interfaceLang, "stage2Hint")}
      </p>
      <p className="break-words text-xl font-bold text-white sm:text-2xl">
        {current.prompt.term}
      </p>
      <p className="mt-1 text-xs text-violet-300">
        {current.prompt.readingGuide}
      </p>
    </>
  );

  return (
    <div className="w-full min-w-0 space-y-5">
      {embedded ? (
        <div>{promptBlock}</div>
      ) : (
        <GlassCard className="w-full border-white/10 bg-slate-950/50 p-4 backdrop-blur-xl md:p-6">
          {promptBlock}
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
              disabled={isLocked}
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

      <p className="text-center text-xs text-white/40">
        {index + 1} / {questions.length}
      </p>
    </div>
  );
}
