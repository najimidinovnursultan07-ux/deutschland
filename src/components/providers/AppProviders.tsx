"use client";

import { LanguageProvider } from "@/i18n/LanguageProvider";
import { ServiceWorkerUpdater } from "@/components/pwa/ServiceWorkerUpdater";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ServiceWorkerUpdater />
      {children}
    </LanguageProvider>
  );
}
