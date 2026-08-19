"use client";

import { useTheme } from "next-themes";
import { LiquidEther } from "@/components/ui/liquid-ether";
import { useOs } from "@/lib/os-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const etherDark = ["#c8f542", "#6b7344", "#1a220c"];
const etherLight = ["#56740e", "#8a8578", "#d4cbb8"];

export function EtherBackdrop() {
  const { booted } = useOs();
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();

  if (reduced || !booted) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <LiquidEther
        colors={resolvedTheme === "light" ? etherLight : etherDark}
        mouseForce={18}
        cursorSize={90}
        resolution={0.35}
        iterationsViscous={16}
        iterationsPoisson={16}
        autoSpeed={0.38}
        autoIntensity={1.7}
        autoResumeDelay={1600}
        className="h-full w-full opacity-50 dark:opacity-70"
      />
    </div>
  );
}
