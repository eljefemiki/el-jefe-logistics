"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className,
      id,
      required,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-semibold text-slate-200"
          >
            {label}

            {required && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            className={clsx(
              "w-full rounded-xl border bg-slate-900 px-4 py-3 text-white outline-none transition-all",
              "border-slate-700",
              "placeholder:text-slate-500",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error &&
                "border-red-500 focus:border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-sm text-red-500">
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
);

Input.displayName = "Input";

export default Input;