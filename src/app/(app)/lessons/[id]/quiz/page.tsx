"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

/** Legacy quiz route — redirects into unified 5-stage lesson workflow */
export default function LessonQuizRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = decodeURIComponent(params.id as string);

  useEffect(() => {
    router.replace(`/lessons/${encodeURIComponent(lessonId)}`);
  }, [lessonId, router]);

  return null;
}
