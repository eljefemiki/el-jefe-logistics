import { HTMLAttributes, ReactNode } from "react";
import Container from "./Container";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export default function Section({
  children,
  className = "",
  ...props
}: SectionProps) {
  return (
    <section className={`py-24 ${className}`} {...props}>
      <Container>
        {children}
      </Container>
    </section>
  );
}
