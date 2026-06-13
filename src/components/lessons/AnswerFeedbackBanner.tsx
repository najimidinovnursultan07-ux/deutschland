"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { getUiString } from "@/lib/constants";
import type { FeedbackState } from "@/types/feedback";
import { cn } from "@/lib/utils";

interface AnswerFeedbackBannerProps {
  feedback: FeedbackState;
  interfaceLang: "ky" | "ru";
  className?: string;
}

export function AnswerFeedbackBanner({
  feedback,
  interfaceLang,
  className,
}: AnswerFeedbackBannerProps) {
  if (!feedback.isChecked || feedback.isCorrect === null) {
    return null;
  }

  if (feedback.isCorrect) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "flex w-full items-start gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-emerald-100 shadow-lg shadow-emerald-500/10",
          className
        )}
      >
        <CheckCircle2
          className="mt-0.5 shrink-0 text-emerald-400"
          size={22}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-emerald-200">
            {getUiString(interfaceLang, "answerCorrect")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border border-red-500/50 bg-red-500/15 px-4 py-3 text-red-100 shadow-lg shadow-red-500/15",
        className
      )}
    >
      <AlertCircle
        className="mt-0.5 shrink-0 text-red-400"
        size={22}
        aria-hidden
      />
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-semibold text-red-200">
          {getUiString(interfaceLang, "answerIncorrect")}
        </p>
        <p className="text-sm leading-relaxed text-red-100/90">
          <span className="font-medium text-red-200/90">
            {getUiString(interfaceLang, "correctAnswerLabel")}:{" "}
          </span>
          <span className="break-words font-semibold text-white">
            {feedback.correctAnswerText}
          </span>
        </p>
        <p className="text-xs text-red-200/70">
          {getUiString(interfaceLang, "tryAgain")}
        </p>
      </div>
    </div>
  );
}
