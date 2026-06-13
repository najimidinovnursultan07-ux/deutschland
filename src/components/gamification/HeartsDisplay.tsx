"use client";

import { useEffect } from "react";
import { Heart } from "lucide-react";
import { MAX_HEARTS } from "@/lib/gamification";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

interface HeartsDisplayProps {
  className?: string;
}

export function HeartsDisplay({ className }: HeartsDisplayProps) {
  const hearts = useAppStore((s) => s.hearts);
  const syncHearts = useAppStore((s) => s.syncHearts);

  useEffect(() => {
    syncHearts();
    const interval = setInterval(syncHearts, 60000);
    return () => clearInterval(interval);
  }, [syncHearts]);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: MAX_HEARTS }).map((_, i) => (
        <Heart
          key={i}
          size={18}
          className={cn(
            "transition-all",
            i < hearts
              ? "fill-red-500 text-red-500"
              : "fill-transparent text-white/20"
          )}
        />
      ))}
    </div>
  );
}
