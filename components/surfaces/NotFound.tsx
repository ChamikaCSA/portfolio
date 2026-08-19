"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { profile } from "@/content/profile";
import { SURFACE_PAGE } from "@/lib/surfaces";
import { useOs } from "@/lib/os-context";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { OsLabel } from "@/components/fx/OsLabel";
import { Stagger, STAGGER } from "@/components/fx/Stagger";
import { FuzzyText } from "@/components/ui/fuzzy-text";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export function NotFoundSurface() {
  const { setSurface } = useOs();
  const { resolvedTheme } = useTheme();
  const reduced = useReducedMotion();
  const [color, setColor] = useState("#ebe6dc");

  useEffect(() => {
    const next = getComputedStyle(document.documentElement)
      .getPropertyValue("--fg")
      .trim();
    if (next) setColor(next);
  }, [resolvedTheme]);

  return (
    <section className={`flex flex-col justify-center ${SURFACE_PAGE}`}>
      <OsLabel text="kernel / 404" />
      <h1 className="mt-2">
        <span className="sr-only">404 surface not found</span>
        <FuzzyText
          className="-ml-7 max-w-full font-serif sm:-ml-8"
          fontFamily="inherit"
          fontSize="clamp(1.85rem, 6.2vw, 3rem)"
          fontWeight={400}
          color={color}
          fuzzRange={8}
          enableHover={!reduced}
          baseIntensity={reduced ? 0 : 0.16}
          hoverIntensity={0.42}
        >
          404 surface not found
        </FuzzyText>
      </h1>
      <Stagger delay={STAGGER}>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-muted sm:text-base">
          This path isn’t mounted in {profile.osName}. It doesn’t map to a
          surface or module.
        </p>
      </Stagger>
      <Stagger delay={STAGGER * 2}>
        <InteractiveHoverButton
          type="button"
          onClick={() => setSurface("home")}
          className="mt-10 h-11 rounded-2xl border border-line px-5 font-mono text-[11px] font-normal tracking-[0.2em] text-fg uppercase [&_svg]:size-3.5"
        >
          return home
        </InteractiveHoverButton>
      </Stagger>
    </section>
  );
}
