"use client";

import { HTMLAttributes } from "react";
import { clsx } from "clsx";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "secondary";
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
}

export default function Badge({
  variant = "default",
  size = "md",
  rounded = true,
  className,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-slate-700 text-slate-100",
    success: "bg-emerald-600 text-white",
    warning: "bg-amber-500 text-black",
    danger: "bg-red-600 text-white",
    info: "bg-blue-600 text-white",
    secondary: "bg-purple-600 text-white",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center font-semibold",
        rounded ? "rounded-full" : "rounded-md",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}