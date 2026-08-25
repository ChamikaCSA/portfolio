"use client";

import DecryptedText from "@/components/DecryptedText";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

export function OsLabel({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const classes = cn(
    "font-mono text-[11px] tracking-[0.22em] text-muted uppercase",
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
        className="text-muted"
        encryptedClassName="text-dim"
      />
    </p>
  );
}
