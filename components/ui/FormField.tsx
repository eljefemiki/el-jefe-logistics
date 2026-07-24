"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";
import Label from "./Label";

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  helperText?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export default function FormField({
  label,
  htmlFor,
  required = false,
  optional = false,
  helperText,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={clsx("space-y-2", className)}>
      {label && (
        <Label
          htmlFor={htmlFor}
          required={required}
          optional={optional}
        >
          {label}
        </Label>
      )}

      {children}

      {error ? (
        <p
          className="text-sm font-medium text-red-500"
          role="alert"
        >
          {error}
        </p>
      ) : helperText ? (
        <p className="text-sm text-slate-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}