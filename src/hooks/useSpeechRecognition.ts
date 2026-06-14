"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  disposeSpeechRecognition,
  requestMicrophoneAccess,
  createSpeechRecognition,
  type MicAccessResult,
} from "@/lib/speech";
import type { TargetLanguage } from "@/types";

const TARGET_LOCALES: Record<TargetLanguage, string> = {
  de: "de-DE",
  en: "en-US",
};

/**
 * Manages a single SpeechRecognition lifecycle per mount/step.
 * Always disposes (abort + listener cleanup) before starting again or unmounting.
 */
export function useSpeechRecognition(targetLang: TargetLanguage) {
  const disposeRef = useRef<(() => void) | null>(null);
  const recognitionRef = useRef<ReturnType<
    typeof createSpeechRecognition
  > | null>(null);

  const dispose = useCallback(() => {
    if (disposeRef.current) {
      disposeRef.current();
      disposeRef.current = null;
    }
    if (recognitionRef.current) {
      disposeSpeechRecognition(recognitionRef.current.recognition);
      recognitionRef.current = null;
    }
  }, []);

  const startListening = useCallback(
    async (
      onResult: (transcript: string) => void,
      onError?: (reason: MicAccessResult) => void
    ): Promise<boolean> => {
      dispose();

      const access = await requestMicrophoneAccess();
      if (access !== "granted") {
        onError?.(access);
        return false;
      }

      const session = createSpeechRecognition(
        TARGET_LOCALES[targetLang],
        (transcript) => {
          dispose();
          onResult(transcript);
        },
        (reason) => {
          dispose();
          onError?.(reason);
        }
      );

      if (!session) {
        onError?.("unsupported");
        return false;
      }

      recognitionRef.current = session;
      disposeRef.current = session.dispose;

      try {
        session.recognition.start();
        return true;
      } catch {
        dispose();
        onError?.("denied");
        return false;
      }
    },
    [targetLang, dispose]
  );

  useEffect(() => dispose, [dispose]);

  return { startListening, dispose };
}
