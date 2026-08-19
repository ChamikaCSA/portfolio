"use client";

import DecryptedText from "@/components/DecryptedText";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

export function OsLabel({
  text,
  className,
  tone = "muted",
}: {
  text: string;
  className?: string;
  tone?: "muted" | "accent";
}) {
  const reduced = useReducedMotion();
  const color = tone === "accent" ? "text-accent" : "text-muted";
  const classes = cn(
    "font-mono text-[11px] tracking-[0.22em] uppercase",
    color,
    className,
  );

  if (reduced) return <p className={classes}>{text}</p>;

  return (
    <p className={classes}>
      <DecryptedText
        text={text}
        animateOn="view"
        sequential
        speed={22}
        characters="01<>_|/"
        className={color}
        encryptedClassName="text-dim"
      />
    </p>
  );
}
