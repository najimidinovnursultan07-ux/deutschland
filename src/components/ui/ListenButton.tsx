"use client";

import { useState } from "react";
import { Volume2, Loader2 } from "lucide-react";
import { speakText, stopSpeaking } from "@/lib/speech";
import type { TargetLanguage } from "@/types";
import { cn } from "@/lib/utils";

interface ListenButtonProps {
  text: string;
  targetLang: TargetLanguage;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export function ListenButton({
  text,
  targetLang,
  label,
  size = "sm",
  className,
}: ListenButtonProps) {
  const [speaking, setSpeaking] = useState(false);

  const handleClick = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speakText(text, targetLang, () => setSpeaking(false));
  };

  const iconSize = size === "sm" ? 14 : 18;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label ?? "Listen"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10",
        "text-white/80 transition-all hover:bg-white/20 hover:text-white",
        size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm",
        speaking && "border-violet-400/50 bg-violet-500/20 text-violet-200",
        className
      )}
    >
      {speaking ? (
        <Loader2 size={iconSize} className="animate-spin" />
      ) : (
        <Volume2 size={iconSize} />
      )}
      {label && <span>{label}</span>}
    </button>
  );
}
