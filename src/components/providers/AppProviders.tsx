"use client";

import { LanguageProvider } from "@/i18n/LanguageProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
