"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, Volume2 } from "lucide-react";
import { LessonStageTracker } from "./LessonStageTracker";
import { Stage2VisualMatch } from "./stages/Stage2VisualMatch";
import { Stage3SentenceBuilder } from "./stages/Stage3SentenceBuilder";
import { Stage4Speaking } from "./stages/Stage4Speaking";
import { Stage5FinalQuiz } from "./stages/Stage5FinalQuiz";
import { buildLessonQuizQuestions } from "@/lib/lessonQuiz";
import {
  buildSentenceExercises,
  buildSpeakingExercises,
} from "@/lib/lessonSentences";
import { fluidContainerClass } from "@/components/layout/PageContainer";
import { getUiString } from "@/lib/constants";
import { speakText } from "@/lib/speech";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { getTargetLangFromPair, useAppStore } from "@/store/appStore";
import type { Lesson, LessonStage } from "@/types";

interface LessonWorkflowProps {
  lesson: Lesson;
}

export function LessonWorkflow({ lesson }: LessonWorkflowProps) {
  const interfaceLang = useInterfaceLang();
  const languagePair = useAppStore((s) => s.languagePair);
  const settings = useAppStore((s) => s.settings);
  const passedQuizLessonIds = useAppStore((s) => s.passedQuizLessonIds);
  const passLessonQuiz = useAppStore((s) => s.passLessonQuiz);
  const addXp = useAppStore((s) => s.addXp);
  const activeLessonSession = useAppStore((s) => s.activeLessonSession);
  const saveLessonSession = useAppStore((s) => s.saveLessonSession);
  const targetLang = getTargetLangFromPair(languagePair);
  const isPassed = passedQuizLessonIds.includes(lesson.id);
  const soundsEnabled = settings.achievementSounds;

  const restoredSession =
    activeLessonSession?.lessonId === lesson.id ? activeLessonSession : null;

  const workflowData = useMemo(() => {
    const stage2Questions = buildLessonQuizQuestions(
      lesson,
      targetLang,
      interfaceLang,
      8
    );
    const sentenceExercises = buildSentenceExercises(lesson, 5);
    const speakingExercises = buildSpeakingExercises(sentenceExercises, 4);
    const finalQuestions = buildLessonQuizQuestions(
      lesson,
      targetLang,
      interfaceLang,
      6
    );
    return {
      stage2Questions,
      sentenceExercises,
      speakingExercises,
      finalQuestions,
    };
  }, [lesson, targetLang, interfaceLang]);

  const [stage, setStage] = useState<LessonStage>(restoredSession?.stage ?? 1);
  const [vocabIndex, setVocabIndex] = useState(restoredSession?.vocabIndex ?? 0);
  const [stage2Index, setStage2Index] = useState(restoredSession?.stage2Index ?? 0);
  const [stage3Index, setStage3Index] = useState(restoredSession?.stage3Index ?? 0);
  const [stage4Index, setStage4Index] = useState(restoredSession?.stage4Index ?? 0);
  const [stage5Index, setStage5Index] = useState(restoredSession?.stage5Index ?? 0);
  const [speakingBonusAwarded, setSpeakingBonusAwarded] = useState(
    restoredSession?.speakingBonusAwarded ?? false
  );
  const [startedAt] = useState(() => restoredSession?.startedAt ?? Date.now());
  const [quizPassed, setQuizPassed] = useState(
    restoredSession?.quizPassed ?? isPassed
  );

  useEffect(() => {
    saveLessonSession({
      lessonId: lesson.id,
      stage,
      vocabIndex,
      stage2Index,
      stage3Index,
      stage4Index,
      stage5Index,
      speakingBonusAwarded,
      startedAt,
      quizPassed,
    });
  }, [
    lesson.id,
    stage,
    vocabIndex,
    stage2Index,
    stage3Index,
    stage4Index,
    stage5Index,
    speakingBonusAwarded,
    startedAt,
    quizPassed,
    saveLessonSession,
  ]);

  const advanceStage = (next: LessonStage) => {
    setStage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStage5Complete = (perfect: boolean) => {
    if (!quizPassed) {
      passLessonQuiz(
        lesson.id,
        lesson.level,
        lesson.vocabulary.map((v) => v.id),
        perfect
      );
      setQuizPassed(true);
    }
  };

  const handleSpeakingSuccess = (grantBonus: boolean) => {
    if (grantBonus) {
      addXp(10);
      setSpeakingBonusAwarded(true);
    }
    if (stage4Index + 1 >= workflowData.speakingExercises.length) {
      advanceStage(5);
    } else {
      setStage4Index((i) => i + 1);
    }
  };

  const handleVocabNext = () => {
    if (vocabIndex + 1 >= lesson.vocabulary.length) {
      advanceStage(2);
    } else {
      setVocabIndex((i) => i + 1);
    }
  };

  const vocabNextLabel =
    vocabIndex + 1 >= lesson.vocabulary.length
      ? getUiString(interfaceLang, "continueStage")
      : getUiString(interfaceLang, "nextWord");

  const showPassedBanner = isPassed && stage === 1 && vocabIndex === 0;
  const showVocabStage = stage === 1 && !showPassedBanner;
  const showPrimaryAction = showVocabStage;

  const currentCard = lesson.vocabulary[vocabIndex];
  const vocabTotal = lesson.vocabulary.length;
  const vocabPercent =
    vocabTotal > 0 ? Math.min(100, ((vocabIndex + 1) / vocabTotal) * 100) : 0;

  const renderContentCard = () => {
    if (showPassedBanner) {
      return (
        <div className="flex w-full flex-col items-center text-center">
          <CheckCircle2 className="mb-3 h-12 w-12 text-emerald-400" />
          <p className="text-slate-200">
            {getUiString(interfaceLang, "lessonAlreadyPassed")}
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex w-full max-w-xs justify-center rounded-2xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            {getUiString(interfaceLang, "returnHome")}
          </Link>
        </div>
      );
    }

    if (stage === 1 && currentCard) {
      return (
        <>
          <div className="flex w-full items-start justify-between gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                {getUiString(interfaceLang, "stage1Hint")}
              </span>
              <h2 className="break-words text-3xl font-bold tracking-tight md:text-4xl">
                {currentCard.term}
              </h2>
              <span className="text-sm text-slate-400">
                {currentCard.pronunciation} · {currentCard.readingGuide}
              </span>
            </div>
            <button
              type="button"
              onClick={() => speakText(currentCard.term, targetLang)}
              aria-label={getUiString(interfaceLang, "listen")}
              className="shrink-0 rounded-xl border border-slate-700/50 bg-slate-800/80 p-3 text-slate-200 transition-all hover:bg-slate-700"
            >
              <Volume2 size={20} />
            </button>
          </div>
          <div className="border-t border-slate-800/80 pt-4">
            <p className="text-xl font-medium text-slate-100 md:text-2xl">
              {interfaceLang === "ky"
                ? currentCard.definitionKy
                : currentCard.definitionRu}
            </p>
          </div>
        </>
      );
    }

    if (stage === 2) {
      return (
        <Stage2VisualMatch
          embedded
          questions={workflowData.stage2Questions}
          index={stage2Index}
          interfaceLang={interfaceLang}
          targetLang={targetLang}
          soundsEnabled={soundsEnabled}
          onCorrect={() => {
            if (stage2Index + 1 >= workflowData.stage2Questions.length) {
              advanceStage(3);
            } else {
              setStage2Index((i) => i + 1);
            }
          }}
          onWrong={() => {
            if (stage2Index + 1 >= workflowData.stage2Questions.length) {
              advanceStage(3);
            } else {
              setStage2Index((i) => i + 1);
            }
          }}
        />
      );
    }

    if (stage === 3) {
      return (
        <Stage3SentenceBuilder
          embedded
          exercises={workflowData.sentenceExercises}
          index={stage3Index}
          interfaceLang={interfaceLang}
          targetLang={targetLang}
          soundsEnabled={soundsEnabled}
          onComplete={() => {
            if (stage3Index + 1 >= workflowData.sentenceExercises.length) {
              advanceStage(4);
            } else {
              setStage3Index((i) => i + 1);
            }
          }}
        />
      );
    }

    if (stage === 4) {
      return (
        <Stage4Speaking
          embedded
          exercises={workflowData.speakingExercises}
          index={stage4Index}
          interfaceLang={interfaceLang}
          targetLang={targetLang}
          soundsEnabled={soundsEnabled}
          bonusAwarded={speakingBonusAwarded}
          onSuccess={handleSpeakingSuccess}
          onSkip={() => {
            if (stage4Index + 1 >= workflowData.speakingExercises.length) {
              advanceStage(5);
            } else {
              setStage4Index((i) => i + 1);
            }
          }}
        />
      );
    }

    return (
      <Stage5FinalQuiz
        embedded
        questions={workflowData.finalQuestions}
        index={stage5Index}
        interfaceLang={interfaceLang}
        targetLang={targetLang}
        soundsEnabled={soundsEnabled}
        startedAt={startedAt}
        onIndexChange={setStage5Index}
        onComplete={handleStage5Complete}
      />
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start overflow-x-hidden bg-slate-950 text-white antialiased">
      <main
        className={`flex w-full min-w-0 flex-col gap-6 py-6 pb-8 md:gap-8 md:py-12 ${fluidContainerClass}`}
      >
        <div className="flex w-full items-center justify-start gap-4">
          <Link
            href="/"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-200 transition-colors hover:bg-slate-700"
            aria-label={getUiString(interfaceLang, "back")}
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold md:text-xl">
              {interfaceLang === "ky" ? lesson.titleKy : lesson.titleRu}
            </h1>
            <p className="truncate text-sm text-slate-400">
              {interfaceLang === "ky"
                ? lesson.descriptionKy
                : lesson.descriptionRu}
            </p>
          </div>
          {(quizPassed || isPassed) && (
            <CheckCircle2 className="shrink-0 text-emerald-400" size={24} />
          )}
        </div>

        <div className="flex w-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 md:p-6">
          <LessonStageTracker current={stage} interfaceLang={interfaceLang} />
        </div>

        {showVocabStage && (
          <div className="flex w-full flex-col gap-2">
            <div className="text-sm font-medium text-slate-400">
              {vocabIndex + 1} / {vocabTotal}
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-purple-500 transition-all duration-300"
                style={{ width: `${vocabPercent}%` }}
                role="progressbar"
                aria-valuenow={vocabIndex + 1}
                aria-valuemin={0}
                aria-valuemax={vocabTotal}
              />
            </div>
          </div>
        )}

        <div className="flex w-full min-h-[250px] flex-col justify-between gap-6 rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl md:p-10">
          {renderContentCard()}
        </div>

        {showPrimaryAction && (
          <div className="w-full pt-2">
            <button
              type="button"
              onClick={handleVocabNext}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-fuchsia-500 px-6 py-4 font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:from-purple-600 hover:to-fuchsia-600 active:scale-[0.99]"
            >
              <span>{vocabNextLabel}</span>
              <ChevronRight size={18} aria-hidden />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
