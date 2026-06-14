"use client";

import { useEffect, useRef } from "react";

const SW_PATH = "/sw.js";
const UPDATE_CHECK_MS = 5 * 60 * 1000;

function skipWaitingWorker(registration: ServiceWorkerRegistration) {
  registration.waiting?.postMessage({ type: "SKIP_WAITING" });
}

export function ServiceWorkerUpdater() {
  const isReloadingRef = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const reloadOnce = () => {
      if (isReloadingRef.current) return;
      isReloadingRef.current = true;
      window.location.reload();
    };

    const handleRegistration = (registration: ServiceWorkerRegistration) => {
      if (registration.waiting && navigator.serviceWorker.controller) {
        skipWaitingWorker(registration);
      }

      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        if (!installing) return;

        installing.addEventListener("statechange", () => {
          if (
            installing.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            skipWaitingWorker(registration);
          }
        });
      });
    };

    const checkForUpdates = async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration("/");
        if (!registration) return;
        await registration.update();
        if (registration.waiting) {
          skipWaitingWorker(registration);
        }
      } catch {
        // ignore — offline or unsupported
      }
    };

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register(SW_PATH, {
          scope: "/",
          updateViaCache: "none",
        });
        handleRegistration(registration);
        await registration.update();
        return registration;
      } catch {
        return undefined;
      }
    };

    navigator.serviceWorker.addEventListener("controllerchange", reloadOnce);

    const registrationPromise = registerServiceWorker();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void registrationPromise.then((reg) => {
          if (reg) void reg.update();
        });
        void checkForUpdates();
      }
    };

    const intervalId = window.setInterval(() => {
      void checkForUpdates();
    }, UPDATE_CHECK_MS);

    window.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", reloadOnce);
      window.clearInterval(intervalId);
      window.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, []);

  return null;
}
