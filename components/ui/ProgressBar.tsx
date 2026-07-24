"use client";

import { clsx } from "clsx";

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  variant?:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info";
  animated?: boolean;
  rounded?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  size = "md",
  variant = "primary",
  animated = true,
  rounded = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(
    Math.max((value / max) * 100, 0),
    100
  );

  const heights = {
    sm: "h-2",
    md: "h-3",
    lg: "h-5",
  };

  const colours = {
    primary: "bg-blue-600",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-cyan-500",
  };

  return (
    <div className={clsx("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-slate-200">
              {label}
            </span>
          )}

          {showValue && (
            <span className="text-sm font-semibold text-slate-300">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={clsx(
          "w-full overflow-hidden bg-slate-800",
          heights[size],
          rounded ? "rounded-full" : "rounded-md"
        )}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        <div
          className={clsx(
            heights[size],
            colours[variant],
            animated && "transition-all duration-500 ease-out",
            rounded ? "rounded-full" : "rounded-md"
          )}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}