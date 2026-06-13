import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "main" | "section";
}

/** Shared fluid page width — avoids hardcoded pixel widths and horizontal overflow */
export function PageContainer({
  children,
  className,
  as: Component = "div",
}: PageContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-xl px-4 sm:px-6 md:max-w-4xl md:px-8 lg:max-w-7xl",
        className
      )}
    >
      {children}
    </Component>
  );
}

export const fluidContainerClass =
  "mx-auto w-full max-w-xl px-4 sm:px-6 md:max-w-4xl md:px-8 lg:max-w-7xl";
