"use client";

import { HTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  hover?: boolean;
  clickable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  title,
  description,
  header,
  footer,
  children,
  hover = false,
  clickable = false,
  padding = "md",
  className,
  ...props
}: CardProps) {
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={clsx(
        "rounded-2xl border border-slate-800 bg-slate-900 shadow-lg transition-all duration-200",
        hover && "hover:border-blue-500 hover:shadow-xl",
        clickable && "cursor-pointer",
        className
      )}
      {...props}
    >
      {(title || description || header) && (
        <div className="border-b border-slate-800 px-6 py-5">
          {header}

          {title && (
            <h2 className="text-xl font-bold text-white">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-1 text-sm text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}

      <div className={paddingStyles[padding]}>
        {children}
      </div>

      {footer && (
        <div className="border-t border-slate-800 px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
}