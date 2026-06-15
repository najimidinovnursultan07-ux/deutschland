const INSTAGRAM_IN_APP_REGEX = /Instagram|FBAN|FBIA/i;

export function isInstagramInAppBrowser(userAgent?: string): boolean {
  if (typeof navigator === "undefined" && !userAgent) return false;
  const ua = userAgent ?? navigator.userAgent;
  return INSTAGRAM_IN_APP_REGEX.test(ua);
}
