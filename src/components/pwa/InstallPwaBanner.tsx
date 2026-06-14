"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

export function InstallPwaBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandaloneDisplay()) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const onInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    if (!sessionStorage.getItem("lingua:pwa-banner-dismissed")) {
      setVisible(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);

    if (choice.outcome === "accepted") {
      setVisible(false);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    setVisible(false);
    sessionStorage.setItem("lingua:pwa-banner-dismissed", "1");
  }, []);

  if (!visible || dismissed || isStandaloneDisplay()) return null;

  return (
    <div
      className={cn(
        "sticky top-0 z-[60] flex w-full items-center justify-center gap-2 border-b border-violet-400/30",
        "bg-gradient-to-r from-violet-600/95 via-fuchsia-600/95 to-indigo-600/95 px-3 py-2.5 backdrop-blur-md",
        "sm:gap-3 sm:px-4"
      )}
      role="region"
      aria-label="Install app"
    >
      <button
        type="button"
        onClick={() => void handleInstall()}
        disabled={!deferredPrompt}
        className="flex min-w-0 flex-1 items-center justify-center gap-2 text-center text-sm font-medium text-white sm:text-base"
      >
        <Download size={16} className="shrink-0" />
        <span className="break-words">📲 Колдонмону орнотуу</span>
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        className="shrink-0 rounded-lg p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
        aria-label="Close"
      >
        <X size={18} />
      </button>
    </div>
  );
}
