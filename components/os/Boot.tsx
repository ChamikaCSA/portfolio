"use client";

import { useEffect, useRef, useState } from "react";
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

export function Boot() {
  const { booted, finishBoot } = useOs();
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const barRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(reduced);
  const [visible, setVisible] = useState(reduced ? LINES.length : 0);
  const [tint, setTint] = useState("#c8f542");
  const [crt, setCrt] = useState(false);

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
    if (booted || !ready) return;

    const enter = () => finishBoot();
    window.addEventListener("keydown", enter);
    window.addEventListener("pointerdown", enter);

    return () => {
      window.removeEventListener("keydown", enter);
      window.removeEventListener("pointerdown", enter);
    };
  }, [booted, ready, finishBoot]);

  const progress = Math.min(1, visible / LINES.length);
  const shown = LINES.slice(0, visible);

  return (
    <AnimatePresence>
      {!booted ? (
        <motion.div
          className="fixed inset-0 z-50 overflow-hidden bg-bg text-fg"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {crt ? (
            <div className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-[0.26]">
              <FaultyTerminal
                className="h-full w-full [&_canvas]:absolute [&_canvas]:inset-0 [&_canvas]:h-full [&_canvas]:w-full"
                tint={tint}
                brightness={resolvedTheme === "light" ? 0.48 : 0.38}
                scale={1.4}
                digitSize={1.4}
                scanlineIntensity={0.45}
                glitchAmount={0.45}
                flickerAmount={0.35}
                noiseAmp={0.55}
                curvature={0.06}
                chromaticAberration={0.4}
                mouseReact
                mouseStrength={0.18}
                pageLoadAnimation
                dither={1}
              />
            </div>
          ) : null}

          <div className="os-scan pointer-events-none absolute inset-0 opacity-25 dark:opacity-20" />

          <div className="relative z-10 flex h-full flex-col px-5 py-5 sm:px-8 sm:py-7">
            <header className="flex items-baseline justify-between gap-4 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
              <span>{profile.osName} / bios</span>
              <span>ver {BIOS_VERSION}</span>
            </header>

            <div className="mt-8 min-h-0 flex-1 overflow-hidden">
              <ul className="max-w-xl space-y-1 font-mono text-[11px] leading-relaxed tracking-[0.08em] sm:text-[12px]">
                {shown.map((line, index) => (
                  <li key={`${line.left}-${index}`} className="flex justify-between gap-6">
                    {line.left ? (
                      <>
                        <span
                          className={line.tone === "fg" ? "text-fg" : "text-muted"}
                        >
                          {line.left}
                          {line.count != null ? (
                            <>
                              {" "}
                              <NumberTicker
                                value={line.count}
                                className="font-mono text-[11px] tracking-[0.08em] text-muted sm:text-[12px]"
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
                <p className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
                  {ready ? (
                    <AnimatedShinyText className="mx-0 max-w-none font-mono text-[10px] tracking-[0.18em] text-accent uppercase">
                      <span className="inline-flex items-center">
                        press any key to continue
                        <span className="caret" />
                      </span>
                    </AnimatedShinyText>
                  ) : (
                    <>init {Math.round(progress * 100)}%</>
                  )}
                </p>
              </div>
            </footer>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
