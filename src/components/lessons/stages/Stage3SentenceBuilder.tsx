"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { AnswerFeedbackBanner } from "@/components/lessons/AnswerFeedbackBanner";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { getUiString } from "@/lib/constants";
import { getDistractorChips, parseCorrectChips } from "@/lib/lessonSentences";
import { speakText } from "@/lib/speech";
import { playCorrectSound, playWrongSound } from "@/lib/sounds";
import {
  INITIAL_FEEDBACK,
  createFeedback,
  type FeedbackState,
} from "@/types/feedback";
import type { SentenceExercise } from "@/types";
import type { TargetLanguage } from "@/types";
import { cn } from "@/lib/utils";

interface Stage3SentenceBuilderProps {
  exercises: SentenceExercise[];
  index: number;
  interfaceLang: "ky" | "ru";
  targetLang: TargetLanguage;
  soundsEnabled: boolean;
  onComplete: () => void;
  embedded?: boolean;
}

export function Stage3SentenceBuilder({
  exercises,
  index,
  interfaceLang,
  targetLang,
  soundsEnabled,
  onComplete,
  embedded = false,
}: Stage3SentenceBuilderProps) {
  const exercise = exercises[index];
  const [selected, setSelected] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(INITIAL_FEEDBACK);

  const correctChipsSequence = useMemo(
    () => parseCorrectChips(exercise.correctAnswer),
    [exercise.correctAnswer]
  );

  const correctAnswerText = exercise.correctAnswer.trim();

  const chipBank = useMemo(() => {
    const distractors = getDistractorChips(exercise, exercises, 4);
    return [...correctChipsSequence, ...distractors].sort(
      () => Math.random() - 0.5
    );
  }, [correctChipsSequence, exercise, exercises]);

  useEffect(() => {
    setSelected([]);
    setSuccess(false);
    setFeedback(INITIAL_FEEDBACK);
  }, [exercise.id, index]);

  const clearWrongFeedback = () => {
    if (feedback.isChecked && feedback.isCorrect === false) {
      setFeedback(INITIAL_FEEDBACK);
    }
  };

  const usedCounts = selected.reduce<Record<string, number>>((acc, t) => {
    acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {});

  const availableCounts = chipBank.reduce<Record<string, number>>((acc, t) => {
    acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {});

  const canPick = (token: string) =>
    (usedCounts[token] ?? 0) < (availableCounts[token] ?? 0);

  const addToken = (token: string) => {
    if (!canPick(token) || success) return;
    clearWrongFeedback();
    setSelected((s) => [...s, token]);
  };

  const removeLast = () => {
    if (success) return;
    clearWrongFeedback();
    setSelected((s) => s.slice(0, -1));
  };

  const reset = () => {
    setSelected([]);
    setSuccess(false);
    setFeedback(INITIAL_FEEDBACK);
  };

  const check = () => {
    const built = selected.join(" ");
    const expected = correctChipsSequence.join(" ");
    const isCorrect = built === expected;

    setFeedback(createFeedback(isCorrect, correctAnswerText));

    if (isCorrect) {
      setSuccess(true);
      playCorrectSound(soundsEnabled);
      speakText(exercise.fullForeign, targetLang, () => {
        setTimeout(onComplete, 600);
      });
    } else {
      playWrongSound(soundsEnabled);
    }
  };

  const prompt =
    interfaceLang === "ky" ? exercise.promptKy : exercise.promptRu;

  const isSingleChip = correctChipsSequence.length === 1;

  const promptBlock = (
    <>
      <p className="mb-2 text-xs uppercase tracking-wide text-violet-300">
        {getUiString(interfaceLang, "stage3Hint")}
      </p>
      <p className="break-words text-lg font-semibold text-white sm:text-xl">
        {prompt}
      </p>
      {isSingleChip && (
        <p className="mt-1 text-xs text-slate-400">
          {interfaceLang === "ky"
            ? "Бир сөздү тандаңыз"
            : "Выберите одно слово"}
        </p>
      )}
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

      <div
        className={cn(
          "min-h-[4rem] w-full min-w-0 rounded-2xl border border-dashed border-white/20 bg-white/5 p-3 sm:p-4",
          success && "border-emerald-400/50 bg-emerald-500/10",
          feedback.isChecked &&
            feedback.isCorrect === false &&
            "border-red-400/40 bg-red-500/10",
          isSingleChip && "min-h-[3rem]"
        )}
      >
        <div className="flex flex-wrap gap-2">
          {selected.length === 0 ? (
            <span className="text-sm text-white/30">
              {getUiString(interfaceLang, "tapChips")}
            </span>
          ) : (
            selected.map((t, i) => (
              <span
                key={`${t}-${i}`}
                className="rounded-lg bg-violet-500/30 px-3 py-1.5 text-sm font-medium text-white"
              >
                {t}
              </span>
            ))
          )}
        </div>
        {success && (
          <div className="mt-2 flex items-center gap-2 text-sm text-emerald-300">
            <CheckCircle2 size={16} />
            {getUiString(interfaceLang, "sentenceCorrect")}
          </div>
        )}
      </div>

      <AnswerFeedbackBanner feedback={feedback} interfaceLang={interfaceLang} />

      <div className="flex w-full min-w-0 flex-wrap gap-2">
        {chipBank.map((token, i) => (
          <button
            key={`${token}-${i}`}
            type="button"
            disabled={!canPick(token) || success}
            onClick={() => addToken(token)}
            className={cn(
              "max-w-full break-words rounded-xl border border-white/15 bg-slate-900/60 px-3 py-2 text-sm font-medium text-white transition-all sm:px-4",
              "hover:border-violet-400/40 hover:bg-violet-500/20",
              (!canPick(token) || success) && "opacity-30"
            )}
          >
            {token}
          </button>
        ))}
      </div>

      <div className="flex w-full min-w-0 gap-2">
        <Button
          variant="secondary"
          className="min-w-0 flex-1"
          onClick={removeLast}
          disabled={success || selected.length === 0}
        >
          {getUiString(interfaceLang, "undo")}
        </Button>
        <Button
          variant="secondary"
          className="shrink-0"
          onClick={reset}
          disabled={success || selected.length === 0}
        >
          <RotateCcw size={16} />
        </Button>
        <Button
          className="min-w-0 flex-1"
          onClick={check}
          disabled={
            success || selected.length !== correctChipsSequence.length
          }
        >
          {getUiString(interfaceLang, "check")}
        </Button>
      </div>

      <p className="text-center text-xs text-white/40">
        {index + 1} / {exercises.length}
      </p>
    </div>
  );
}
