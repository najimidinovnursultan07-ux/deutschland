"use client";

import { useState, type ReactNode } from "react";
import {
  ChevronDown,
  HelpCircle,
  FileQuestion,
  MessageCircle,
  Mail,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

const OWNER_EMAIL = "najimidinovnursultan07@gmail.com";

interface SupportItemConfig {
  id: string;
  icon: typeof HelpCircle;
  titleKey: string;
  contentKey: string;
}

const SUPPORT_ITEMS: SupportItemConfig[] = [
  {
    id: "help",
    icon: HelpCircle,
    titleKey: "nav.help",
    contentKey: "help.content",
  },
  {
    id: "faq",
    icon: FileQuestion,
    titleKey: "nav.faq",
    contentKey: "faq.content",
  },
];

function ContactAccordionContent() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 border-t border-white/10 px-4 py-3 text-sm leading-relaxed sm:text-base">
      <div className="flex min-w-0 items-start gap-3">
        <Mail size={18} className="mt-0.5 shrink-0 text-violet-300" />
        <div className="min-w-0 break-words">
          <span className="block text-white/50">{t("support.emailLabel")}</span>
          <a
            href={`mailto:${OWNER_EMAIL}`}
            className="font-medium text-violet-200 underline decoration-violet-400/50 underline-offset-2 transition hover:text-white"
          >
            {OWNER_EMAIL}
          </a>
        </div>
      </div>

      <div className="flex min-w-0 items-start gap-3">
        <Clock size={18} className="mt-0.5 shrink-0 text-violet-300" />
        <div className="min-w-0 break-words">
          <span className="block text-white/50">{t("support.hoursLabel")}</span>
          <span className="text-white/90">{t("support.hoursValue")}</span>
        </div>
      </div>

      <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/70">
        {t("support.footerNote")}
      </p>
    </div>
  );
}

export function SupportAccordion() {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="w-full min-w-0 space-y-2">
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
              <span className="min-w-0 flex-1 font-medium">{t(item.titleKey)}</span>
              <ChevronDown
                size={16}
                className={cn(
                  "shrink-0 text-white/40 transition-transform duration-300",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="whitespace-pre-line border-t border-white/10 px-4 py-3 text-sm leading-relaxed text-white/60">
                  {t(item.contentKey)}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <ContactAccordionItem
        isOpen={openId === "contact"}
        onToggle={() => setOpenId(openId === "contact" ? null : "contact")}
        title={t("support.title")}
      >
        <ContactAccordionContent />
      </ContactAccordionItem>
    </div>
  );
}

interface ContactAccordionItemProps {
  isOpen: boolean;
  onToggle: () => void;
  title: string;
  children: ReactNode;
}

function ContactAccordionItem({
  isOpen,
  onToggle,
  title,
  children,
}: ContactAccordionItemProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        aria-expanded={isOpen}
      >
        <MessageCircle size={18} className="shrink-0 text-violet-300" />
        <span className="min-w-0 flex-1 font-medium">{title}</span>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-white/40 transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
