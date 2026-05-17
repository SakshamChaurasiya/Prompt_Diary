"use client";

import ScrollReveal from "@/components/ScrollReveal";

interface ScrollRevealSectionProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left";
  className?: string;
  style?: React.CSSProperties;
}

export default function ScrollRevealSection({
  children,
  delay = 0,
  direction = "up",
  className = "",
  style = {},
}: ScrollRevealSectionProps) {
  return (
    <ScrollReveal delay={delay} direction={direction} className={className} style={style}>
      {children}
    </ScrollReveal>
  );
}
