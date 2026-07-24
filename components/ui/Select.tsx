"use client";

import {
  SelectHTMLAttributes,
  useId,
} from "react";

import { clsx } from "clsx";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  placeholder?: string;
  options?: SelectOption[];
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export default function Select({
  label,
  placeholder,
  options = [],
  error,
  helperText,
  containerClassName,
  className,
  id,
  name,
  children,
  disabled,
  ...props
}: SelectProps) {
  const generatedId = useId();

  const selectId =
    id ??
    name ??
    generatedId;

  return (
    <div
      className={clsx(
        "w-full",
        containerClassName
      )}
    >
      {label && (
        <label
          htmlFor={selectId}
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          {label}
        </label>
      )}

      <select
        id={selectId}
        name={name}
        disabled={disabled}
        className={clsx(
          "w-full rounded-lg border bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition",
          "border-slate-700",
          "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error &&
            "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}

        {children}
      </select>

      {error ? (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-2 text-sm text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}