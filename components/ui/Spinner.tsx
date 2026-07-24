"use client";

import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white" | "muted" | "success" | "danger";
  label?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function Spinner({
  size = "md",
  color = "primary",
  label,
  fullScreen = false,
  className,
}: SpinnerProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const colors = {
    primary: "text-blue-500",
    white: "text-white",
    muted: "text-slate-400",
    success: "text-emerald-500",
    danger: "text-red-500",
  };

  const spinner = (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2
        className={clsx(
          "animate-spin",
          sizes[size],
          colors[color]
        )}
      />

      {label && (
        <p className="text-sm text-slate-300">
          {label}
        </p>
      )}

      <span className="sr-only">
        Loading
      </span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}