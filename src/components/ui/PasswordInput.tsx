"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export function PasswordInput({
  label,
  error,
  className,
  id,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-white/80"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          className={cn(
            "w-full rounded-xl border border-white/20 bg-white/10 py-2.5 pl-4 pr-11",
            "text-white placeholder:text-white/40 backdrop-blur-sm",
            "focus:border-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-400/30",
            "transition-all duration-200",
            error && "border-red-400/50",
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-white/50 transition hover:bg-white/10 hover:text-violet-200"
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
    </div>
  );
}
