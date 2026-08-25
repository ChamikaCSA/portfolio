"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { profile } from "@/content/profile";
import { stackFrameworks } from "@/content/stack";
import { useOs } from "@/lib/os-context";
import { Stagger, STAGGER } from "@/components/fx/Stagger";
import { APP_WIDTH } from "@/lib/apps";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { MorphingText } from "@/components/ui/morphing-text";
import { ParticleText } from "@/components/ui/particle-text";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import { TextAnimate } from "@/components/ui/text-animate";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import headshot from "@/assets/headshot.png";

export function Home() {
  const { setApp, booted, app } = useOs();
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [ink, setInk] = useState({
    fg: "#ebe6dc",
    accent: "#c8f542",
    flare: "#ff7a4a",
  });

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const fg = styles.getPropertyValue("--fg").trim();
    const accent = styles.getPropertyValue("--accent").trim();
    const flare = styles.getPropertyValue("--flare").trim();
    if (fg && accent && flare) setInk({ fg, accent, flare });
  }, [resolvedTheme]);

  const ready = booted || reduced;
  const portraitLive = !reduced && app === "home";

  return (
    <section
      className={cn(
        "relative flex h-full flex-col justify-end overflow-hidden",
        "pt-[calc(5rem+env(safe-area-inset-top,0px))] pb-[max(7rem,calc(5.75rem+env(safe-area-inset-bottom,0px)))]",
        APP_WIDTH,
      )}
    >
      {ready ? (
        <>
          <Stagger
            delay={STAGGER * 6}
            className="pointer-events-auto absolute top-[calc(4rem+env(safe-area-inset-top,0px))] right-5 z-10 sm:right-10 lg:hidden"
          >
            <HomePortrait
              live={portraitLive}
              accent={ink.accent}
              flare={ink.flare}
              paper={resolvedTheme === "light"}
            />
          </Stagger>

          <div className="relative z-10 grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10">
            <div>
              <Stagger delay={STAGGER * 0}>
                <AnimatedGradientText
                  speed={0.8}
                  colorFrom="var(--accent)"
                  colorTo="var(--flare)"
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
              <Stagger delay={STAGGER * 7} className="mt-8 lg:hidden">
                <EnterProjects onOpen={() => setApp("projects")} />
              </Stagger>
            </div>

            <div className="hidden lg:flex lg:flex-col lg:items-end lg:gap-8 lg:pb-3">
              <Stagger delay={STAGGER * 6} className="-translate-y-12">
                <HomePortrait
                  live={portraitLive}
                  accent={ink.accent}
                  flare={ink.flare}
                  paper={resolvedTheme === "light"}
                />
              </Stagger>
              <Stagger delay={STAGGER * 7}>
                <EnterProjects onOpen={() => setApp("projects")} />
              </Stagger>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

function EnterProjects({ onOpen }: { onOpen: () => void }) {
  return (
    <InteractiveHoverButton
      type="button"
      onClick={onOpen}
      className="h-11 rounded-2xl border border-line px-5 font-mono text-[11px] font-normal tracking-[0.2em] text-fg uppercase [&_svg]:size-3.5"
    >
      enter projects
    </InteractiveHoverButton>
  );
}

function HomePortrait({
  live,
  accent,
  flare,
  paper,
}: {
  live: boolean;
  accent: string;
  flare: string;
  paper: boolean;
}) {
  const [size, setSize] = useState({ w: 168, h: 210 });

  useEffect(() => {
    const sync = () => {
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      setSize(wide ? { w: 304, h: 380 } : { w: 168, h: 210 });
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return (
    <div className="[-webkit-mask-composite:source-in] mask-intersect [-webkit-mask-image:linear-gradient(to_bottom,#000_68%,transparent),linear-gradient(to_right,transparent,#000_8%),linear-gradient(to_bottom_right,#000_48%,transparent_82%),linear-gradient(to_bottom_left,#000_48%,transparent_82%)] mask-[linear-gradient(to_bottom,#000_68%,transparent),linear-gradient(to_right,transparent,#000_8%),linear-gradient(to_bottom_right,#000_48%,transparent_82%),linear-gradient(to_bottom_left,#000_48%,transparent_82%)]">
      <PixelatedCanvas
        src={headshot.src}
        width={size.w}
        height={size.h}
        cellSize={3}
        dotScale={0.9}
        shape="circle"
        dropoutStrength={0.08}
        luminanceKnockout={3}
        interactive={live}
        distortionMode="repel"
        distortionStrength={16}
        distortionRadius={96}
        jitterStrength={2}
        jitterSpeed={3}
        fadeOnLeave
        tintStrength={0}
        monochromeColor={accent}
        monochromeColorB={flare}
        monochromePaper={paper}
        objectFit="contain"
        alt={`${profile.name}, pixelated portrait`}
      />
    </div>
  );
}

function HomeName({
  ink,
  glow,
}: {
  ink: { fg: string; accent: string; flare: string };
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
        highlightColorB={ink.flare}
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
        highlightColorB={ink.flare}
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
