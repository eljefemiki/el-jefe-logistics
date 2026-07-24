"use client";

import Image from "next/image";
import { clsx } from "clsx";

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "away" | "busy";
  rounded?: boolean;
  className?: string;
}

export default function Avatar({
  src,
  alt,
  name = "",
  size = "md",
  status,
  rounded = true,
  className,
}: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizes = {
    xs: "h-8 w-8 text-xs",
    sm: "h-10 w-10 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-16 w-16 text-lg",
    xl: "h-24 w-24 text-2xl",
  };

  const statusColours = {
    online: "bg-emerald-500",
    offline: "bg-slate-500",
    away: "bg-amber-400",
    busy: "bg-red-500",
  };

  return (
    <div className="relative inline-flex">
      <div
        className={clsx(
          "relative overflow-hidden bg-slate-800 text-white flex items-center justify-center font-bold border border-slate-700",
          rounded ? "rounded-full" : "rounded-xl",
          sizes[size],
          className
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt ?? name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          initials || "?"
        )}
      </div>

      {status && (
        <span
          className={clsx(
            "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-slate-900",
            statusColours[status]
          )}
        />
      )}
    </div>
  );
}