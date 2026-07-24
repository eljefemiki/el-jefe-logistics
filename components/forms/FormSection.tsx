"use client";

import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-slate-400">
            {description}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}