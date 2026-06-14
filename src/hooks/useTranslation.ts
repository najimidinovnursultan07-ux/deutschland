"use client";

import { useLanguageContext } from "@/i18n/LanguageProvider";

export function useTranslation() {
  return useLanguageContext();
}
