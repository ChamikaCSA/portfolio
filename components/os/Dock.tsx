"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { DOCK_APPS, isProjectsApp } from "@/lib/apps";
import { useOs } from "@/lib/os-context";
import { useOsSettings } from "@/lib/os-settings";
import Dock from "@/components/Dock";
import { APP_ICONS } from "@/components/os/app-icons";
import { cn } from "@/lib/utils";
import { useFinePointer, useReducedMotion } from "@/lib/use-reduced-motion";

export function OsDock() {
  const { app, setApp } = useOs();
  const { dockMag } = useOsSettings();
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [bounce, setBounce] = useState<{ id: string; tick: number } | null>(
    null,
  );

  const playBounce = (id: string) => {
    if (reduced) return;
    setBounce({ id, tick: Date.now() });
  };

  const scale = !fine || reduced || !dockMag;
  const items = DOCK_APPS.map((item) => {
    const Icon = APP_ICONS[item.id];
    const active =
      app === item.id ||
        (item.id === "projects" && isProjectsApp(app));

    return {
      icon: (
        <motion.span
          key={bounce?.id === item.id ? bounce.tick : item.id}
          className="flex size-1/2 items-center justify-center"
          initial={{ y: 0 }}
          animate={
            bounce?.id === item.id
              ? { y: [0, -22, 0, -12, 0, -5, 0] }
              : { y: 0 }
          }
          transition={
            bounce?.id === item.id
              ? {
                  duration: 0.9,
                  times: [0, 0.18, 0.38, 0.54, 0.7, 0.86, 1],
                  ease: [
                    "easeOut",
                    "easeIn",
                    "easeOut",
                    "easeIn",
                    "easeOut",
                    "easeIn",
                  ],
                }
              : { duration: 0 }
          }
        >
          <Icon className="size-full" strokeWidth={1.75} />
        </motion.span>
      ),
      label: (
        <>
          {item.label}
          <span className="ml-1.5 text-dim">{item.shortcut}</span>
        </>
      ),
      ariaLabel: item.label,
      onClick: () => {
        playBounce(item.id);
        setApp(item.id);
      },
      className: cn(
        "cursor-pointer text-fg/80 transition-colors",
        active && "text-fg",
      ),
      separator: item.id === "contact",
      active,
    };
  });

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center overflow-visible px-3 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-4"
    >
      <div className="pointer-events-auto">
        <Dock
          items={items}
          baseItemSize={48}
          magnification={scale ? 48 : 72}
          distance={140}
          className="glass border-line shadow-[0_18px_50px_rgb(0_0_0/0.18),inset_0_1px_0_rgb(255_255_255/0.12)] dark:shadow-[0_18px_50px_rgb(0_0_0/0.55),inset_0_1px_0_rgb(255_255_255/0.08)]"
        />
      </div>
    </nav>
  );
}
