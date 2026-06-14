import { kyMessages } from "@/i18n/messages/ky";
import { ruMessages } from "@/i18n/messages/ru";
import type { Locale } from "@/i18n/types";

export const messages: Record<Locale, typeof kyMessages> = {
  ky: kyMessages,
  ru: ruMessages,
};
