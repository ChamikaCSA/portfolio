"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { profile } from "@/content/profile";
import { stackFrameworks } from "@/content/stack";
import { useOs } from "@/lib/os-context";
import { Stagger, STAGGER } from "@/components/fx/Stagger";
import { SURFACE_WIDTH } from "@/lib/surfaces";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { MorphingText } from "@/components/ui/morphing-text";
import { ParticleText } from "@/components/ui/particle-text";
import { TextAnimate } from "@/components/ui/text-animate";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function Home() {
  const { setSurface, booted } = useOs();
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [ink, setInk] = useState({
    fg: "#ebe6dc",
    accent: "#c8f542",
  });

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const fg = styles.getPropertyValue("--fg").trim();
    const accent = styles.getPropertyValue("--accent").trim();
    if (fg && accent) setInk({ fg, accent });
  }, [resolvedTheme]);

  const ready = booted || reduced;

  return (
    <section
      className={cn(
        "relative flex h-full flex-col justify-end overflow-hidden pb-28 pt-20",
        SURFACE_WIDTH,
      )}
    >
      {ready ? (
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Stagger delay={STAGGER * 0}>
              <AnimatedGradientText
                speed={0.8}
                colorFrom="var(--accent)"
                colorTo="var(--fg)"
                className="font-mono text-[11px] tracking-[0.22em] uppercase"
              >
                {profile.role}
              </AnimatedGradientText>
            </Stagger>
            <Stagger delay={STAGGER * 2} blur={false}>
              <h1 className="relative z-10 mt-5 overflow-visible font-serif text-fg">
                <HomeName ink={ink} glow={resolvedTheme !== "light"} />
              </h1>
            </Stagger>
            <div className="mt-8 flex flex-wrap items-end gap-x-4 gap-y-2">
              {reduced ? (
                <span className="mb-1.5 font-mono text-[11px] tracking-[0.2em] text-dim uppercase">
                  shipping
                </span>
              ) : (
                <TextAnimate
                  as="span"
                  by="character"
                  animation="blurInUp"
                  delay={STAGGER * 4}
                  duration={0.45}
                  startOnView={false}
                  once
                  className="mb-1.5 font-mono text-[11px] tracking-[0.2em] text-dim uppercase"
                >
                  shipping
                </TextAnimate>
              )}
              {reduced ? (
                <span className="font-serif text-[clamp(2.5rem,7vw,4.5rem)] leading-none tracking-tight text-muted">
                  {stackFrameworks[0]}
                </span>
              ) : (
                <Stagger delay={STAGGER * 5}>
                  <MorphingText
                    texts={stackFrameworks}
                    className="mx-0 h-[1.15em] py-0 text-left font-serif text-[clamp(2.5rem,7vw,4.5rem)] font-normal tracking-tight text-muted lg:text-[clamp(2.5rem,7vw,4.5rem)]"
                  />
                </Stagger>
              )}
            </div>
          </div>

          <Stagger
            delay={STAGGER * 7}
            className="flex flex-col items-start lg:items-end lg:pb-3"
          >
            <InteractiveHoverButton
              type="button"
              onClick={() => setSurface("work")}
              className="h-11 rounded-2xl border border-line px-5 font-mono text-[11px] font-normal tracking-[0.2em] text-fg uppercase [&_svg]:size-3.5"
            >
              enter work
            </InteractiveHoverButton>
          </Stagger>
        </div>
      ) : null}
    </section>
  );
}

function HomeName({
  ink,
  glow,
}: {
  ink: { fg: string; accent: string };
  glow: boolean;
}) {
  return (
    <>
      <ParticleText
        text={profile.firstName}
        className="h-[clamp(3.6rem,13vw,11rem)] min-h-0 font-serif"
        fontFamily="inherit"
        fontSize="clamp(3.4rem, 12vw, 10.5rem)"
        fontWeight={500}
        color={ink.fg}
        highlightColor={ink.accent}
        glow={glow}
        align="left"
        particleSize={2.2}
        density={5}
        scatter={48}
        gatherDuration={1400}
        idleDrift={0.32}
        pointerRepel={36}
        repelRadius={110}
      />
      <ParticleText
        text={profile.lastName}
        className="h-[clamp(3.6rem,13vw,11rem)] min-h-0 font-serif"
        fontFamily="inherit"
        fontSize="clamp(3.4rem, 12vw, 10.5rem)"
        fontWeight={500}
        color={ink.fg}
        highlightColor={ink.accent}
        glow={glow}
        align="left"
        particleSize={2.2}
        density={5}
        scatter={48}
        gatherDuration={1400}
        stagger={520}
        idleDrift={0.32}
        pointerRepel={36}
        repelRadius={110}
      />
    </>
  );
}
