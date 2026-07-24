"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";
import Card from "./Card";
import Badge from "./Badge";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;

  subtitle?: string;

  description?: string;

  change?: string;

  trend?: "up" | "down" | "neutral";

  footer?: ReactNode;

  className?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
  description,
  change,
  trend = "neutral",
  footer,
  className,
}: StatCardProps) {
  const trendVariant = {
    up: "success",
    down: "danger",
    neutral: "info",
  } as const;

  return (
    <Card hover className={clsx("h-full", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          )}

          {description && (
            <p className="mt-2 text-sm text-slate-500">
              {description}
            </p>
          )}
        </div>

        {icon && (
          <div className="rounded-xl bg-slate-800 p-3 text-blue-400">
            {icon}
          </div>
        )}
      </div>

      {(change || footer) && (
        <div className="mt-6 flex items-center justify-between">
          {change ? (
            <Badge variant={trendVariant[trend]}>
              {change}
            </Badge>
          ) : (
            <span />
          )}

          {footer}
        </div>
      )}
    </Card>
  );
}