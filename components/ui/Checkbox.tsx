"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { clsx } from "clsx";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  helperText?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      label,
      helperText,
      error,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        <label
          htmlFor={id}
          className={clsx(
            "flex cursor-pointer items-start gap-3",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          <div className="relative mt-0.5">
            <input
              ref={ref}
              id={id}
              type="checkbox"
              disabled={disabled}
              className="peer sr-only"
              {...props}
            />

            <div
              className={clsx(
                "flex h-5 w-5 items-center justify-center rounded-md border transition-all",
                "border-slate-600 bg-slate-900",
                "peer-checked:border-blue-600 peer-checked:bg-blue-600",
                "peer-focus:ring-2 peer-focus:ring-blue-500",
                error && "border-red-500"
              )}
            >
              <Check
                className="h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
              />
            </div>
          </div>

          <div className="flex-1">
            {label && (
              <span className="block text-sm font-medium text-slate-200">
                {label}
              </span>
            )}

            {helperText && !error && (
              <p className="mt-1 text-sm text-slate-400">
                {helperText}
              </p>
            )}

            {error && (
              <p className="mt-1 text-sm text-red-500">
                {error}
              </p>
            )}
          </div>
        </label>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;