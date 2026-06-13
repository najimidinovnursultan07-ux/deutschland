import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}

export function GlassCard({
  children,
  className,
  as: Component = "div",
}: GlassCardProps) {
  return (
    <Component
      className={cn(
        "rounded-2xl border border-white/10 bg-slate-950/50 p-6 shadow-xl backdrop-blur-xl",
        "dark:border-white/10 dark:bg-slate-950/50",
        className
      )}
    >
      {children}
    </Component>
  );
}
