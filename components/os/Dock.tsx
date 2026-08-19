"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  House,
  Layers,
  PenLine,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { DOCK_SURFACES, hrefForSurface, isWorkSurface } from "@/lib/surfaces";
import { useOs } from "@/lib/os-context";
import { Dock, DockIcon } from "@/components/ui/dock";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useFinePointer, useReducedMotion } from "@/lib/use-reduced-motion";

const ICONS: Record<string, LucideIcon> = {
  home: House,
  work: Briefcase,
  log: ScrollText,
  stack: Layers,
  compose: PenLine,
};

export function OsDock() {
  const { surface } = useOs();
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [bounce, setBounce] = useState<{ id: string; tick: number } | null>(
    null,
  );

  const playBounce = (id: string) => {
    if (reduced) return;
    setBounce({ id, tick: Date.now() });
  };

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center overflow-visible px-3 pb-[max(0.9rem,env(safe-area-inset-bottom))] pt-16"
    >
      <div className="pointer-events-auto">
        <Dock
          iconSize={42}
          iconMagnification={72}
          iconDistance={140}
          direction="bottom"
          disableMagnification={!fine || reduced}
          className="border-line bg-surface shadow-[0_18px_50px_rgb(0_0_0/0.18),inset_0_1px_0_rgb(255_255_255/0.12)] dark:shadow-[0_18px_50px_rgb(0_0_0/0.55),inset_0_1px_0_rgb(255_255_255/0.08)]"
        >
          {DOCK_SURFACES.flatMap((item) => {
            const Icon = ICONS[item.id];
            const active =
              surface === item.id || (item.id === "work" && isWorkSurface(surface));

            const icon = (
              <DockIcon key={item.id}>
                <Tooltip delayDuration={120}>
                  <TooltipTrigger asChild>
                    <Link
                      href={hrefForSurface(item.id)}
                      aria-label={item.label}
                      aria-current={active ? "page" : undefined}
                      onClick={() => playBounce(item.id)}
                      className={cn(
                        "relative flex size-full items-center justify-center rounded-full text-fg/80 transition-colors",
                        active && "text-fg",
                      )}
                    >
                      <motion.span
                        key={bounce?.id === item.id ? bounce.tick : item.id}
                        className="flex size-[52%] items-center justify-center"
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
                        <Icon
                          className="size-full"
                          strokeWidth={active ? 2.15 : 1.75}
                        />
                      </motion.span>
                      <span
                        className={cn(
                          "absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full transition-opacity duration-200",
                          active
                            ? "bg-accent opacity-100 shadow-[0_0_8px_var(--accent)]"
                            : "opacity-0",
                        )}
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {item.label}
                    <span className="ml-1.5 text-dim">{item.shortcut}</span>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            );

            if (item.id !== "compose") return [icon];

            return [
              <span
                key="compose-divider"
                aria-hidden
                className="mx-1 hidden h-7 w-px self-center bg-fg/15 sm:block"
              />,
              icon,
            ];
          })}
        </Dock>
      </div>
    </nav>
  );
}
