import type { ReactNode } from "react";

interface DispatchLayoutProps {
  children: ReactNode;
}

export default function DispatchLayout({
  children,
}: DispatchLayoutProps) {
  return children;
}
