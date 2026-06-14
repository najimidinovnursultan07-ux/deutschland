"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PwaContextValue {
  isInstallable: boolean;
  isInstalled: boolean;
  isInstalling: boolean;
  installApp: () => Promise<boolean>;
}

const PwaContext = createContext<PwaContextValue | null>(null);

function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

export function PwaProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    if (isStandaloneDisplay()) {
      setIsInstalled(true);
      return;
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const installApp = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;

    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;

      setDeferredPrompt(null);

      if (choice.outcome === "accepted") {
        setIsInstalled(true);
        return true;
      }

      return false;
    } catch {
      return false;
    } finally {
      setIsInstalling(false);
    }
  }, [deferredPrompt]);

  const value = useMemo<PwaContextValue>(
    () => ({
      isInstallable: Boolean(deferredPrompt) && !isInstalled,
      isInstalled,
      isInstalling,
      installApp,
    }),
    [deferredPrompt, isInstalled, isInstalling, installApp],
  );

  return <PwaContext.Provider value={value}>{children}</PwaContext.Provider>;
}

export function usePwa(): PwaContextValue {
  const context = useContext(PwaContext);
  if (!context) {
    throw new Error("usePwa must be used within PwaProvider");
  }
  return context;
}
