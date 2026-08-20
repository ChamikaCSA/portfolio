"use client";

import type { ReactNode } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export const STAGGER = 0.06;
export const STAGGER_DURATION = 0.45;
export const STAGGER_LEAD = 0.04;

export function Stagger({
  delay = 0,
  children,
  className,
  blur = true,
  inView = false,
}: {
  delay?: number;
  children: ReactNode;
  className?: string;
  blur?: boolean;
  inView?: boolean;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return className ? <div className={className}>{children}</div> : children;
  }

  return (
    <BlurFade
      delay={delay}
      inView={inView}
      duration={STAGGER_DURATION}
      offset={10}
      direction="up"
      blur={blur ? "6px" : "0px"}
      className={className}
    >
      {children}
    </BlurFade>
  );
}
