import type { TargetLanguage } from "@/types";

const LOCKED_LOCALES: Record<TargetLanguage, string> = {
  de: "de-DE",
  en: "en-US",
};

export type MicAccessResult =
  | "granted"
  | "denied"
  | "unsupported"
  | "insecure";

function isLocalDevHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

/** Request mic via getUserMedia before SpeechRecognition — avoids silent failures */
export async function requestMicrophoneAccess(): Promise<MicAccessResult> {
  if (typeof window === "undefined") return "unsupported";

  if (!window.isSecureContext && !isLocalDevHost()) {
    return "insecure";
  }

  if (navigator.mediaDevices?.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      return "granted";
    } catch {
      return "denied";
    }
  }

  if (getSpeechRecognitionConstructor()) {
    return "granted";
  }

  return "unsupported";
}

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
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;

  const win = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

export function isVoiceSearchSupported(): boolean {
  return getSpeechRecognitionConstructor() !== null;
}

/** Hard-stop any active recognition instance — call before advancing steps */
export function disposeSpeechRecognition(
  recognition: SpeechRecognitionInstance | null
): void {
  if (!recognition) return;

  recognition.onresult = null;
  recognition.onerror = null;
  recognition.onend = null;

  try {
    recognition.abort();
  } catch {
    try {
      recognition.stop();
    } catch {
      /* already stopped */
    }
  }
}

export interface SpeechRecognitionHandle {
  recognition: SpeechRecognitionInstance;
  dispose: () => void;
}

/** Fresh instance per exercise — prevents listener stacking across steps */
export function createSpeechRecognition(
  lang: string,
  onResult: (transcript: string) => void,
  onError?: (reason: MicAccessResult) => void
): SpeechRecognitionHandle | null {
  const SpeechRecognition = getSpeechRecognitionConstructor();
  if (!SpeechRecognition) {
    onError?.("unsupported");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = lang;
  recognition.continuous = false;
  recognition.interimResults = false;

  let finished = false;

  recognition.onresult = (event: SpeechRecognitionEventLike) => {
    finished = true;
    const transcript = event.results[0]?.[0]?.transcript ?? "";
    onResult(transcript);
  };

  recognition.onerror = () => {
    if (!finished) {
      onError?.("denied");
    }
  };

  const dispose = () => disposeSpeechRecognition(recognition);

  return { recognition, dispose };
}

export function startVoiceSearch(
  lang: string,
  onResult: (transcript: string) => void,
  onError?: (reason: MicAccessResult) => void
): (() => void) | null {
  const session = createSpeechRecognition(lang, onResult, onError);
  if (!session) return null;

  try {
    session.recognition.start();
  } catch {
    session.dispose();
    onError?.("denied");
    return null;
  }

  return session.dispose;
}

export function startPronunciationPractice(
  targetLang: TargetLanguage,
  onResult: (transcript: string) => void,
  onError?: (reason: MicAccessResult) => void
): (() => void) | null {
  return startVoiceSearch(LOCKED_LOCALES[targetLang], onResult, onError);
}

/** Async entry — requests mic permission before starting recognition */
export async function startPronunciationPracticeSecure(
  targetLang: TargetLanguage,
  onResult: (transcript: string) => void,
  onError?: (reason: MicAccessResult) => void
): Promise<(() => void) | null> {
  const access = await requestMicrophoneAccess();
  if (access !== "granted") {
    onError?.(access);
    return null;
  }
  return startVoiceSearch(LOCKED_LOCALES[targetLang], onResult, onError);
}
