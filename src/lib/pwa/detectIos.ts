const IOS_DEVICE_REGEX = /iPhone|iPad|iPod/i;

export function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

export function isIosDevice(userAgent?: string): boolean {
  if (typeof navigator === "undefined" && !userAgent) return false;
  const ua = userAgent ?? navigator.userAgent;
  return IOS_DEVICE_REGEX.test(ua);
}

/** Safari on iOS (not Chrome/Firefox/Instagram in-app). */
export function isIosSafari(userAgent?: string): boolean {
  if (!isIosDevice(userAgent)) return false;
  const ua = userAgent ?? navigator.userAgent;
  return (
    /Safari/i.test(ua) &&
    !/CriOS|FxiOS|OPiOS|EdgiOS|Instagram|FBAN|FBIA/i.test(ua)
  );
}

export function canShowIosInstallPrompt(userAgent?: string): boolean {
  if (typeof window === "undefined") return false;
  if (isStandalonePwa()) return false;
  return isIosSafari(userAgent);
}
