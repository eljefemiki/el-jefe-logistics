import type { ReactNode } from "react";

interface FleetLayoutProps {
  children: ReactNode;
}

export default function FleetLayout({
  children,
}: FleetLayoutProps) {
  return children;
}