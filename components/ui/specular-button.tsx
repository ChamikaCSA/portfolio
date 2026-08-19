"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import SpecularButton, {
  type SpecularButtonProps,
} from "@/components/SpecularButton";

const ACTION =
  "h-9 px-4 py-2 font-mono text-[11px] font-normal tracking-[0.18em] uppercase";

export function OsSpecularButton({
  className,
  ...props
}: SpecularButtonProps) {
  const { resolvedTheme } = useTheme();
  const [tone, setTone] = useState({
    textColor: "#ebe6dc",
    lineColor: "#c8f542",
    baseColor: "#2a2a2e",
    tint: "#0c0c0e",
  });

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    setTone({
      textColor: styles.getPropertyValue("--fg").trim(),
      lineColor: styles.getPropertyValue("--accent").trim(),
      baseColor: styles.getPropertyValue("--line-strong").trim(),
      tint: styles.getPropertyValue("--surface").trim(),
    });
  }, [resolvedTheme]);

  return (
    <SpecularButton
      size="sm"
      radius={16}
      blur={12}
      tintOpacity={0.55}
      intensity={1.15}
      thickness={1.1}
      {...tone}
      className={className ? `${ACTION} ${className}` : ACTION}
      {...props}
    />
  );
}
