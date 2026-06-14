"use client";

import { LanguageProvider } from "@/i18n/LanguageProvider";
import { PwaProvider } from "@/context/PwaContext";
import { InstallPwaBanner } from "@/components/pwa/InstallPwaBanner";
import { ServiceWorkerUpdater } from "@/components/pwa/ServiceWorkerUpdater";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <PwaProvider>
        <ServiceWorkerUpdater />
        <InstallPwaBanner />
        {children}
      </PwaProvider>
    </LanguageProvider>
  );
}
