"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import { translate } from "@/i18n/translate";
import type { Locale } from "@/i18n/types";

interface LanguageContextValue {
  locale: Locale;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useInterfaceLang();

  const value = useMemo(
    () => ({
      locale,
      t: (key: string, params?: Record<string, string | number>) =>
        translate(locale, key, params),
    }),
    [locale],
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguageContext(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguageContext must be used within LanguageProvider");
  }
  return ctx;
}
