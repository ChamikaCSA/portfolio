"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import SpecularButton, {
  type SpecularButtonProps,
} from "@/components/SpecularButton";

const ACTION =
  "h-9 px-4 py-2 font-mono text-[11px] font-normal tracking-[0.18em] uppercase shadow-[inset_0_1px_0_rgb(255_255_255/0.55)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.04),0_8px_24px_rgb(0_0_0/0.25)]";

export function OsSpecularButton({
  className,
  ...props
}: SpecularButtonProps) {
  const { resolvedTheme } = useTheme();
  const [tone, setTone] = useState({
    textColor: "#ebe6dc",
    lineColor: "#ff7a4a",
    baseColor: "#2a2a2e",
    tint: "#121214",
  });

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    setTone({
      textColor: styles.getPropertyValue("--fg").trim(),
      lineColor: styles.getPropertyValue("--flare").trim(),
      baseColor: styles.getPropertyValue("--line-strong").trim(),
      tint: styles.getPropertyValue("--wash").trim(),
    });
  }, [resolvedTheme]);

  return (
    <SpecularButton
      size="sm"
      radius={16}
      blur={12}
      tintOpacity={0.94}
      intensity={1.15}
      thickness={1.1}
      {...tone}
      className={className ? `${ACTION} ${className}` : ACTION}
      {...props}
    />
  );
}
