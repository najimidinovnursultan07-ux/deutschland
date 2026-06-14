import { messages } from "@/i18n/messages";
import type { Locale } from "@/i18n/types";

function resolvePath(tree: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = tree;

  for (const part of parts) {
    if (typeof current !== "object" || current === null || !(part in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : undefined;
}

export function translate(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>,
): string {
  const dict = messages[locale] as Record<string, unknown>;
  const nested = resolvePath(dict, key);
  let result: string | undefined;
  if (nested) {
    result = nested;
  } else {
    const flat = dict[key];
    result = typeof flat === "string" ? flat : undefined;
  }

  if (!result) return key;

  if (params) {
    for (const [paramKey, value] of Object.entries(params)) {
      result = result.replaceAll(`{${paramKey}}`, String(value));
    }
  }

  return result;
}

export function getUiString(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>,
): string {
  return translate(locale, key, params);
}
