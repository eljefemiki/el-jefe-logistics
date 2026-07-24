"use client";

import { LabelHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  optional?: boolean;
}

export default function Label({
  children,
  className,
  required = false,
  optional = false,
  ...props
}: LabelProps) {
  return (
    <label
      className={clsx(
        "mb-2 block text-sm font-semibold tracking-wide text-slate-200",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2">
        {children}

        {required && (
          <span
            className="text-red-500"
            aria-label="required"
          >
            *
          </span>
        )}

        {optional && !required && (
          <span className="text-xs font-normal text-slate-500">
            Optional
          </span>
        )}
      </span>
    </label>
  );
}