"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, type Transition } from "motion/react";
import { APP_SCROLL_ID, titleForApp } from "@/lib/apps";
import { useOs } from "@/lib/os-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import { OsLabel } from "@/components/fx/OsLabel";

const MENUBAR = 48;
const RADIUS = 21.6;
const MIN_W = 360;
const MIN_H = 280;
const TITLE_KEEP = 80;

const FRAME: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 34,
  mass: 0.9,
};

const ENTER: Transition = {
  type: "spring",
  stiffness: 440,
  damping: 32,
  mass: 0.85,
};

const LEAVE: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 40,
  mass: 0.75,
};

const STAGE = {
  open: { opacity: 1 },
  close: { opacity: 0 },
} as const;

type Rect = { x: number; y: number; w: number; h: number };
type Size = { w: number; h: number };
type Edge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const HANDLES: { edge: Edge; className: string }[] = [
  { edge: "n", className: "inset-x-2 top-0 h-1.5 cursor-n-resize" },
  { edge: "s", className: "inset-x-2 bottom-0 h-1.5 cursor-s-resize" },
  { edge: "e", className: "inset-y-2 right-0 w-1.5 cursor-e-resize" },
  { edge: "w", className: "inset-y-2 left-0 w-1.5 cursor-w-resize" },
  { edge: "ne", className: "top-0 right-0 size-3 cursor-nesw-resize" },
  { edge: "nw", className: "top-0 left-0 size-3 cursor-nwse-resize" },
  { edge: "se", className: "right-0 bottom-0 size-3 cursor-nwse-resize" },
  { edge: "sw", className: "bottom-0 left-0 size-3 cursor-nesw-resize" },
];

function useWindowInsets() {
  const [gutter, setGutter] = useState(8);
  const [dock, setDock] = useState(104);
  const [menubar, setMenubar] = useState(MENUBAR);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:absolute;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)";
    document.body.appendChild(probe);

    const sync = () => {
      setGutter(mq.matches ? 12 : 8);
      const styles = getComputedStyle(probe);
      const safeTop = parseFloat(styles.paddingTop) || 0;
      const safeBot = parseFloat(styles.paddingBottom) || 0;
      setMenubar(MENUBAR + safeTop);
      setDock(Math.max(104, 84 + safeBot));
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

  return { gutter, dock, menubar };
}

function useStageSize(menubar: number) {
  const [size, setSize] = useState<Size>({ w: 1024, h: 768 });

  useLayoutEffect(() => {
    const sync = () =>
      setSize({
        w: window.innerWidth,
        h: window.innerHeight - menubar,
      });
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [menubar]);

  return size;
}

function defaultRect(stage: Size, gutter: number, dock: number): Rect {
  return {
    x: gutter,
    y: 0,
    w: Math.max(MIN_W, stage.w - gutter * 2),
    h: Math.max(MIN_H, stage.h - dock),
  };
}

function clampRect(rect: Rect, stage: Size): Rect {
  const w = Math.min(Math.max(MIN_W, rect.w), stage.w);
  const h = Math.min(Math.max(MIN_H, rect.h), stage.h);
  const x = Math.min(Math.max(rect.x, 80 - w), stage.w - TITLE_KEEP);
  const y = Math.min(Math.max(rect.y, 0), Math.max(0, stage.h - 40));
  return { x, y, w, h };
}

function applyResize(
  edge: Edge,
  start: Rect,
  dx: number,
  dy: number,
  stage: Size,
): Rect {
  let { x, y, w, h } = start;

  if (edge.includes("e")) w = start.w + dx;
  if (edge.includes("s")) h = start.h + dy;
  if (edge.includes("w")) {
    w = start.w - dx;
    x = start.x + dx;
  }
  if (edge.includes("n")) {
    h = start.h - dy;
    y = start.y + dy;
  }

  if (w < MIN_W) {
    if (edge.includes("w")) x = start.x + start.w - MIN_W;
    w = MIN_W;
  }
  if (h < MIN_H) {
    if (edge.includes("n")) y = start.y + start.h - MIN_H;
    h = MIN_H;
  }

  if (x < 0) {
    if (edge.includes("w")) w += x;
    x = 0;
  }
  if (y < 0) {
    if (edge.includes("n")) h += y;
    y = 0;
  }
  if (x + w > stage.w) w = stage.w - x;
  if (y + h > stage.h) h = stage.h - y;

  return clampRect({ x, y, w, h }, stage);
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
        disabled={fullScreen}
        onClick={fullScreen ? undefined : onClose}
        className={cn(
          light,
          fullScreen
            ? "cursor-default bg-[#dedede] shadow-[inset_0_0_0_0.5px_#c6c6c6] dark:bg-[#3d3d3f] dark:shadow-[inset_0_0_0_0.5px_#4a4a4c]"
            : "cursor-pointer bg-[#f5be4f] shadow-[inset_0_0_0_0.5px_#e1a73e]",
        )}
      >
        {fullScreen ? null : (
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
        )}
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
  const { app, setApp, fullScreen, setFullScreen } = useOs();
  const title = titleForApp(app);
  const [phase, setPhase] = useState<"open" | "close">("open");
  const [rect, setRect] = useState<Rect | null>(null);
  const [live, setLive] = useState(false);
  const dismissed = useRef(false);
  const drag = useRef<{
    pointer: number;
    startX: number;
    startY: number;
    origin: Rect;
    edge?: Edge;
  } | null>(null);
  const stopDrag = useRef<(() => void) | null>(null);
  const { gutter, dock, menubar } = useWindowInsets();
  const stage = useStageSize(menubar);
  const stageRef = useRef(stage);
  stageRef.current = stage;

  const frame = rect ?? defaultRect(stage, gutter, dock);

  useEffect(
    () => () => {
      stopDrag.current?.();
    },
    [],
  );

  useEffect(() => {
    if (fullScreen || live) return;
    setRect((current) =>
      current ? clampRect(current, stage) : current,
    );
  }, [fullScreen, live, stage]);

  const dismiss = () => {
    if (dismissed.current) return;
    setPhase("close");
  };

  const beginMove = (event: React.PointerEvent, edge?: Edge) => {
    if (fullScreen || event.button !== 0) return;
    event.preventDefault();
    const origin = frame;
    const pointer = event.pointerId;
    drag.current = {
      pointer,
      startX: event.clientX,
      startY: event.clientY,
      origin,
      edge,
    };
    setLive(true);
    setRect(origin);

    const onMove = (next: PointerEvent) => {
      const session = drag.current;
      if (!session || next.pointerId !== session.pointer) return;
      const nextStage = stageRef.current;
      const dx = next.clientX - session.startX;
      const dy = next.clientY - session.startY;
      if (session.edge) {
        setRect(applyResize(session.edge, session.origin, dx, dy, nextStage));
        return;
      }
      setRect(
        clampRect(
          {
            ...session.origin,
            x: session.origin.x + dx,
            y: session.origin.y + dy,
          },
          nextStage,
        ),
      );
    };

    const onUp = (next: PointerEvent) => {
      if (next.pointerId !== pointer) return;
      drag.current = null;
      stopDrag.current?.();
      setLive(false);
    };

    stopDrag.current = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      stopDrag.current = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const leaving = phase !== "open";
  const instant = reduced ? { duration: 0 } : undefined;
  const box = fullScreen
    ? { x: 0, y: 0, w: stage.w, h: stage.h }
    : frame;

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-20"
      style={{ top: menubar }}
      variants={STAGE}
      initial={reduced ? false : { opacity: 0 }}
      animate={reduced && leaving ? { opacity: 0 } : phase}
      exit="close"
      transition={
        reduced ? { duration: 0 } : leaving ? LEAVE : ENTER
      }
      onAnimationComplete={() => {
        if (phase === "open" || dismissed.current) return;
        dismissed.current = true;
        setApp("home");
      }}
    >
      <motion.div
        className={cn(
          "absolute flex flex-col overflow-hidden",
          fullScreen ? "bg-surface" : "glass",
          leaving ? "pointer-events-none" : "pointer-events-auto",
          live && "select-none",
        )}
        transformTemplate={() => "none"}
        initial={false}
        animate={{
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          borderRadius: fullScreen ? 0 : RADIUS,
          boxShadow: fullScreen
            ? "0 0 0 0 rgb(0 0 0 / 0), inset 0 0 0 0px var(--line)"
            : "0 24px 80px rgb(0 0 0 / 0.22), inset 0 0 0 1px var(--line)",
        }}
        exit={reduced ? undefined : { borderRadius: RADIUS }}
        transition={live ? { duration: 0 } : (instant ?? FRAME)}
        style={
          fullScreen
            ? { backgroundColor: "var(--surface)" }
            : undefined
        }
      >
        <header
          className={cn(
            "flex h-10 shrink-0 items-center gap-3 border-b border-line px-3",
            !fullScreen && "cursor-grab touch-none active:cursor-grabbing",
          )}
          onDoubleClick={(event) => {
            if ((event.target as HTMLElement).closest("button")) return;
            setFullScreen((open) => !open);
          }}
          onPointerDown={(event) => {
            if ((event.target as HTMLElement).closest("button")) return;
            beginMove(event);
          }}
        >
          <TrafficLights
            fullScreen={fullScreen}
            onClose={dismiss}
            onToggleFullScreen={() => setFullScreen((open) => !open)}
          />
          <OsLabel
            key={title}
            text={title}
            className="min-w-0 flex-1 truncate text-center"
          />
          <span className="w-13 shrink-0" aria-hidden />
        </header>
        <div
          id={APP_SCROLL_ID}
          className={cn(
            "min-h-0 flex-1 overscroll-contain",
            app === "missing"
              ? "flex flex-col overflow-hidden"
              : "overflow-x-hidden overflow-y-auto",
            fullScreen &&
              app !== "missing" &&
              "pb-[max(6.5rem,calc(5.25rem+env(safe-area-inset-bottom)))]",
          )}
        >
          {children}
        </div>
        {!fullScreen &&
          HANDLES.map((handle) => (
            <div
              key={handle.edge}
              aria-hidden
              className={cn("absolute z-10 touch-none", handle.className)}
              onPointerDown={(event) => beginMove(event, handle.edge)}
            />
          ))}
      </motion.div>
    </motion.div>
  );
}
