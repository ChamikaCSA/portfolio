"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Transition } from "motion/react";
import { APP_SCROLL_ID, osLabelForSurface } from "@/lib/surfaces";
import { useOs } from "@/lib/os-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import { OsLabel } from "@/components/fx/OsLabel";

const MENUBAR = 48;
const RADIUS = 21.6;

const TAHOE: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 34,
  mass: 0.9,
};

const TAHOE_OPEN: Transition = {
  type: "spring",
  stiffness: 440,
  damping: 32,
  mass: 0.85,
};

const TAHOE_CLOSE: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 40,
  mass: 0.75,
};

const STAGE = {
  open: { opacity: 1, scale: 1, y: 0 },
  close: { opacity: 0, scale: 0.9, y: 16 },
} as const;

function useTahoeInsets() {
  const [gutter, setGutter] = useState(8);
  const [dock, setDock] = useState(88);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:absolute;visibility:hidden;pointer-events:none;padding-bottom:env(safe-area-inset-bottom)";
    document.body.appendChild(probe);

    const sync = () => {
      setGutter(mq.matches ? 12 : 8);
      const safe = parseFloat(getComputedStyle(probe).paddingBottom) || 0;
      setDock(Math.max(88, 68 + safe));
    };

    sync();
    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
      probe.remove();
    };
  }, []);

  return { gutter, dock };
}

function ZoomGlyph({ fullScreen }: { fullScreen: boolean }) {
  if (fullScreen) {
    return (
      <svg viewBox="0 0 12 12" aria-hidden>
        <path d="M4.85 5.85 1.6 2.6H4.85v3.25Z" fill="currentColor" />
        <path d="M7.15 6.15 10.4 9.4H7.15V6.15Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 12 12" aria-hidden>
      <path d="M2.15 2.15h3.45V5.6L2.15 2.15Z" fill="currentColor" />
      <path d="M9.85 9.85H6.4V6.4l3.45 3.45Z" fill="currentColor" />
    </svg>
  );
}

function TrafficLights({
  fullScreen,
  onClose,
  onToggleFullScreen,
}: {
  fullScreen: boolean;
  onClose: () => void;
  onToggleFullScreen: () => void;
}) {
  const light = "relative size-3 rounded-full outline-none";
  const glyph =
    "pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-75 group-hover/lights:opacity-100 group-focus-within/lights:opacity-100 [&_svg]:size-[6px]";

  return (
    <div className="group/lights flex items-center gap-2">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className={cn(
          light,
          "cursor-pointer bg-[#ed6a5e] shadow-[inset_0_0_0_0.5px_#e24b41]",
        )}
      >
        <span className={cn(glyph, "text-[#4d0000]")}>
          <svg viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M3.25 3.25 8.75 8.75M8.75 3.25 3.25 8.75"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
      <button
        type="button"
        aria-label="Minimize"
        onClick={onClose}
        className={cn(
          light,
          "cursor-pointer bg-[#f5be4f] shadow-[inset_0_0_0_0.5px_#e1a73e]",
        )}
      >
        <span className={cn(glyph, "text-[#995700]")}>
          <svg viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M2.6 6h6.8"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
      <button
        type="button"
        aria-label={fullScreen ? "Exit full screen" : "Enter full screen"}
        onClick={onToggleFullScreen}
        className={cn(
          light,
          "cursor-pointer bg-[#62c554] shadow-[inset_0_0_0_0.5px_#2dac2f]",
        )}
      >
        <span className={cn(glyph, "text-[#0b5a12]")}>
          <ZoomGlyph fullScreen={fullScreen} />
        </span>
      </button>
    </div>
  );
}

export function AppWindow({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const { surface, setSurface } = useOs();
  const title = osLabelForSurface(surface);
  const [fullScreen, setFullScreen] = useState(true);
  const [phase, setPhase] = useState<"open" | "close">("open");
  const dismissed = useRef(false);
  const { gutter, dock } = useTahoeInsets();

  const dismiss = () => {
    if (dismissed.current) return;
    setPhase("close");
  };

  const leaving = phase !== "open";
  const instant = reduced ? { duration: 0 } : undefined;

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-20 origin-bottom will-change-transform"
      style={{ top: MENUBAR }}
      variants={STAGE}
      initial={reduced ? false : { opacity: 0, scale: 0.78, y: 48 }}
      animate={reduced && leaving ? { opacity: 0 } : phase}
      exit="close"
      transition={
        reduced ? { duration: 0 } : leaving ? TAHOE_CLOSE : TAHOE_OPEN
      }
      onAnimationComplete={() => {
        if (phase === "open" || dismissed.current) return;
        dismissed.current = true;
        setSurface("home");
      }}
    >
      <motion.div
        className={cn(
          "absolute flex flex-col overflow-hidden bg-surface",
          leaving ? "pointer-events-none" : "pointer-events-auto",
        )}
        initial={false}
        animate={{
          top: 0,
          left: fullScreen ? 0 : gutter,
          right: fullScreen ? 0 : gutter,
          bottom: fullScreen ? 0 : dock,
          borderRadius: fullScreen ? 0 : RADIUS,
          boxShadow: fullScreen
            ? "0 0 0 0 rgb(0 0 0 / 0), inset 0 0 0 0px var(--line)"
            : "0 24px 80px rgb(0 0 0 / 0.22), inset 0 0 0 1px var(--line)",
        }}
        exit={reduced ? undefined : { borderRadius: RADIUS }}
        transition={instant ?? TAHOE}
        style={{
          backgroundColor: fullScreen
            ? "var(--surface)"
            : "color-mix(in srgb, var(--surface) 92%, transparent)",
        }}
      >
        <header className="flex h-10 shrink-0 items-center gap-3 border-b border-line px-3">
          <TrafficLights
            fullScreen={fullScreen}
            onClose={dismiss}
            onToggleFullScreen={() => setFullScreen((open) => !open)}
          />
          <OsLabel
            key={title.text}
            text={title.text}
            tone={title.tone}
            className="min-w-0 flex-1 truncate text-center"
          />
          <span className="w-[52px] shrink-0" aria-hidden />
        </header>
        <div
          id={APP_SCROLL_ID}
          className={cn(
            "min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain",
            fullScreen &&
              "pb-[max(5.5rem,calc(4.25rem+env(safe-area-inset-bottom)))]",
          )}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
