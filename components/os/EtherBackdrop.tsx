"use client";

import { useRef } from "react";
import { useTheme } from "next-themes";
import { gsap, useGSAP } from "@/lib/gsap";
import { LiquidEther } from "@/components/ui/liquid-ether";
import { useOs } from "@/lib/os-context";
import { useOsSettings } from "@/lib/os-settings";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const etherDark = ["#c8f542", "#6b7344", "#1a220c"];
const etherLight = ["#56740e", "#8a8578", "#d4cbb8"];

export function EtherBackdrop() {
  const { booted } = useOs();
  const { wallpaper } = useOsSettings();
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const wrapRef = useRef<HTMLDivElement>(null);
  const show = wallpaper && !reduced && booted;

  useGSAP(
    () => {
      if (!show || !wrapRef.current) return;
      gsap.fromTo(
        wrapRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.1, ease: "power2.out" },
      );
    },
    { dependencies: [show] },
  );

  if (!show) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    >
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
