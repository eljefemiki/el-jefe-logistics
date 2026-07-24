"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

export interface AlertProps {
  variant?: "success" | "error" | "warning" | "info";
  title?: string;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export default function Alert({
  variant = "info",
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
}: AlertProps) {
  const variants = {
    success: {
      container:
        "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
    },
    error: {
      container:
        "border-red-500/40 bg-red-500/10 text-red-200",
      icon: <AlertCircle className="h-5 w-5 text-red-400" />,
    },
    warning: {
      container:
        "border-amber-500/40 bg-amber-500/10 text-amber-200",
      icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
    },
    info: {
      container:
        "border-blue-500/40 bg-blue-500/10 text-blue-200",
      icon: <Info className="h-5 w-5 text-blue-400" />,
    },
  };

  const current = variants[variant];

  return (
    <div
      role="alert"
      className={clsx(
        "flex items-start gap-4 rounded-xl border p-4",
        current.container,
        className
      )}
    >
      <div className="mt-0.5">
        {current.icon}
      </div>

      <div className="flex-1">
        {title && (
          <h4 className="mb-1 font-semibold">
            {title}
          </h4>
        )}

        <div className="text-sm leading-6">
          {children}
        </div>
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-md p-1 transition hover:bg-white/10"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}