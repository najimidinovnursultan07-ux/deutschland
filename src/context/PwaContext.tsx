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
import { InstagramBrowserHintModal } from "@/components/pwa/InstagramBrowserHintModal";
import { IosInstallPrompt } from "@/components/pwa/IosInstallPrompt";
import { isInstagramInAppBrowser } from "@/lib/pwa/detectInAppBrowser";
import {
  canShowIosInstallPrompt,
  isIosSafari,
  isStandalonePwa,
} from "@/lib/pwa/detectIos";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const INSTAGRAM_HINT_DISMISS_KEY = "lingua:instagram-hint-dismissed";
const IOS_INSTALL_DISMISS_KEY = "lingua:ios-install-dismissed";

interface PwaContextValue {
  isInstallable: boolean;
  isInstalled: boolean;
  isInstalling: boolean;
  isInstagramInApp: boolean;
  isIosSafari: boolean;
  isInstagramHintOpen: boolean;
  isIosInstallHintOpen: boolean;
  installApp: () => Promise<boolean>;
  openInstagramInstallHint: () => void;
  closeInstagramInstallHint: () => void;
  openIosInstallHint: () => void;
  closeIosInstallHint: () => void;
}

const PwaContext = createContext<PwaContextValue | null>(null);

export function PwaProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstagramInApp, setIsInstagramInApp] = useState(false);
  const [isIosSafariDevice, setIsIosSafariDevice] = useState(false);
  const [isInstagramHintOpen, setIsInstagramHintOpen] = useState(false);
  const [isIosInstallHintOpen, setIsIosInstallHintOpen] = useState(false);

  const openInstagramInstallHint = useCallback(() => {
    setIsInstagramHintOpen(true);
  }, []);

  const closeInstagramInstallHint = useCallback(() => {
    setIsInstagramHintOpen(false);
    sessionStorage.setItem(INSTAGRAM_HINT_DISMISS_KEY, "1");
  }, []);

  const openIosInstallHint = useCallback(() => {
    setIsIosInstallHintOpen(true);
  }, []);

  const closeIosInstallHint = useCallback(() => {
    setIsIosInstallHintOpen(false);
    localStorage.setItem(IOS_INSTALL_DISMISS_KEY, "1");
  }, []);

  useEffect(() => {
    if (isStandalonePwa()) {
      setIsInstalled(true);
      return;
    }

    const inInstagram = isInstagramInAppBrowser();
    const onIosSafari = isIosSafari();

    setIsInstagramInApp(inInstagram);
    setIsIosSafariDevice(onIosSafari);

    if (
      inInstagram &&
      sessionStorage.getItem(INSTAGRAM_HINT_DISMISS_KEY) !== "1"
    ) {
      setIsInstagramHintOpen(true);
      return;
    }

    if (
      canShowIosInstallPrompt() &&
      localStorage.getItem(IOS_INSTALL_DISMISS_KEY) !== "1"
    ) {
      setIsIosInstallHintOpen(true);
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
      setIsIosInstallHintOpen(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const installApp = useCallback(async (): Promise<boolean> => {
    if (isInstagramInApp) {
      openInstagramInstallHint();
      return false;
    }

    if (isIosSafariDevice) {
      openIosInstallHint();
      return false;
    }

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
  }, [
    deferredPrompt,
    isInstagramInApp,
    isIosSafariDevice,
    openInstagramInstallHint,
    openIosInstallHint,
  ]);

  const value = useMemo<PwaContextValue>(
    () => ({
      isInstallable: Boolean(deferredPrompt) && !isInstalled,
      isInstalled,
      isInstalling,
      isInstagramInApp,
      isIosSafari: isIosSafariDevice,
      isInstagramHintOpen,
      isIosInstallHintOpen,
      installApp,
      openInstagramInstallHint,
      closeInstagramInstallHint,
      openIosInstallHint,
      closeIosInstallHint,
    }),
    [
      deferredPrompt,
      isInstalled,
      isInstalling,
      isInstagramInApp,
      isIosSafariDevice,
      isInstagramHintOpen,
      isIosInstallHintOpen,
      installApp,
      openInstagramInstallHint,
      closeInstagramInstallHint,
      openIosInstallHint,
      closeIosInstallHint,
    ],
  );

  return (
    <PwaContext.Provider value={value}>
      {children}
      {isInstagramHintOpen && (
        <InstagramBrowserHintModal onClose={closeInstagramInstallHint} />
      )}
      {isIosInstallHintOpen && !isInstagramHintOpen && (
        <IosInstallPrompt onClose={closeIosInstallHint} />
      )}
    </PwaContext.Provider>
  );
}

export function usePwa(): PwaContextValue {
  const context = useContext(PwaContext);
  if (!context) {
    throw new Error("usePwa must be used within PwaProvider");
  }
  return context;
}
