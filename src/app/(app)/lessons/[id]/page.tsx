"use client";

import { useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import { LessonWorkflow } from "@/components/lessons/LessonWorkflow";
import { getLessonById } from "@/data/lessonFactory";
import { getTargetLangFromPair, useAppStore } from "@/store/appStore";

export default function LessonPage() {
  const params = useParams();
  const languagePair = useAppStore((s) => s.languagePair);
  const passedQuizLessonIds = useAppStore((s) => s.passedQuizLessonIds);
  const targetLang = getTargetLangFromPair(languagePair);

  const lessonId = decodeURIComponent(params.id as string);

  const lesson = useMemo(
    () => getLessonById(lessonId, targetLang),
    [lessonId, targetLang]
  );

  if (!lesson) {
    notFound();
    return null;
  }

  const isUnlocked =
    lesson.number === 1 ||
    passedQuizLessonIds.includes(
      `${lesson.level}-lesson-${lesson.number - 1}-${targetLang}`
    );

  if (!isUnlocked) {
    notFound();
    return null;
  }

  return <LessonWorkflow lesson={lesson} />;
}
