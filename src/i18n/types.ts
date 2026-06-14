import type { InterfaceLanguage } from "@/types";

export type Locale = InterfaceLanguage;

export type MessageTree = {
  [key: string]: string | MessageTree;
};
