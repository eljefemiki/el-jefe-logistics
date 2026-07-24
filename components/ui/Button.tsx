"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700",

    secondary:
      "bg-slate-700 text-white hover:bg-slate-600",

    outline:
      "border border-slate-600 bg-transparent text-white hover:bg-slate-800",

    danger:
      "bg-red-600 text-white hover:bg-red-700",

    ghost:
      "bg-transparent text-slate-300 hover:bg-slate-800",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5",
    lg: "h-12 px-6 text-lg",
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}