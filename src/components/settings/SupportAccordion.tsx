"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, FileQuestion } from "lucide-react";
import { ContactPanel } from "./ContactPanel";
import { cn } from "@/lib/utils";
import type { InterfaceLanguage } from "@/types";

interface SupportItem {
  id: string;
  icon: typeof HelpCircle;
  titleKy: string;
  titleRu: string;
  contentKy: string;
  contentRu: string;
}

const SUPPORT_ITEMS: SupportItem[] = [
  {
    id: "help",
    icon: HelpCircle,
    titleKy: "Жардам борбору",
    titleRu: "Центр помощи",
    contentKy:
      "LinguaBridge колдонмосуна кош келиңиз! Бул жерден сабактарды өтүү, сөздүктү колдонуу жана тесттерди башкаруу боюнча жардам ала аласыз. Суроолоруңуз болсо, төмөнкү Байланыш бөлүмүнө кайрылыңыз.",
    contentRu:
      "Добро пожаловать в LinguaBridge! Здесь вы найдёте помощь по прохождению уроков, использованию словаря и прохождению тестов. Если у вас есть вопросы, обратитесь в раздел Контакты ниже.",
  },
  {
    id: "faq",
    icon: FileQuestion,
    titleKy: "Көп берилүүчү суроолор",
    titleRu: "Частые вопросы",
    contentKy:
      "С: Жүрөкчөлөр кантип калыбына келет?\nЖ: Ар 30 мүнөттө бир жүрөк калыбына келет же 200 XP төлөп толуктай аласыз.\n\nС: Кийинки сабак качан ачылат?\nЖ: Учурдагы сабактын тестин ийгиликтүү бүтүргөндөн кийин гана.",
    contentRu:
      "В: Как восстанавливаются сердца?\nО: Каждые 30 минут восстанавливается одно сердце, или можно пополнить за 200 XP.\n\nВ: Когда откроется следующий урок?\nО: Только после успешного прохождения теста текущего урока.",
  },
];

interface SupportAccordionProps {
  interfaceLang: InterfaceLanguage;
}

export function SupportAccordion({ interfaceLang }: SupportAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="space-y-2">
        {SUPPORT_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/5"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-expanded={isOpen}
              >
                <item.icon size={18} className="shrink-0 text-violet-300" />
                <span className="min-w-0 flex-1 font-medium">
                  {interfaceLang === "ky" ? item.titleKy : item.titleRu}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 text-white/40 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <p className="whitespace-pre-line border-t border-white/10 px-4 py-3 text-sm leading-relaxed text-white/60">
                    {interfaceLang === "ky" ? item.contentKy : item.contentRu}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ContactPanel />
    </div>
  );
}
