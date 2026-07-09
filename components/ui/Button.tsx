import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-blue-600 hover:bg-blue-500 text-white"
      : "border border-slate-700 text-white hover:bg-slate-800";

  return (
    <button
      className={`rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105 ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}