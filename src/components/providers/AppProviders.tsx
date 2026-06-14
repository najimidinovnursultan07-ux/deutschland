"use client";

import { LanguageProvider } from "@/i18n/LanguageProvider";
import { PwaProvider } from "@/context/PwaContext";
import { ServiceWorkerUpdater } from "@/components/pwa/ServiceWorkerUpdater";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <PwaProvider>
        <ServiceWorkerUpdater />
        {children}
      </PwaProvider>
    </LanguageProvider>
  );
}
