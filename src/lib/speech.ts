import type { TargetLanguage } from "@/types";

const LOCKED_LOCALES: Record<TargetLanguage, string> = {
  de: "de-DE",
  en: "en-US",
};

function pickVoiceForLocale(locale: string): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const langPrefix = locale.split("-")[0];

  const exact = voices.find((v) => v.lang === locale);
  if (exact) return exact;

  const regional = voices.find(
    (v) => v.lang.startsWith(locale) || v.lang.replace("_", "-") === locale
  );
  if (regional) return regional;

  const prefixMatch = voices.find((v) => v.lang.startsWith(langPrefix));
  if (prefixMatch) return prefixMatch;

  return null;
}

export function speakText(
  text: string,
  targetLang: TargetLanguage,
  onEnd?: () => void
): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const locale = LOCKED_LOCALES[targetLang];
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  utterance.rate = 0.88;
  utterance.pitch = 1;

  const assignVoice = () => {
    const voice = pickVoiceForLocale(locale);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      assignVoice();
    };
  } else {
    assignVoice();
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

interface SpeechRecognitionEventLike {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;

  const win = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

export function isVoiceSearchSupported(): boolean {
  return getSpeechRecognition() !== null;
}

export function startPronunciationPractice(
  targetLang: TargetLanguage,
  onResult: (transcript: string) => void,
  onError?: () => void
): (() => void) | null {
  return startVoiceSearch(LOCKED_LOCALES[targetLang], onResult, onError);
}

export function startVoiceSearch(
  lang: string,
  onResult: (transcript: string) => void,
  onError?: () => void
): (() => void) | null {
  const SpeechRecognition = getSpeechRecognition();
  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.lang = lang;
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event: SpeechRecognitionEventLike) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = () => {
    onError?.();
  };

  recognition.start();

  return () => {
    recognition.stop();
  };
}
