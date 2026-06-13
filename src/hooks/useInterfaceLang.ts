"use client";

import { getBaseLangFromPair, useAppStore } from "@/store/appStore";
import type { InterfaceLanguage } from "@/types";

/**
 * UI language is always driven by the base language of the selected language pair.
 * ky-de / ky-en → Kyrgyz UI; ru-de / ru-en → Russian UI.
 */
export function useInterfaceLang(): InterfaceLanguage {
  const languagePair = useAppStore((s) => s.languagePair);
  return getBaseLangFromPair(languagePair);
}
