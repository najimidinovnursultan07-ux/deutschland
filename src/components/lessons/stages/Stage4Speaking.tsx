"use client";

import { useCallback, useState } from "react";
import { Mic, MicOff, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ListenButton } from "@/components/ui/ListenButton";
import { getUiString } from "@/lib/constants";
import { speechMatches } from "@/lib/lessonSentences";
import {
  isVoiceSearchSupported,
  startPronunciationPractice,
} from "@/lib/speech";
import { playCorrectSound } from "@/lib/sounds";
import type { SpeakingExercise } from "@/types";
import type { TargetLanguage } from "@/types";
import { cn } from "@/lib/utils";

interface Stage4SpeakingProps {
  exercises: SpeakingExercise[];
  index: number;
  interfaceLang: "ky" | "ru";
  targetLang: TargetLanguage;
  soundsEnabled: boolean;
  bonusAwarded: boolean;
  onSuccess: (bonus: boolean) => void;
  onSkip: () => void;
  embedded?: boolean;
}

export function Stage4Speaking({
  exercises,
  index,
  interfaceLang,
  targetLang,
  soundsEnabled,
  bonusAwarded,
  onSuccess,
  onSkip,
  embedded = false,
}: Stage4SpeakingProps) {
  const exercise = exercises[index];
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "fail" | "denied">(
    "idle"
  );
  const [transcript, setTranscript] = useState("");

  const prompt =
    interfaceLang === "ky" ? exercise.promptKy : exercise.promptRu;

  const handleMic = useCallback(() => {
    if (!isVoiceSearchSupported()) {
      setResult("denied");
      return;
    }
    setListening(true);
    setResult("idle");
    setTranscript("");

    const stop = startPronunciationPractice(
      targetLang,
      (spoken) => {
        setTranscript(spoken);
        setListening(false);
        if (speechMatches(exercise.expectedForeign, spoken)) {
          setResult("success");
          playCorrectSound(soundsEnabled);
          setTimeout(() => onSuccess(!bonusAwarded), 900);
        } else {
          setResult("fail");
        }
      },
      () => {
        setListening(false);
        setResult("denied");
      }
    );

    if (!stop) {
      setListening(false);
      setResult("denied");
    }
  }, [
    targetLang,
    exercise.expectedForeign,
    soundsEnabled,
    bonusAwarded,
    onSuccess,
  ]);

  const promptBlock = (
    <>
      <p className="mb-2 text-xs uppercase tracking-wide text-violet-300">
        {getUiString(interfaceLang, "stage4Hint")}
      </p>
      <p className="break-words text-lg font-semibold text-white sm:text-xl">
        {prompt}
      </p>
      <p className="mt-3 break-words text-sm text-white/40">
        {getUiString(interfaceLang, "speakTarget")}:{" "}
        <span className="text-violet-200">{exercise.expectedForeign}</span>
      </p>
      <div className="mt-3 flex justify-center">
        <ListenButton
          text={exercise.expectedForeign}
          targetLang={targetLang}
          label={getUiString(interfaceLang, "listen")}
        />
      </div>
    </>
  );

  return (
    <div className="w-full min-w-0 space-y-5">
      {embedded ? (
        <div className="text-center">{promptBlock}</div>
      ) : (
        <GlassCard className="w-full border-white/10 bg-slate-950/50 p-4 text-center backdrop-blur-xl md:p-6">
          {promptBlock}
        </GlassCard>
      )}

      <div className="flex flex-col items-center gap-4 py-4">
        <button
          type="button"
          onClick={handleMic}
          disabled={listening || result === "success"}
          className={cn(
            "relative flex h-28 w-28 items-center justify-center rounded-full border-2 transition-all",
            listening
              ? "border-red-400/60 bg-red-500/20 animate-pulse"
              : result === "success"
                ? "border-emerald-400/60 bg-emerald-500/20 shadow-[0_0_40px_rgba(52,211,153,0.4)]"
                : "border-violet-400/40 bg-violet-500/20 hover:scale-105 hover:shadow-[0_0_30px_rgba(167,139,250,0.35)]"
          )}
        >
          {result === "success" ? (
            <Sparkles className="text-emerald-300" size={40} />
          ) : listening ? (
            <Mic className="text-red-300" size={40} />
          ) : (
            <Mic className="text-violet-200" size={40} />
          )}
        </button>
        <p className="text-sm text-white/60">
          {listening
            ? getUiString(interfaceLang, "listening")
            : getUiString(interfaceLang, "tapMic")}
        </p>
        {transcript && (
          <p className="text-xs text-white/40">
            {getUiString(interfaceLang, "heard")}: &ldquo;{transcript}&rdquo;
          </p>
        )}
        {result === "fail" && (
          <p className="text-sm text-amber-300">
            {getUiString(interfaceLang, "tryAgain")}
          </p>
        )}
        {result === "denied" && (
          <div className="flex items-center gap-2 text-sm text-white/50">
            <MicOff size={16} />
            {getUiString(interfaceLang, "micDenied")}
          </div>
        )}
      </div>

      <div className="flex w-full min-w-0 gap-2">
        <Button variant="secondary" className="min-w-0 flex-1" onClick={onSkip}>
          {getUiString(interfaceLang, "skip")}
        </Button>
        {result === "fail" && (
          <Button className="min-w-0 flex-1" onClick={handleMic}>
            {getUiString(interfaceLang, "retry")}
          </Button>
        )}
      </div>

      {!bonusAwarded && (
        <p className="text-center text-xs text-amber-300/80">
          {getUiString(interfaceLang, "speakingBonus")}
        </p>
      )}

      <p className="text-center text-xs text-white/40">
        {index + 1} / {exercises.length}
      </p>
    </div>
  );
}
