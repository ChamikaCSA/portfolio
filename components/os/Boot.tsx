"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { BIOS_VERSION } from "@/lib/bios";
import { BOOT_LINES, type BootLine } from "@/content/boot";
import { profile } from "@/content/profile";
import { gsap, useGSAP } from "@/lib/gsap";
import { useOs } from "@/lib/os-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { NumberTicker } from "@/components/ui/number-ticker";
import FaultyTerminal from "@/components/FaultyTerminal";

const LINES: BootLine[] = BOOT_LINES;

function isSkipKey(event: KeyboardEvent) {
  if (event.metaKey || event.ctrlKey || event.altKey) return false;
  return !["Shift", "Meta", "Control", "Alt", "CapsLock", "Tab"].includes(
    event.key,
  );
}

export function Boot() {
  const { booted, finishBoot } = useOs();
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const barRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(0);
  const [tint, setTint] = useState("#c8f542");
  const [crt, setCrt] = useState(false);

  useLayoutEffect(() => {
    if (reduced && !booted) finishBoot();
  }, [reduced, booted, finishBoot]);

  useEffect(() => {
    setCrt(!reduced);
  }, [reduced]);

  useEffect(() => {
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();
    if (accent.startsWith("#")) setTint(accent);
  }, [resolvedTheme]);

  useGSAP(
    () => {
      if (booted || reduced) {
        setVisible(LINES.length);
        setReady(true);
        if (barRef.current) gsap.set(barRef.current, { width: "100%" });
        return;
      }

      setVisible(0);
      setReady(false);
      if (barRef.current) gsap.set(barRef.current, { width: "0%" });

      const tl = gsap.timeline({
        onComplete: () => setReady(true),
      });

      let at = 0;
      LINES.forEach((line, index) => {
        at += line.delay / 1000;
        tl.call(() => setVisible(index + 1), undefined, at);
      });

      if (barRef.current) {
        tl.to(barRef.current, { width: "100%", duration: at, ease: "none" }, 0);
      }
    },
    { dependencies: [booted, reduced] },
  );

  useEffect(() => {
    const node = logRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [visible]);

  useEffect(() => {
    if (booted || reduced) return;

    const onKey = (event: KeyboardEvent) => {
      if (!isSkipKey(event)) return;
      event.preventDefault();
      finishBoot();
    };
    const onPointer = () => finishBoot();

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [booted, reduced, finishBoot]);

  if (reduced) return null;

  const progress = Math.min(1, visible / LINES.length);
  const shown = LINES.slice(0, visible);

  return (
    <AnimatePresence>
      {!booted ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="boot-title"
          className="fixed inset-0 z-50 overflow-hidden bg-bg text-fg"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {crt ? (
            <div className="pointer-events-none absolute inset-0 opacity-[0.16] dark:opacity-[0.22]">
              <FaultyTerminal
                className="h-full w-full [&_canvas]:absolute [&_canvas]:inset-0 [&_canvas]:h-full [&_canvas]:w-full"
                tint={tint}
                brightness={resolvedTheme === "light" ? 0.42 : 0.36}
                scale={1.4}
                digitSize={1.4}
                scanlineIntensity={0.4}
                glitchAmount={0.4}
                flickerAmount={0.3}
                noiseAmp={0.5}
                curvature={0.06}
                chromaticAberration={0.35}
                mouseReact
                mouseStrength={0.18}
                pageLoadAnimation
                dither={1}
              />
            </div>
          ) : null}

          <div className="os-scan pointer-events-none absolute inset-0 opacity-20 dark:opacity-[0.16]" />

          <div className="relative z-10 flex h-full flex-col px-5 py-5 sm:px-8 sm:py-7">
            <header className="flex items-baseline justify-between gap-4 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
              <h2 id="boot-title">{profile.osName} / bios</h2>
              <span>ver {BIOS_VERSION}</span>
            </header>

            <div
              ref={logRef}
              className="mt-8 min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain"
            >
              <ul className="max-w-xl space-y-1 font-mono text-[12px] leading-relaxed tracking-[0.06em] sm:text-[13px]">
                {shown.map((line, index) => (
                  <li
                    key={`${line.left}-${index}`}
                    className="flex justify-between gap-6"
                  >
                    {line.left ? (
                      <>
                        <span
                          className={
                            line.tone === "fg" ? "text-fg" : "text-muted"
                          }
                        >
                          {line.left}
                          {line.count != null ? (
                            <>
                              {" "}
                              <NumberTicker
                                value={line.count}
                                className="font-mono text-[12px] tracking-[0.06em] text-muted sm:text-[13px]"
                              />
                              {line.countSuffix ?? ""}
                            </>
                          ) : null}
                        </span>
                        {line.right ? (
                          <span className="shrink-0 text-accent">
                            [{line.right}]
                          </span>
                        ) : null}
                      </>
                    ) : (
                      <span className="h-4" />
                    )}
                  </li>
                ))}
                {!ready ? (
                  <li>
                    <span className="caret" />
                  </li>
                ) : null}
              </ul>
            </div>

            <footer className="mt-6 space-y-3">
              <div className="h-px w-full overflow-hidden bg-line">
                <div ref={barRef} className="h-full w-0 bg-accent" />
              </div>
              <div className="flex items-end justify-between gap-4">
                {ready ? (
                  <button
                    type="button"
                    onClick={finishBoot}
                    className="cursor-pointer text-left"
                  >
                    <span className="inline-flex items-center">
                      <AnimatedShinyText className="mx-0 max-w-none font-mono text-[10px] tracking-[0.18em] text-accent uppercase">
                        any key or tap to continue
                      </AnimatedShinyText>
                      <span className="caret" />
                    </span>
                  </button>
                ) : (
                  <>
                    <p className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
                      init {Math.round(progress * 100)}%
                    </p>
                    <button
                      type="button"
                      onClick={finishBoot}
                      className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase transition-colors hover:text-accent"
                    >
                      skip
                    </button>
                  </>
                )}
              </div>
            </footer>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
